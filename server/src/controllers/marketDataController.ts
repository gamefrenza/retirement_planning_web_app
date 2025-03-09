import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { MarketData } from '../models/MarketData';

// Path to local data files
const dataDir = path.join(__dirname, '../../data');
const returnsFilePath = path.join(dataDir, 'sp500_returns.json');
const inflationFilePath = path.join(dataDir, 'inflation_rates.json');

// FRED API configuration
const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const SP500_SERIES = 'SP500'; // S&P 500 Index
const CPI_SERIES = 'CPIAUCSL'; // Consumer Price Index for All Urban Consumers

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default data to use if files don't exist or are empty
const defaultReturnsData = [
  { year: 2024, return: 23.31 },
  { year: 2023, return: 24.23 },
  { year: 2022, return: -19.44 },
  { year: 2021, return: 26.89 },
  { year: 2020, return: 16.26 },
  { year: 2019, return: 28.88 },
  { year: 2018, return: -6.24 },
  { year: 2017, return: 19.42 },
  { year: 2016, return: 9.54 },
  { year: 2015, return: -0.73 },
  { year: 2014, return: 11.39 },
  { year: 2013, return: 29.60 },
  { year: 2012, return: 13.41 },
  { year: 2011, return: 0.00 },
  { year: 2010, return: 12.78 },
  { year: 2009, return: 23.45 },
  { year: 2008, return: -38.49 },
  { year: 2007, return: 3.53 },
  { year: 2006, return: 13.62 },
  { year: 2005, return: 3.00 },
  { year: 2004, return: 8.99 }
];

const defaultInflationData = [
  { year: 2024, rate: 3.10 },
  { year: 2023, rate: 4.12 },
  { year: 2022, rate: 8.00 },
  { year: 2021, rate: 4.70 },
  { year: 2020, rate: 1.23 },
  { year: 2019, rate: 1.81 },
  { year: 2018, rate: 2.44 },
  { year: 2017, rate: 2.13 },
  { year: 2016, rate: 1.26 },
  { year: 2015, rate: 0.12 },
  { year: 2014, rate: 1.62 },
  { year: 2013, rate: 1.46 },
  { year: 2012, rate: 2.07 },
  { year: 2011, rate: 3.16 },
  { year: 2010, rate: 1.64 },
  { year: 2009, rate: -0.36 },
  { year: 2008, rate: 3.84 },
  { year: 2007, rate: 2.85 },
  { year: 2006, rate: 3.24 },
  { year: 2005, rate: 3.39 },
  { year: 2004, rate: 2.68 }
];

// Check if files exist, if not create them with default data
if (!fs.existsSync(returnsFilePath) || fs.readFileSync(returnsFilePath, 'utf8').trim() === '') {
  fs.writeFileSync(returnsFilePath, JSON.stringify(defaultReturnsData, null, 2));
}

if (!fs.existsSync(inflationFilePath) || fs.readFileSync(inflationFilePath, 'utf8').trim() === '') {
  fs.writeFileSync(inflationFilePath, JSON.stringify(defaultInflationData, null, 2));
}

interface ReturnData {
  year: number;
  return: number;
}

interface InflationData {
  year: number;
  rate: number;
}

// @desc    Get market data (S&P 500 returns and inflation rates)
// @route   GET /api/market-data
// @access  Public
export const getMarketData = async (req: Request, res: Response) => {
  try {
    // Read data from local files
    const returnsData: ReturnData[] = JSON.parse(fs.readFileSync(returnsFilePath, 'utf8'));
    const inflationData: InflationData[] = JSON.parse(fs.readFileSync(inflationFilePath, 'utf8'));

    // Combine data
    const marketData: MarketData[] = [];
    
    // Get unique years from both datasets
    const years = new Set([
      ...returnsData.map((item: ReturnData) => item.year),
      ...inflationData.map((item: InflationData) => item.year)
    ]);
    
    // Create combined dataset
    Array.from(years).sort().forEach((year: number) => {
      const returnItem = returnsData.find((item: ReturnData) => item.year === year);
      const inflationItem = inflationData.find((item: InflationData) => item.year === year);
      
      marketData.push({
        year: year,
        sp500Return: returnItem ? returnItem.return : null,
        inflationRate: inflationItem ? inflationItem.rate : null
      });
    });

    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to fetch data from FRED API
const fetchFredData = async (series: string, startDate: string, endDate: string): Promise<any> => {
  if (!FRED_API_KEY) {
    throw new Error('FRED API key is not configured');
  }
  
  try {
    const response = await axios.get(FRED_BASE_URL, {
      params: {
        series_id: series,
        api_key: FRED_API_KEY,
        file_type: 'json',
        observation_start: startDate,
        observation_end: endDate,
        frequency: 'a', // annual
      }
    });
    
    return response.data.observations;
  } catch (error) {
    console.error(`Error fetching data from FRED API for series ${series}:`, error);
    throw error;
  }
};

// @desc    Get historical S&P 500 returns
// @route   GET /api/market-data/returns
// @access  Public
export const getHistoricalReturns = async (req: Request, res: Response) => {
  try {
    // Read data from local file
    let returnsData: ReturnData[] = [];
    
    try {
      returnsData = JSON.parse(fs.readFileSync(returnsFilePath, 'utf8'));
    } catch (readError) {
      console.error('Error reading returns data file:', readError);
    }
    
    // If file is empty or corrupted, use default data
    if (returnsData.length === 0) {
      returnsData = defaultReturnsData;
      
      // Save default data to file
      fs.writeFileSync(returnsFilePath, JSON.stringify(returnsData, null, 2));
    }
    
    // If FRED API key is configured, we could update the data
    if (FRED_API_KEY) {
      // This would be implemented in a production environment
      console.log('FRED API key is configured. Could update data from FRED API.');
    }
    
    res.json(returnsData);
  } catch (error) {
    console.error('Error fetching S&P 500 returns:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get historical inflation rates
// @route   GET /api/market-data/inflation
// @access  Public
export const getInflationRates = async (req: Request, res: Response) => {
  try {
    // Read data from local file
    let inflationData: InflationData[] = [];
    
    try {
      inflationData = JSON.parse(fs.readFileSync(inflationFilePath, 'utf8'));
    } catch (readError) {
      console.error('Error reading inflation data file:', readError);
    }
    
    // If file is empty or corrupted, use default data
    if (inflationData.length === 0) {
      inflationData = defaultInflationData;
      
      // Save default data to file
      fs.writeFileSync(inflationFilePath, JSON.stringify(inflationData, null, 2));
    }
    
    // If FRED API key is configured, we could update the data
    if (FRED_API_KEY) {
      // This would be implemented in a production environment
      console.log('FRED API key is configured. Could update data from FRED API.');
    }
    
    res.json(inflationData);
  } catch (error) {
    console.error('Error fetching inflation rates:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 