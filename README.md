# Retirement Planning Web Application

## Status: TypeScript Issues Fixed

The application has been updated to fix the TypeScript errors that were previously causing issues. The following changes have been made:

1. **Fixed Type Declarations**: Added proper type declarations for React components and hooks
2. **Updated Component Structure**: Removed React.FC type annotations and used proper return types
3. **Improved Type Safety**: Added explicit type annotations for useState hooks
4. **Fixed Import Issues**: Resolved issues with ECMAScript imports/exports
5. **Simplified Type Handling**: Used proper type handling for event handlers and callbacks

## TypeScript Configuration

The TypeScript configuration has been updated to properly support React imports and types:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

## Project Structure

The application is organized into the following structure:

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

## Features

- **Asset Allocation**: Allocate retirement assets between cash, bonds, and equity
- **Dynamic Withdrawal Strategy**: Configure withdrawal rates based on market performance
- **Historical Data Integration**: Uses historical S&P 500 returns and inflation rates from 2004-2024
- **Interactive Visualization**: View portfolio projections and withdrawal amounts
- **Customizable Rules**: Adjust withdrawal rules based on your risk tolerance
- **Data Visualization**: Charts showing historical market performance
- **Data Query Tool**: Update historical data by specifying a date range and data source

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Tech Stack

- React with TypeScript
- Context API for state management
- Recharts for data visualization
- Tailwind CSS for styling

## Withdrawal Strategy Logic

The application uses the following default withdrawal strategy:
- When market return is above 5%, withdraw 4%
- When market return is between 0% and 5%, withdraw 3%
- When market return is negative (less than 0%), withdraw 2.5%

These rules can be customized through the user interface.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 