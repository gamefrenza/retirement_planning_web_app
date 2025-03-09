import React, { useState, ChangeEvent } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { RetirementAssets, AssetAllocation } from '../types';

const AssetAllocationForm = (): JSX.Element => {
  const { assets, setAssets } = useRetirement();
  
  const [totalAmount, setTotalAmount] = useState(assets.totalAmount);
  const [cashPercentage, setCashPercentage] = useState(assets.allocation.cash);
  const [bondsPercentage, setBondsPercentage] = useState(assets.allocation.bonds);
  const [equityPercentage, setEquityPercentage] = useState(assets.allocation.equity);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Validate that percentages add up to 100
    const total = cashPercentage + bondsPercentage + equityPercentage;
    if (total !== 100) {
      setError(`Allocation percentages must add up to 100%. Current total: ${total}%`);
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Create new asset allocation
    const newAllocation: AssetAllocation = {
      cash: cashPercentage,
      bonds: bondsPercentage,
      equity: equityPercentage
    };
    
    // Update assets in context
    const newAssets: RetirementAssets = {
      totalAmount,
      allocation: newAllocation
    };
    
    setAssets(newAssets);
  };

  const handleNumberInput = (e: ChangeEvent<HTMLInputElement>, setter: (value: number) => void): void => {
    setter(Number(e.target.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="totalAmount" className="block text-gray-700 font-medium mb-2">
            Total Retirement Assets ($)
          </label>
          <input
            type="number"
            id="totalAmount"
            value={totalAmount}
            onChange={(e) => handleNumberInput(e, setTotalAmount)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            min="0"
            required
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="cashPercentage" className="block text-gray-700 font-medium mb-2">
              Cash (%)
            </label>
            <input
              type="number"
              id="cashPercentage"
              value={cashPercentage}
              onChange={(e) => handleNumberInput(e, setCashPercentage)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              max="100"
              required
            />
          </div>
          
          <div>
            <label htmlFor="bondsPercentage" className="block text-gray-700 font-medium mb-2">
              Bonds (%)
            </label>
            <input
              type="number"
              id="bondsPercentage"
              value={bondsPercentage}
              onChange={(e) => handleNumberInput(e, setBondsPercentage)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              max="100"
              required
            />
          </div>
          
          <div>
            <label htmlFor="equityPercentage" className="block text-gray-700 font-medium mb-2">
              Equity (%)
            </label>
            <input
              type="number"
              id="equityPercentage"
              value={equityPercentage}
              onChange={(e) => handleNumberInput(e, setEquityPercentage)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              max="100"
              required
            />
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium">
            Total: {cashPercentage + bondsPercentage + equityPercentage}%
          </p>
        </div>
        
        <button
          type="submit"
          className="mt-6 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
        >
          Save Allocation
        </button>
      </form>
    </div>
  );
};

export default AssetAllocationForm; 