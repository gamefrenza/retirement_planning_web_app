import React, { useState } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { WithdrawalCalculation } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WithdrawalResults: React.FC = () => {
  const { withdrawalCalculations, calculateWithdrawals } = useRetirement();
  const [years, setYears] = useState<number>(30);
  
  const handleCalculate = () => {
    calculateWithdrawals(years);
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Calculations</h2>
      
      <div className="mb-6">
        <div className="flex items-end gap-4">
          <div>
            <label htmlFor="years" className="block text-gray-700 font-medium mb-2">
              Projection Years
            </label>
            <input
              type="number"
              id="years"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              min="1"
              max="100"
              required
            />
          </div>
          
          <div>
            <button
              type="button"
              onClick={handleCalculate}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
      
      {withdrawalCalculations.length > 0 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Portfolio Value Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={withdrawalCalculations}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#0078d4" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="withdrawalAmount" name="Withdrawal Amount" stroke="#5c2d91" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Return</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inflation Rate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal Rate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonds</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawalCalculations.map((calc: WithdrawalCalculation) => (
                  <tr key={calc.year}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{calc.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(calc.portfolioValue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercentage(calc.marketReturn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercentage(calc.inflationRate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercentage(calc.withdrawalRate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(calc.withdrawalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(calc.cashWithdrawal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(calc.bondsWithdrawal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(calc.equityWithdrawal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {withdrawalCalculations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Click the Calculate button to generate withdrawal projections.
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalResults; 