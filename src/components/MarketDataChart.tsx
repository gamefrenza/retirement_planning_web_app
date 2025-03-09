import React, { useState } from 'react';
import { useRetirement } from '../context/RetirementContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketDataChart = (): JSX.Element => {
  const { marketData, isLoading } = useRetirement();
  const [timeRange, setTimeRange] = useState<number>(10); // Default to 10 years

  if (isLoading || marketData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Market Data</h2>
        <p>Loading market data...</p>
      </div>
    );
  }

  // Filter data to show only the selected time range
  const filteredData = marketData.slice(0, timeRange);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Market Data</h2>
      
      <div className="mb-4">
        <label htmlFor="timeRange" className="block text-gray-700 font-medium mb-2">
          Time Range (years)
        </label>
        <input
          type="range"
          id="timeRange"
          min="1"
          max={Math.min(20, marketData.length)}
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>1 year</span>
          <span>{Math.min(20, marketData.length)} years</span>
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sp500Return" name="S&P 500 Return (%)" stroke="#0078d4" />
            <Line type="monotone" dataKey="inflationRate" name="Inflation Rate (%)" stroke="#d13438" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketDataChart; 