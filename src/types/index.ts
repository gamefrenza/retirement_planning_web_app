// Export React-specific types
export * from './react-app';

// Asset allocation types
export interface AssetAllocation {
  cash: number;
  bonds: number;
  equity: number;
}

export interface RetirementAssets {
  totalAmount: number;
  allocation: AssetAllocation;
}

// Market data types
export interface MarketData {
  year: number;
  sp500Return: number | null;
  inflationRate: number | null;
}

// Withdrawal strategy types
export interface WithdrawalRule {
  threshold: number;
  rate: number;
}

export interface WithdrawalStrategy {
  rules: WithdrawalRule[];
  defaultRate: number;
}

// Withdrawal calculation types
export interface WithdrawalCalculation {
  year: number;
  marketReturn: number;
  inflationRate: number;
  withdrawalRate: number;
  withdrawalAmount: number;
  portfolioValue: number;
  inflationAdjustedWithdrawal: number;
}

// Context types
export interface RetirementContextType {
  assets: RetirementAssets;
  setAssets: (assets: RetirementAssets) => void;
  withdrawalStrategy: WithdrawalStrategy;
  setWithdrawalStrategy: (strategy: WithdrawalStrategy) => void;
  withdrawalCalculations: WithdrawalCalculation[];
  calculateWithdrawals: (years: number) => void;
  marketData: MarketData[];
  isLoading: boolean;
  error: string | null;
} 