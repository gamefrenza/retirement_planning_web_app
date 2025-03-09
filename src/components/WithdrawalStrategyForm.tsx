import React, { useState } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { WithdrawalStrategy, WithdrawalRule } from '../types';

const WithdrawalStrategyForm: React.FC = () => {
  const { withdrawalStrategy, setWithdrawalStrategy } = useRetirement();
  
  const [rules, setRules] = useState(withdrawalStrategy.rules);
  const [defaultRate, setDefaultRate] = useState(withdrawalStrategy.defaultRate);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Sort rules by threshold in descending order
    const sortedRules = [...rules].sort((a, b) => b.marketReturnThreshold - a.marketReturnThreshold);
    
    // Create new strategy
    const newStrategy: WithdrawalStrategy = {
      rules: sortedRules,
      defaultRate
    };
    
    // Update strategy in context
    setWithdrawalStrategy(newStrategy);
  };
  
  const handleAddRule = () => {
    setRules([...rules, { marketReturnThreshold: 0, withdrawalRate: 3 }]);
  };
  
  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_: WithdrawalRule, i: number) => i !== index));
  };
  
  const handleRuleChange = (index: number, field: keyof WithdrawalRule, value: number) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Strategy</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Withdrawal Rules</h3>
          <p className="text-sm text-gray-600 mb-4">
            Define rules for withdrawal rates based on market return thresholds. Rules are applied in order from highest to lowest threshold.
          </p>
          
          {rules.map((rule: WithdrawalRule, index: number) => (
            <div key={index} className="flex flex-wrap items-end gap-4 mb-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Market Return Threshold (%)
                </label>
                <input
                  type="number"
                  value={rule.marketReturnThreshold}
                  onChange={(e) => handleRuleChange(index, 'marketReturnThreshold', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Withdrawal Rate (%)
                </label>
                <input
                  type="number"
                  value={rule.withdrawalRate}
                  onChange={(e) => handleRuleChange(index, 'withdrawalRate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>
              
              <button
                type="button"
                onClick={() => handleRemoveRule(index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddRule}
            className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add Rule
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Default Withdrawal Rate (%)
          </label>
          <input
            type="number"
            value={defaultRate}
            onChange={(e) => setDefaultRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            step="0.1"
            min="0"
            max="10"
          />
          <p className="text-sm text-gray-600 mt-1">
            This rate is used when no rules match the current market conditions.
          </p>
        </div>
        
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
        >
          Save Strategy
        </button>
      </form>
    </div>
  );
};

export default WithdrawalStrategyForm; 