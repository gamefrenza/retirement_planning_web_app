import React from 'react';
import { useRetirement } from '../context/RetirementContext';

const HistoricalDataTable: React.FC = () => {
  const { marketData, isLoading, error } = useRetirement();

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Historical Market Data</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Historical Market Data</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Historical Market Data (2004-2024)</h2>
      <p className="text-sm text-gray-600 mb-4">
        This data is used for historical analysis and future projections.
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S&P 500 Return</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inflation Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData.map((data) => (
              <tr key={data.year}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.year}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${data.sp500Return && data.sp500Return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.sp500Return !== null ? formatPercentage(data.sp500Return) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.inflationRate !== null ? formatPercentage(data.inflationRate) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Data sources:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>S&P 500 Returns: Historical data from macrotrends.net</li>
          <li>Inflation Rates: Historical CPI data</li>
        </ul>
      </div>
    </div>
  );
};

export default HistoricalDataTable; 