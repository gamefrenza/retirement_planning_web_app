// Basic type definitions for the retirement planning app

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

// Withdrawal strategy types
export interface WithdrawalRule {
  threshold: number;
  rate: number;
}

export interface WithdrawalStrategy {
  rules: WithdrawalRule[];
  defaultRate: number;
}

// Market data types
export interface MarketData {
  year: number;
  sp500Return: number | null;
  inflationRate: number | null;
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

// Simple placeholder for React types to avoid errors
export type ReactNode = any;
export type FormEvent = any; 