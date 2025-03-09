import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RetirementAssets, 
  AssetAllocation, 
  WithdrawalStrategy, 
  WithdrawalRule,
  WithdrawalCalculation,
  MarketData
} from '../types';
import { getMarketData } from '../utils/api';

interface RetirementContextType {
  assets: RetirementAssets;
  setAssets: (assets: RetirementAssets) => void;
  withdrawalStrategy: WithdrawalStrategy;
  setWithdrawalStrategy: (strategy: WithdrawalStrategy) => void;
  withdrawalCalculations: WithdrawalCalculation[];
  setWithdrawalCalculations: (calculations: WithdrawalCalculation[]) => void;
  calculateWithdrawals: (years: number) => void;
  marketData: MarketData[];
  isLoading: boolean;
  error: string | null;
}

const defaultAssetAllocation: AssetAllocation = {
  cash: 10,
  bonds: 40,
  equity: 50
};

const defaultRetirementAssets: RetirementAssets = {
  totalAmount: 1000000,
  allocation: defaultAssetAllocation
};

const defaultWithdrawalRules: WithdrawalRule[] = [
  { marketReturnThreshold: 5, withdrawalRate: 4 },
  { marketReturnThreshold: 0, withdrawalRate: 3 },
  { marketReturnThreshold: -100, withdrawalRate: 2.5 }
];

const defaultWithdrawalStrategy: WithdrawalStrategy = {
  rules: defaultWithdrawalRules,
  defaultRate: 3
};

interface RetirementProviderProps {
  children: React.ReactNode;
}

const RetirementContext = createContext<RetirementContextType | undefined>(undefined);

export const useRetirement = (): RetirementContextType => {
  const context = useContext(RetirementContext);
  if (context === undefined) {
    throw new Error('useRetirement must be used within a RetirementProvider');
  }
  return context;
};

export const RetirementProvider: React.FC<RetirementProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState(defaultRetirementAssets);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState(defaultWithdrawalStrategy);
  const [withdrawalCalculations, setWithdrawalCalculations] = useState<WithdrawalCalculation[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getMarketData();
        const sortedData = [...data].sort((a, b) => b.year - a.year);
        setMarketData(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data. Using simulated data instead.');
        const sampleData: MarketData[] = [];
        for (let year = 2024; year >= 2004; year--) {
          sampleData.push({
            year,
            sp500Return: Math.random() * 20 - 5,
            inflationRate: Math.random() * 4 + 1
          });
        }
        setMarketData(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateWithdrawals = (years: number): void => {
    // ... existing calculation logic ...
    const calculations: WithdrawalCalculation[] = [];
    
    // Start with initial portfolio allocation
    let currentPortfolioValue = assets.totalAmount;
    let currentCash = assets.totalAmount * (assets.allocation.cash / 100);
    let currentBonds = assets.totalAmount * (assets.allocation.bonds / 100);
    let currentEquity = assets.totalAmount * (assets.allocation.equity / 100);
    
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      
      // Get market data for this year or use random values
      let marketReturn: number;
      let inflationRate: number;
      
      // Try to find historical data for past years
      const historicalData = marketData.find((data: MarketData) => data.year === year);
      
      if (historicalData && historicalData.sp500Return !== null && historicalData.inflationRate !== null) {
        // Use historical data
        marketReturn = historicalData.sp500Return;
        inflationRate = historicalData.inflationRate;
      } else {
        // For future years, use average of historical data (2004-2024)
        const historicalReturns = marketData
          .filter((data: MarketData) => data.sp500Return !== null)
          .map((data: MarketData) => data.sp500Return as number);
        
        const historicalInflation = marketData
          .filter((data: MarketData) => data.inflationRate !== null)
          .map((data: MarketData) => data.inflationRate as number);
        
        // Calculate averages
        const avgReturn = historicalReturns.reduce((sum, val) => sum + val, 0) / historicalReturns.length;
        const avgInflation = historicalInflation.reduce((sum, val) => sum + val, 0) / historicalInflation.length;
        
        // Add some randomness around the average
        marketReturn = avgReturn + (Math.random() * 10 - 5); // Average ±5%
        inflationRate = avgInflation + (Math.random() * 1 - 0.5); // Average ±0.5%
      }
      
      // Determine withdrawal rate based on market return
      let withdrawalRate = withdrawalStrategy.defaultRate;
      for (const rule of withdrawalStrategy.rules) {
        if (marketReturn >= rule.marketReturnThreshold) {
          withdrawalRate = rule.withdrawalRate;
          break;
        }
      }
      
      // Calculate withdrawal amount
      const withdrawalAmount = (currentPortfolioValue * withdrawalRate) / 100;
      
      // Simple withdrawal calculation for demo
      const remainingPortfolio = currentPortfolioValue - withdrawalAmount;
      
      // Add to calculations
      calculations.push({
        year,
        portfolioValue: currentPortfolioValue,
        marketReturn,
        inflationRate,
        withdrawalRate,
        withdrawalAmount,
        remainingPortfolio,
        cashWithdrawal: withdrawalAmount * (assets.allocation.cash / 100),
        bondsWithdrawal: withdrawalAmount * (assets.allocation.bonds / 100),
        equityWithdrawal: withdrawalAmount * (assets.allocation.equity / 100)
      });
      
      // Update portfolio value for next year
      currentPortfolioValue = remainingPortfolio * (1 + marketReturn / 100);
    }
    
    setWithdrawalCalculations(calculations);
  };

  const value: RetirementContextType = {
    assets,
    setAssets,
    withdrawalStrategy,
    setWithdrawalStrategy,
    withdrawalCalculations,
    setWithdrawalCalculations,
    calculateWithdrawals,
    marketData,
    isLoading,
    error
  };

  return (
    <RetirementContext.Provider value={value}>
      {children}
    </RetirementContext.Provider>
  );
};

export default RetirementProvider; 