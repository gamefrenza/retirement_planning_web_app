import { MarketData } from '../types';

// Sample market data for development
const sampleMarketData: MarketData[] = Array.from({ length: 21 }, (_, i) => {
  const year = 2024 - i;
  return {
    year,
    sp500Return: Math.random() * 20 - 5, // Random between -5% and 15%
    inflationRate: Math.random() * 4 + 1  // Random between 1% and 5%
  };
});

/**
 * Fetch market data from the API or use sample data
 */
export const getMarketData = async (): Promise<MarketData[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch('/api/market-data');
    // const data = await response.json();
    // return data;
    
    // For now, return sample data
    return Promise.resolve(sampleMarketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return Promise.reject(error);
  }
};

/**
 * Update market data for a specific range of years
 */
export const updateMarketData = async (
  startYear: number,
  endYear: number,
  dataSource: 'web' | 'api'
): Promise<void> => {
  try {
    // In a real app, this would be an API call
    // await fetch('/api/update-market-data', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ startYear, endYear, dataSource }),
    // });
    
    // For now, just log the request and return a resolved promise
    console.log(`Updating market data from ${startYear} to ${endYear} using ${dataSource}`);
    return Promise.resolve();
  } catch (error) {
    console.error('Error updating market data:', error);
    return Promise.reject(error);
  }
}; 