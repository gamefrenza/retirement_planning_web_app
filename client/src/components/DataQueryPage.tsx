import React, { useState } from 'react';
import { updateMarketData } from '../utils/api';

const DataQueryPage: React.FC = () => {
  const [startYear, setStartYear] = useState<number>(2004);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [dataSource, setDataSource] = useState<'web' | 'api'>('web');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Validate input
      if (startYear > endYear) {
        throw new Error('Start year must be less than or equal to end year');
      }

      if (startYear < 1900 || endYear > new Date().getFullYear()) {
        throw new Error('Please enter valid years (1900 to current year)');
      }

      // Call the API service
      const response = await updateMarketData(startYear, endYear, dataSource);
      setMessage(response.message || 'Data updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Update Historical Market Data</h2>
      <p className="text-sm text-gray-600 mb-4">
        Use this form to update the S&P 500 returns and inflation rates data for a specific time period.
        The data will be saved to the local JSON files.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startYear" className="block text-gray-700 font-medium mb-2">
              Start Year
            </label>
            <input
              type="number"
              id="startYear"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              min="1900"
              max={new Date().getFullYear()}
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
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Data Source</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary"
                name="dataSource"
                value="web"
                checked={dataSource === 'web'}
                onChange={() => setDataSource('web')}
              />
              <span className="ml-2">Web Search</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary"
                name="dataSource"
                value="api"
                checked={dataSource === 'api'}
                onChange={() => setDataSource('api')}
              />
              <span className="ml-2">API Calls</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {dataSource === 'web' 
              ? 'Web Search: Scrapes data from financial websites' 
              : 'API Calls: Uses FRED API to retrieve official data (requires API key)'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Update Data'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-medium mb-2">Note:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Web Search method scrapes data from financial websites like macrotrends.net</li>
          <li>API Calls method uses the FRED API which requires an API key in the server's .env file</li>
          <li>Data will be saved to the local JSON files on the server</li>
          <li>The process may take a few moments to complete</li>
        </ul>
      </div>
    </div>
  );
};

export default DataQueryPage; 