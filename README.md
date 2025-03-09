# Retirement Planning Web App

A comprehensive web application for retirement planning that allows users to:

1. Input their retirement assets and allocate them to cash, bonds, and equity buckets
2. Incorporate historical S&P 500 returns and inflation rates (2004-2024)
3. Calculate dynamic withdrawals based on market performance and inflation
4. Display withdrawal amounts in a tabular format
5. Query and update historical market data from web sources or APIs

## Features

- **Asset Allocation**: Allocate retirement assets between cash, bonds, and equity
- **Dynamic Withdrawal Strategy**: Configure withdrawal rates based on market performance
- **Historical Data Integration**: Uses historical S&P 500 returns and inflation rates from 2004-2024
- **Interactive Visualization**: View portfolio projections and withdrawal amounts
- **Customizable Rules**: Adjust withdrawal rules based on your risk tolerance
- **Data Visualization**: Charts showing historical market performance
- **Data Query Tool**: Update historical data by specifying a date range and data source

## Project Structure

```
retirement-planning/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── components/     # React components
│       ├── context/        # Context API for state management
│       ├── types/          # TypeScript type definitions
│       └── utils/          # Utility functions and API service
│
├── server/                 # Backend Node.js application
│   ├── data/               # JSON data files
│   │   ├── sp500_returns.json    # S&P 500 historical returns
│   │   └── inflation_rates.json  # Historical inflation rates
│   ├── scripts/            # Utility scripts
│   └── src/                # Source code
│       ├── controllers/    # API controllers
│       ├── models/         # Data models
│       ├── routes/         # API routes
│       └── utils/          # Utility functions
│
└── README.md               # Project documentation
```

## Historical Data

The application includes real historical data stored in JSON files:
- **S&P 500 Returns (2004-2024)**: `server/data/sp500_returns.json`
- **Inflation Rates (2004-2024)**: `server/data/inflation_rates.json`

This historical data is used for:
1. Analyzing past market performance
2. Projecting future returns based on historical averages
3. Calculating withdrawal amounts based on market conditions

### Updating Historical Data

The application provides two ways to update historical data:

1. **Web Interface**: Use the Data Query page in the application to specify a date range and data source (Web Search or API Calls)

2. **Command Line**: Run the update script from the server directory
```bash
npm run update-data
```

3. **Programmatically**: Use the utility functions in `server/src/utils/updateHistoricalData.ts`

#### Data Sources

- **Web Search**: Scrapes data from financial websites like macrotrends.net
- **API Calls**: Uses the FRED API which requires an API key in the server's .env file

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- Local JSON storage for market data
- Cheerio for web scraping (Web Search option)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/retirement-planning.git
cd retirement-planning
```

2. Install dependencies for both client and server
```
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Start the development servers
```
# Start the backend server
cd server
npm run dev

# In a separate terminal, start the frontend
cd client
npm start
```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Asset Allocation**: Enter your total retirement assets and allocate percentages to cash, bonds, and equity.
2. **Withdrawal Strategy**: Configure withdrawal rules based on market performance thresholds.
3. **Calculate Projections**: Specify the number of years to project and click "Calculate".
4. **View Results**: Examine the withdrawal amounts and portfolio value over time in the table and chart.
5. **Explore Historical Data**: View the historical S&P 500 returns and inflation rates used for calculations.
6. **Update Data**: Use the Data Query page to update historical data for a specific time period.

## Withdrawal Strategy Logic

The application uses the following default withdrawal strategy:
- When market return is above 5%, withdraw 4%
- When market return is between 0% and 5%, withdraw 3%
- When market return is negative (less than 0%), withdraw 2.5%

These rules can be customized through the user interface.

## Data Sources

The application uses historical data for:
- S&P 500 Returns (2004-2024): Data sourced from macrotrends.net
- Inflation Rates (2004-2024): Historical CPI data


## License

This project is licensed under the MIT License - see the LICENSE file for details. 