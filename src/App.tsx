import React, { useEffect, useState, lazy, Suspense } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { RetirementProvider } from './context/RetirementContext';

// Lazy load components to reduce initial bundle size
const AssetAllocationForm = lazy(() => import('./components/AssetAllocationForm'));
const WithdrawalStrategyForm = lazy(() => import('./components/WithdrawalStrategyForm'));
const WithdrawalResults = lazy(() => import('./components/WithdrawalResults'));
const MarketDataChart = lazy(() => import('./components/MarketDataChart'));
const DataQueryPage = lazy(() => import('./components/DataQueryPage'));

// Loading fallback component
const LoadingFallback = (): JSX.Element => (
  <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center" style={{ minHeight: '300px' }}>
    <div className="spinner"></div>
  </div>
);

// Navigation component
const Navigation = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }): JSX.Element => (
  <nav className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Retirement Planning</h1>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {['assets', 'strategy', 'results', 'market-data', 'data-query'].map(tab => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </nav>
);

function App(): JSX.Element {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('assets');

  // Remove loading element when app is mounted
  useEffect(() => {
    // Remove the initial loading element
    const loadingEl = document.querySelector('.app-loading');
    if (loadingEl && loadingEl.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl);
    }
  }, []);

  const handleGetStarted = (): void => {
    setShowWelcome(false);
  };

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    setShowWelcome(false);
  };

  const renderActiveTab = (): JSX.Element => {
    if (showWelcome) {
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }

    // Render the appropriate component based on the active tab
    switch (activeTab) {
      case 'assets':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AssetAllocationForm />
            </Suspense>
          </ErrorBoundary>
        );
      case 'strategy':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <WithdrawalStrategyForm />
            </Suspense>
          </ErrorBoundary>
        );
      case 'results':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <WithdrawalResults />
            </Suspense>
          </ErrorBoundary>
        );
      case 'market-data':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <MarketDataChart />
            </Suspense>
          </ErrorBoundary>
        );
      case 'data-query':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <DataQueryPage />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AssetAllocationForm />
            </Suspense>
          </ErrorBoundary>
        );
    }
  };

  return (
    <ErrorBoundary>
      <RetirementProvider>
        <div className="min-h-screen bg-gray-100">
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {renderActiveTab()}
            </div>
          </main>
          <footer className="bg-white shadow-inner mt-8 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                Retirement Planning Web App © {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </RetirementProvider>
    </ErrorBoundary>
  );
}

export default App; 