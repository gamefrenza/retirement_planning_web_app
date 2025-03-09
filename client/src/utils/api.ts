import axios from 'axios';
import { MarketData } from '../types';

// Base URL for API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Market data API calls
export const getMarketData = async (): Promise<MarketData[]> => {
  try {
    const response = await api.get('/market-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

export const getHistoricalReturns = async (): Promise<{ year: number; return: number }[]> => {
  try {
    const response = await api.get('/market-data/returns');
    return response.data;
  } catch (error) {
    console.error('Error fetching historical returns:', error);
    throw error;
  }
};

export const getInflationRates = async (): Promise<{ year: number; rate: number }[]> => {
  try {
    const response = await api.get('/market-data/inflation');
    return response.data;
  } catch (error) {
    console.error('Error fetching inflation rates:', error);
    throw error;
  }
};

// Update market data for specified years
export const updateMarketData = async (
  startYear: number,
  endYear: number,
  source: 'web' | 'api'
): Promise<{ message: string }> => {
  try {
    const response = await api.post('/market-data/update', {
      startYear,
      endYear,
      source
    });
    return response.data;
  } catch (error) {
    console.error('Error updating market data:', error);
    throw error;
  }
}; 