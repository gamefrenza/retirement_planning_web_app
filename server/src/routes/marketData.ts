import express from 'express';
import { getMarketData, getHistoricalReturns, getInflationRates } from '../controllers/marketDataController';
import { updateMarketData } from '../controllers/marketDataUpdateController';

const router = express.Router();

// @route   GET api/market-data
// @desc    Get market data (S&P 500 returns and inflation rates)
// @access  Public
router.get('/', getMarketData);

// @route   GET api/market-data/returns
// @desc    Get historical S&P 500 returns
// @access  Public
router.get('/returns', getHistoricalReturns);

// @route   GET api/market-data/inflation
// @desc    Get historical inflation rates
// @access  Public
router.get('/inflation', getInflationRates);

// @route   POST api/market-data/update
// @desc    Update market data for specified years
// @access  Public
router.post('/update', updateMarketData);

export default router; 