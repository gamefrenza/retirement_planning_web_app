import * as React from 'react';
import type { ReactNode, FC } from 'react';
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
  children: ReactNode;
}

const RetirementContext = React.createContext<RetirementContextType | undefined>(undefined);

export const useRetirement = (): RetirementContextType => {
  const context = React.useContext(RetirementContext);
  if (context === undefined) {
    throw new Error('useRetirement must be used within a RetirementProvider');
  }
  return context;
};

export const RetirementProvider: FC<RetirementProviderProps> = ({ children }) => {
  const [assets, setAssets] = React.useState<RetirementAssets>(defaultRetirementAssets);
  const [withdrawalStrategy, setWithdrawalStrategy] = React.useState<WithdrawalStrategy>(defaultWithdrawalStrategy);
  const [withdrawalCalculations, setWithdrawalCalculations] = React.useState<WithdrawalCalculation[]>([]);
  const [marketData, setMarketData] = React.useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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