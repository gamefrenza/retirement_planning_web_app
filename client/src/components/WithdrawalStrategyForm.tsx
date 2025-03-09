import React, { useState, FormEvent } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { WithdrawalStrategy, WithdrawalRule } from '../types';

const WithdrawalStrategyForm: React.FC = () => {
  const { withdrawalStrategy, setWithdrawalStrategy } = useRetirement();
  
  const [rules, setRules] = useState<WithdrawalRule[]>(withdrawalStrategy.rules);
  const [defaultRate, setDefaultRate] = useState<number>(withdrawalStrategy.defaultRate);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Sort rules by threshold in descending order
    const sortedRules = [...rules].sort((a, b) => b.marketReturnThreshold - a.marketReturnThreshold);
    
    // Update withdrawal strategy in context
    const newStrategy: WithdrawalStrategy = {
      rules: sortedRules,
      defaultRate
    };
    
    setWithdrawalStrategy(newStrategy);
  };
  
  const handleRuleChange = (index: number, field: keyof WithdrawalRule, value: number) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setRules(updatedRules);
  };
  
  const addRule = () => {
    setRules([...rules, { marketReturnThreshold: 0, withdrawalRate: 3 }]);
  };
  
  const removeRule = (index: number) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Strategy</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Withdrawal Rules</h3>
          <p className="text-sm text-gray-600 mb-4">
            Define withdrawal rates based on market performance thresholds.
            Rules are applied in order from highest to lowest threshold.
          </p>
          
          {rules.map((rule, index) => (
            <div key={index} className="flex flex-wrap items-end gap-4 mb-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Market Return Threshold (%)
                </label>
                <input
                  type="number"
                  value={rule.marketReturnThreshold}
                  onChange={(e) => handleRuleChange(index, 'marketReturnThreshold', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  step="0.1"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-4">
            <button
              type="button"
              onClick={addRule}
              className="bg-secondary hover:bg-secondary-dark text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Add Rule
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="defaultRate" className="block text-gray-700 font-medium mb-2">
            Default Withdrawal Rate (%)
          </label>
          <input
            type="number"
            id="defaultRate"
            value={defaultRate}
            onChange={(e) => setDefaultRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            step="0.1"
            min="0"
            max="100"
            required
          />
          <p className="text-sm text-gray-600 mt-1">
            This rate will be used if no rules match the current market conditions.
          </p>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Strategy
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawalStrategyForm; 