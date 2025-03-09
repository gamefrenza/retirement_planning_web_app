import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
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

const RetirementContext = createContext<RetirementContextType | undefined>(undefined);

export const RetirementProvider: React.FC<RetirementProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<RetirementAssets>(defaultRetirementAssets);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState<WithdrawalStrategy>(defaultWithdrawalStrategy);
  const [withdrawalCalculations, setWithdrawalCalculations] = useState<WithdrawalCalculation[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ... existing code ...

  // Fix the type issues in the filter and map functions
  const historicalReturns = marketData
    .filter((data: MarketData) => data.sp500Return !== null)
    .map((data: MarketData) => data.sp500Return as number);

  const historicalInflation = marketData
    .filter((data: MarketData) => data.inflationRate !== null)
    .map((data: MarketData) => data.inflationRate as number);

  // ... rest of the existing code ...
} 