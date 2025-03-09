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
  sp500Return: number;
  inflationRate: number;
}

// Withdrawal strategy types
export interface WithdrawalRule {
  marketReturnThreshold: number;
  withdrawalRate: number;
}

export interface WithdrawalStrategy {
  rules: WithdrawalRule[];
  defaultRate: number;
}

// Withdrawal calculation types
export interface WithdrawalCalculation {
  year: number;
  portfolioValue: number;
  marketReturn: number;
  inflationRate: number;
  withdrawalRate: number;
  withdrawalAmount: number;
  remainingPortfolio: number;
  cashWithdrawal: number;
  bondsWithdrawal: number;
  equityWithdrawal: number;
} 