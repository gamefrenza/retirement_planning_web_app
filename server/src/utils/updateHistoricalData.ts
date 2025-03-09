import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

// Function to update S&P 500 returns data
async function updateSP500Returns() {
  console.log('Updating S&P 500 returns data...');
  
  // This is where you would implement the logic to fetch data from an API
  // For now, we'll just use the existing data or create it if it doesn't exist
  
  try {
    // Check if file exists
    if (!fs.existsSync(returnsFilePath)) {
      console.log('S&P 500 returns file does not exist. Creating with default data...');
      
      // Default data
      const defaultData = [
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
      
      // Write to file
      fs.writeFileSync(returnsFilePath, JSON.stringify(defaultData, null, 2));
      console.log('S&P 500 returns file created successfully.');
    } else {
      console.log('S&P 500 returns file already exists.');
      
      // You could implement logic here to update the file with new data
      // For example, if a new year's data becomes available
    }
  } catch (error) {
    console.error('Error updating S&P 500 returns data:', error);
  }
}

// Function to update inflation rates data
async function updateInflationRates() {
  console.log('Updating inflation rates data...');
  
  // This is where you would implement the logic to fetch data from an API
  // For now, we'll just use the existing data or create it if it doesn't exist
  
  try {
    // Check if file exists
    if (!fs.existsSync(inflationFilePath)) {
      console.log('Inflation rates file does not exist. Creating with default data...');
      
      // Default data
      const defaultData = [
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
      
      // Write to file
      fs.writeFileSync(inflationFilePath, JSON.stringify(defaultData, null, 2));
      console.log('Inflation rates file created successfully.');
    } else {
      console.log('Inflation rates file already exists.');
      
      // You could implement logic here to update the file with new data
      // For example, if a new year's data becomes available
    }
  } catch (error) {
    console.error('Error updating inflation rates data:', error);
  }
}

// Function to add a new year's data to both files
export async function addNewYearData(year: number, sp500Return: number, inflationRate: number) {
  try {
    // Update S&P 500 returns
    let returnsData = [];
    if (fs.existsSync(returnsFilePath)) {
      returnsData = JSON.parse(fs.readFileSync(returnsFilePath, 'utf8'));
    }
    
    // Check if year already exists
    const existingReturnIndex = returnsData.findIndex((item: any) => item.year === year);
    if (existingReturnIndex !== -1) {
      // Update existing entry
      returnsData[existingReturnIndex].return = sp500Return;
    } else {
      // Add new entry
      returnsData.push({ year, return: sp500Return });
    }
    
    // Sort by year (descending)
    returnsData.sort((a: any, b: any) => b.year - a.year);
    
    // Write to file
    fs.writeFileSync(returnsFilePath, JSON.stringify(returnsData, null, 2));
    
    // Update inflation rates
    let inflationData = [];
    if (fs.existsSync(inflationFilePath)) {
      inflationData = JSON.parse(fs.readFileSync(inflationFilePath, 'utf8'));
    }
    
    // Check if year already exists
    const existingInflationIndex = inflationData.findIndex((item: any) => item.year === year);
    if (existingInflationIndex !== -1) {
      // Update existing entry
      inflationData[existingInflationIndex].rate = inflationRate;
    } else {
      // Add new entry
      inflationData.push({ year, rate: inflationRate });
    }
    
    // Sort by year (descending)
    inflationData.sort((a: any, b: any) => b.year - a.year);
    
    // Write to file
    fs.writeFileSync(inflationFilePath, JSON.stringify(inflationData, null, 2));
    
    console.log(`Data for year ${year} added/updated successfully.`);
    return true;
  } catch (error) {
    console.error('Error adding new year data:', error);
    return false;
  }
}

// Main function to update all data
async function updateAllData() {
  await updateSP500Returns();
  await updateInflationRates();
  console.log('All historical data updated successfully.');
}

// Run the update if this file is executed directly
if (require.main === module) {
  updateAllData().catch(console.error);
}

export { updateSP500Returns, updateInflationRates, updateAllData }; 