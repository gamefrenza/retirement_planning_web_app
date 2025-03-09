import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface RetirementProviderProps {
  children: ReactNode;
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

// Default withdrawal rules based on the technical design
const defaultWithdrawalRules: WithdrawalRule[] = [
  { marketReturnThreshold: 5, withdrawalRate: 4 },
  { marketReturnThreshold: 0, withdrawalRate: 3 },
  { marketReturnThreshold: -100, withdrawalRate: 2.5 }
];

const defaultWithdrawalStrategy: WithdrawalStrategy = {
  rules: defaultWithdrawalRules,
  defaultRate: 3
};

const RetirementContext = createContext<RetirementContextType | undefined>(undefined);

export const RetirementProvider = ({ children }: RetirementProviderProps) => {
  const [assets, setAssets] = useState(defaultRetirementAssets);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState(defaultWithdrawalStrategy);
  const [withdrawalCalculations, setWithdrawalCalculations] = useState<WithdrawalCalculation[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch market data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getMarketData();
        // Sort data by year in descending order (most recent first)
        const sortedData = [...data].sort((a, b) => b.year - a.year);
        setMarketData(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data. Using simulated data instead.');
        // Generate some sample data if API fails
        const sampleData: MarketData[] = [];
        for (let year = 2024; year >= 2004; year--) {
          sampleData.push({
            year,
            sp500Return: Math.random() * 20 - 5, // Random between -5% and 15%
            inflationRate: Math.random() * 4 + 1 // Random between 1% and 5%
          });
        }
        setMarketData(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateWithdrawals = (years: number) => {
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
          .filter(data => data.sp500Return !== null)
          .map(data => data.sp500Return as number);
        
        const historicalInflation = marketData
          .filter(data => data.inflationRate !== null)
          .map(data => data.inflationRate as number);
        
        // Calculate averages (excluding extreme outliers)
        const sortedReturns = [...historicalReturns].sort((a, b) => a - b);
        const sortedInflation = [...historicalInflation].sort((a, b) => a - b);
        
        // Remove top and bottom 10% to get a more stable average
        const trimStart = Math.floor(sortedReturns.length * 0.1);
        const trimEnd = sortedReturns.length - trimStart;
        
        const trimmedReturns = sortedReturns.slice(trimStart, trimEnd);
        const trimmedInflation = sortedInflation.slice(trimStart, trimEnd);
        
        // Calculate average
        const avgReturn = trimmedReturns.reduce((sum, val) => sum + val, 0) / trimmedReturns.length;
        const avgInflation = trimmedInflation.reduce((sum, val) => sum + val, 0) / trimmedInflation.length;
        
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
      
      // Determine withdrawal sources based on market conditions
      // Following the withdrawal algorithm design from the technical spec:
      // 1. In good market years (returns > inflation + buffer), withdraw from equity
      // 2. In moderate years, withdraw from bonds
      // 3. In poor market years, withdraw from cash reserves
      
      let cashWithdrawal = 0;
      let bondsWithdrawal = 0;
      let equityWithdrawal = 0;
      
      const buffer = 2; // 2% buffer
      
      if (marketReturn < 0) {
        // Poor market year - prioritize cash
        cashWithdrawal = Math.min(withdrawalAmount, currentCash);
        const remainingWithdrawal = withdrawalAmount - cashWithdrawal;
        
        if (remainingWithdrawal > 0) {
          // If cash is depleted, use bonds
          bondsWithdrawal = Math.min(remainingWithdrawal, currentBonds);
          const stillRemainingWithdrawal = remainingWithdrawal - bondsWithdrawal;
          
          if (stillRemainingWithdrawal > 0) {
            // If bonds are depleted, use equity
            equityWithdrawal = stillRemainingWithdrawal;
          }
        }
      } else if (marketReturn >= 0 && marketReturn <= inflationRate + buffer) {
        // Moderate market year - prioritize bonds
        bondsWithdrawal = Math.min(withdrawalAmount, currentBonds);
        const remainingWithdrawal = withdrawalAmount - bondsWithdrawal;
        
        if (remainingWithdrawal > 0) {
          // If bonds are depleted, use cash
          cashWithdrawal = Math.min(remainingWithdrawal, currentCash);
          const stillRemainingWithdrawal = remainingWithdrawal - cashWithdrawal;
          
          if (stillRemainingWithdrawal > 0) {
            // If cash is depleted, use equity
            equityWithdrawal = stillRemainingWithdrawal;
          }
        }
      } else {
        // Good market year - prioritize equity
        equityWithdrawal = Math.min(withdrawalAmount, currentEquity);
        const remainingWithdrawal = withdrawalAmount - equityWithdrawal;
        
        if (remainingWithdrawal > 0) {
          // If equity is depleted, use bonds
          bondsWithdrawal = Math.min(remainingWithdrawal, currentBonds);
          const stillRemainingWithdrawal = remainingWithdrawal - bondsWithdrawal;
          
          if (stillRemainingWithdrawal > 0) {
            // If bonds are depleted, use cash
            cashWithdrawal = stillRemainingWithdrawal;
          }
        }
      }
      
      // Update current balances after withdrawal
      currentCash -= cashWithdrawal;
      currentBonds -= bondsWithdrawal;
      currentEquity -= equityWithdrawal;
      
      // Calculate remaining portfolio after withdrawal
      const remainingPortfolio = currentCash + currentBonds + currentEquity;
      
      // Simulate growth for next year
      currentEquity = currentEquity * (1 + marketReturn / 100);
      currentBonds = currentBonds * (1 + (marketReturn * 0.3) / 100); // Bonds grow at 30% of equity rate
      currentCash = currentCash * (1 + (inflationRate * 0.5) / 100); // Cash grows at 50% of inflation
      
      // Update total portfolio value
      currentPortfolioValue = currentCash + currentBonds + currentEquity;
      
      // Rebalance remaining assets annually to maintain target allocation
      const targetCash = currentPortfolioValue * (assets.allocation.cash / 100);
      const targetBonds = currentPortfolioValue * (assets.allocation.bonds / 100);
      const targetEquity = currentPortfolioValue * (assets.allocation.equity / 100);
      
      // Apply rebalancing
      currentCash = targetCash;
      currentBonds = targetBonds;
      currentEquity = targetEquity;
      
      calculations.push({
        year,
        portfolioValue: currentPortfolioValue,
        marketReturn,
        inflationRate,
        withdrawalRate,
        withdrawalAmount,
        remainingPortfolio,
        cashWithdrawal,
        bondsWithdrawal,
        equityWithdrawal
      });
    }
    
    setWithdrawalCalculations(calculations);
  };

  return (
    <RetirementContext.Provider
      value={{
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
      }}
    >
      {children}
    </RetirementContext.Provider>
  );
};

export const useRetirement = (): RetirementContextType => {
  const context = useContext(RetirementContext);
  if (context === undefined) {
    throw new Error('useRetirement must be used within a RetirementProvider');
  }
  return context;
}; 