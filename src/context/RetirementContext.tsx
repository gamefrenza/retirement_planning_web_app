import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RetirementAssets, 
  AssetAllocation, 
  WithdrawalStrategy, 
  WithdrawalRule,
  WithdrawalCalculation,
  MarketData,
  RetirementContextType,
  ReactNodeType
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
  children: ReactNodeType;
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

export const RetirementProvider = ({ children }: RetirementProviderProps): JSX.Element => {
  const [assets, setAssets] = useState<RetirementAssets>(defaultRetirementAssets);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState<WithdrawalStrategy>(defaultWithdrawalStrategy);
  const [withdrawalCalculations, setWithdrawalCalculations] = useState<WithdrawalCalculation[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    // Start with initial portfolio allocation
    let currentPortfolioValue = assets.totalAmount;
    const currentYear = new Date().getFullYear();
    const calculations: WithdrawalCalculation[] = [];
    
    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      
      // Get market data for this year or use random values
      let marketReturn: number;
      let inflationRate: number;
      
      // Try to find historical data for past years
      const historicalData = marketData.find(data => data.year === year);
      
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
        
        // Remove top and bottom 10% if enough data points
        const trimStart = Math.floor(sortedReturns.length * 0.1);
        const trimEnd = Math.ceil(sortedReturns.length * 0.9);
        
        const trimmedReturns = sortedReturns.slice(trimStart, trimEnd);
        const trimmedInflation = sortedInflation.slice(trimStart, trimEnd);
        
        // Calculate averages of trimmed data
        const avgReturn = trimmedReturns.reduce((sum, val) => sum + val, 0) / trimmedReturns.length;
        const avgInflation = trimmedInflation.reduce((sum, val) => sum + val, 0) / trimmedInflation.length;
        
        // Add some randomness around the average
        marketReturn = avgReturn + (Math.random() * 10 - 5); // Average ±5%
        inflationRate = avgInflation + (Math.random() * 1 - 0.5); // Average ±0.5%
      }
      
      // Determine withdrawal rate based on market return
      let withdrawalRate = withdrawalStrategy.defaultRate;
      for (const rule of withdrawalStrategy.rules) {
        if (marketReturn >= rule.threshold) {
          withdrawalRate = rule.rate;
          break;
        }
      }
      
      // Calculate withdrawal amount
      const withdrawalAmount = (currentPortfolioValue * withdrawalRate) / 100;
      
      // Calculate inflation-adjusted withdrawal
      const inflationAdjustedWithdrawal = withdrawalAmount * (1 + inflationRate / 100);
      
      // Add to calculations
      calculations.push({
        year,
        marketReturn,
        inflationRate,
        withdrawalRate,
        withdrawalAmount,
        portfolioValue: currentPortfolioValue,
        inflationAdjustedWithdrawal
      });
      
      // Update portfolio value for next year
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