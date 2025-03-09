import { MarketData } from '../types';

export const getMarketData = async (): Promise<MarketData[]> => {
  try {
    const response = await fetch('/api/market-data');
    if (!response.ok) throw new Error('Failed to fetch market data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

export const updateMarketData = async (
  startYear: number,
  endYear: number,
  source: 'web' | 'api'
): Promise<void> => {
  try {
    const response = await fetch('/api/update-market-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startYear, endYear, source }),
    });
    if (!response.ok) throw new Error('Failed to update market data');
  } catch (error) {
    console.error('Error updating market data:', error);
    throw error;
  }
}; 