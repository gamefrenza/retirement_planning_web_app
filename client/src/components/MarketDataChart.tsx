import React, { useState } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketDataChart: React.FC = () => {
  const { marketData, isLoading } = useRetirement();
  const [timeRange, setTimeRange] = useState<number>(10); // Default to 10 years

  if (isLoading || marketData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Historical Market Performance</h2>
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Filter data based on selected time range
  const filteredData = [...marketData]
    .sort((a, b) => a.year - b.year) // Sort by year ascending for the chart
    .slice(-timeRange); // Get the last N years

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Historical Market Performance</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value={5}>5 Years</option>
            <option value={10}>10 Years</option>
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
            <option value={100}>All Data</option>
          </select>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[-40, 40]} />
            <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sp500Return"
              name="S&P 500 Return"
              stroke="#0078d4"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="inflationRate"
              name="Inflation Rate"
              stroke="#5c2d91"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">Average S&P 500 Return:</span>{' '}
          {formatTooltipValue(
            filteredData.reduce((sum, item) => sum + (item.sp500Return || 0), 0) / filteredData.length
          )}
        </p>
        <p>
          <span className="font-medium">Average Inflation Rate:</span>{' '}
          {formatTooltipValue(
            filteredData.reduce((sum, item) => sum + (item.inflationRate || 0), 0) / filteredData.length
          )}
        </p>
      </div>
    </div>
  );
};

export default MarketDataChart; 