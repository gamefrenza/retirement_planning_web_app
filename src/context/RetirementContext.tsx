import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RetirementAssets, 
  AssetAllocation, 
  WithdrawalStrategy, 
  WithdrawalRule,
  WithdrawalCalculation,
  MarketData,
  RetirementContextType
} from '../types';
import { getMarketData } from '../utils/api';

// Default values
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
  { threshold: 5, rate: 4 },
  { threshold: 0, rate: 3 },
  { threshold: -100, rate: 2.5 }
];

const defaultWithdrawalStrategy: WithdrawalStrategy = {
  rules: defaultWithdrawalRules,
  defaultRate: 3
};

interface RetirementProviderProps {
  children: React.ReactNode;
}

// Create context with proper typing
const RetirementContext = createContext<RetirementContextType | undefined>(undefined);

export const useRetirement = (): RetirementContextType => {
  const context = useContext(RetirementContext);
  if (context === undefined) {
    throw new Error('useRetirement must be used within a RetirementProvider');
  }
  return context;
};

export const RetirementProvider: React.FC<RetirementProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<RetirementAssets>(defaultRetirementAssets);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState<WithdrawalStrategy>(defaultWithdrawalStrategy);
  const [withdrawalCalculations, setWithdrawalCalculations] = useState<WithdrawalCalculation[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
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

    void fetchData();
  }, []);

  const calculateWithdrawals = (years: number): void => {
    let currentPortfolioValue = assets.totalAmount;
    const currentYear = new Date().getFullYear();
    const calculations: WithdrawalCalculation[] = [];
    
    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      
      const historicalData = marketData.find(data => data.year === year);
      
      let marketReturn: number;
      let inflationRate: number;
      
      if (historicalData?.sp500Return != null && historicalData?.inflationRate != null) {
        marketReturn = historicalData.sp500Return;
        inflationRate = historicalData.inflationRate;
      } else {
        const historicalReturns = marketData
          .filter((data): data is MarketData & { sp500Return: number } => 
            data.sp500Return != null
          )
          .map(data => data.sp500Return);
        
        const historicalInflation = marketData
          .filter((data): data is MarketData & { inflationRate: number } => 
            data.inflationRate != null
          )
          .map(data => data.inflationRate);
        
        const sortedReturns = [...historicalReturns].sort((a, b) => a - b);
        const sortedInflation = [...historicalInflation].sort((a, b) => a - b);
        
        const trimStart = Math.floor(sortedReturns.length * 0.1);
        const trimEnd = Math.ceil(sortedReturns.length * 0.9);
        
        const trimmedReturns = sortedReturns.slice(trimStart, trimEnd);
        const trimmedInflation = sortedInflation.slice(trimStart, trimEnd);
        
        const avgReturn = trimmedReturns.reduce((sum, val) => sum + val, 0) / trimmedReturns.length;
        const avgInflation = trimmedInflation.reduce((sum, val) => sum + val, 0) / trimmedInflation.length;
        
        marketReturn = avgReturn + (Math.random() * 10 - 5);
        inflationRate = avgInflation + (Math.random() * 1 - 0.5);
      }
      
      let withdrawalRate = withdrawalStrategy.defaultRate;
      for (const rule of withdrawalStrategy.rules) {
        if (marketReturn >= rule.threshold) {
          withdrawalRate = rule.rate;
          break;
        }
      }
      
      const withdrawalAmount = (currentPortfolioValue * withdrawalRate) / 100;
      const inflationAdjustedWithdrawal = withdrawalAmount * (1 + inflationRate / 100);
      
      calculations.push({
        year,
        marketReturn,
        inflationRate,
        withdrawalRate,
        withdrawalAmount,
        portfolioValue: currentPortfolioValue,
        inflationAdjustedWithdrawal
      });
      
      currentPortfolioValue = (currentPortfolioValue - withdrawalAmount) * (1 + marketReturn / 100);
    }
    
    setWithdrawalCalculations(calculations);
  };

  const value: RetirementContextType = {
    assets,
    setAssets,
    withdrawalStrategy,
    setWithdrawalStrategy,
    withdrawalCalculations,
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