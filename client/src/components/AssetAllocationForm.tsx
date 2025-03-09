import React, { useState, FormEvent } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { RetirementAssets, AssetAllocation } from '../types';

const AssetAllocationForm: React.FC = () => {
  const { assets, setAssets } = useRetirement();
  
  const [totalAmount, setTotalAmount] = useState(assets.totalAmount);
  const [cashPercentage, setCashPercentage] = useState(assets.allocation.cash);
  const [bondsPercentage, setBondsPercentage] = useState(assets.allocation.bonds);
  const [equityPercentage, setEquityPercentage] = useState(assets.allocation.equity);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
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
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            min="0"
            required
          />
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Asset Allocation (%)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Allocate your assets between cash, bonds, and equity. Percentages must add up to 100%.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="cashPercentage" className="block text-gray-700 font-medium mb-2">
                Cash
              </label>
              <input
                type="number"
                id="cashPercentage"
                value={cashPercentage}
                onChange={(e) => setCashPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
                max="100"
                required
              />
            </div>
            
            <div>
              <label htmlFor="bondsPercentage" className="block text-gray-700 font-medium mb-2">
                Bonds
              </label>
              <input
                type="number"
                id="bondsPercentage"
                value={bondsPercentage}
                onChange={(e) => setBondsPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
                max="100"
                required
              />
            </div>
            
            <div>
              <label htmlFor="equityPercentage" className="block text-gray-700 font-medium mb-2">
                Equity
              </label>
              <input
                type="number"
                id="equityPercentage"
                value={equityPercentage}
                onChange={(e) => setEquityPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
                max="100"
                required
              />
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm font-medium">
              Total: {cashPercentage + bondsPercentage + equityPercentage}%
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Allocation
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetAllocationForm; 