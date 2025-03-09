import React, { useState } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { WithdrawalCalculation } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WithdrawalResults = (): JSX.Element => {
  const { withdrawalCalculations, calculateWithdrawals } = useRetirement();
  const [years, setYears] = useState(30);
  
  const handleCalculate = (): void => {
    calculateWithdrawals(years);
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom formatter for tooltip that handles any type of value
  const tooltipFormatter = (value: any): string => {
    return formatCurrency(Number(value));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Results</h2>
      
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              max="50"
              required
            />
          </div>
          
          <button
            type="button"
            onClick={handleCalculate}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md"
          >
            Calculate
          </button>
        </div>
      </div>
      
      {withdrawalCalculations.length > 0 ? (
        <div>
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inflation Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawalCalculations.map((calc: WithdrawalCalculation) => (
                  <tr key={calc.year}>
                    <td className="px-6 py-4 whitespace-nowrap">{calc.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{calc.marketReturn.toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{calc.inflationRate.toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{calc.withdrawalRate.toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(calc.withdrawalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(calc.portfolioValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={withdrawalCalculations}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#0078d4" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="withdrawalAmount" name="Withdrawal Amount" stroke="#5c2d91" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Click "Calculate" to generate withdrawal projections.</p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalResults; 