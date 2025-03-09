// This script is used to update the historical data files
// Run with: node scripts/updateData.js

// Import the update utility
require('ts-node/register');
const { updateAllData } = require('../src/utils/updateHistoricalData');

// Run the update
console.log('Starting data update process...');
updateAllData()
  .then(() => {
    console.log('Data update completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error updating data:', error);
    process.exit(1);
  }); 