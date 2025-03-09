import React, { useState } from 'react';
import { updateMarketData } from '../utils/api';

const DataQueryPage = (): JSX.Element => {
  const [startYear, setStartYear] = useState<number>(2004);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [dataSource, setDataSource] = useState<'web' | 'api'>('web');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await updateMarketData(startYear, endYear, dataSource);
      setMessage('Market data updated successfully');
    } catch (err) {
      setError('Failed to update market data');
      console.error('Error updating market data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Update Market Data</h2>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startYear" className="block text-gray-700 font-medium mb-2">
              Start Year
            </label>
            <input
              type="number"
              id="startYear"
              value={startYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1900"
              max={endYear}
              required
            />
          </div>
          
          <div>
            <label htmlFor="endYear" className="block text-gray-700 font-medium mb-2">
              End Year
            </label>
            <input
              type="number"
              id="endYear"
              value={endYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min={startYear}
              max={new Date().getFullYear()}
              required
            />
          </div>
          
          <div>
            <label htmlFor="dataSource" className="block text-gray-700 font-medium mb-2">
              Data Source
            </label>
            <select
              id="dataSource"
              value={dataSource}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDataSource(e.target.value as 'web' | 'api')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="web">Web Scraping</option>
              <option value="api">API</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-6 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Updating...' : 'Update Data'}
        </button>
      </form>
    </div>
  );
};

export default DataQueryPage; 