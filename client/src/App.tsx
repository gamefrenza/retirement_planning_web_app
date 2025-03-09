import React from 'react';
import './App.css';
import { RetirementProvider } from './context/RetirementContext';
import AssetAllocationForm from './components/AssetAllocationForm';
import WithdrawalStrategyForm from './components/WithdrawalStrategyForm';
import WithdrawalResults from './components/WithdrawalResults';
import HistoricalDataTable from './components/HistoricalDataTable';
import MarketDataChart from './components/MarketDataChart';
import DataQueryPage from './components/DataQueryPage';

const App: React.FC = () => {
  return (
    <RetirementProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Retirement Planning App</h1>
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Retirement Planning Tool</h2>
            <p className="mb-4">
              This application helps you plan your retirement by calculating dynamic withdrawals
              based on market performance and inflation. Follow these steps:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Enter your total retirement assets and allocate them between cash, bonds, and equity</li>
              <li>Configure your withdrawal strategy based on market performance thresholds</li>
              <li>Calculate and view your withdrawal projections</li>
            </ol>
            <p className="text-sm text-gray-600">
              The default withdrawal strategy follows these rules:
              <ul className="list-disc pl-6 mt-2">
                <li>When market return is above 5%, withdraw 4%</li>
                <li>When market return is between 0% and 5%, withdraw 3%</li>
                <li>When market return is negative (less than 0%), withdraw 2.5%</li>
              </ul>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AssetAllocationForm />
            <WithdrawalStrategyForm />
          </div>
          
          <WithdrawalResults />
          
          <div className="mt-6 mb-6">
            <MarketDataChart />
          </div>
          
          <div className="mt-6 mb-6">
            <DataQueryPage />
          </div>
          
          <div className="mt-6">
            <HistoricalDataTable />
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>Retirement Planning App &copy; {new Date().getFullYear()}</p>
            <p className="text-sm mt-2">
              Using historical S&P 500 returns and inflation data from 2004-2024
            </p>
          </div>
        </footer>
      </div>
    </RetirementProvider>
  );
};

export default App; 