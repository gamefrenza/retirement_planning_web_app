// Simple welcome screen component without complex TypeScript
function WelcomeScreen(props: { onGetStarted: () => void }) {
  const { onGetStarted } = props;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Welcome to Retirement Planning</h2>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This application helps you plan your retirement by:
        </p>
        
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
          <li>Allocating your retirement assets between cash, bonds, and equity</li>
          <li>Creating a dynamic withdrawal strategy based on market performance</li>
          <li>Calculating withdrawal amounts using historical market data</li>
          <li>Visualizing your retirement portfolio over time</li>
          <li>Exploring historical S&P 500 returns and inflation rates</li>
        </ul>
        
        <p className="text-gray-700 mb-4">
          To get started, you'll need to:
        </p>
        
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Enter your total retirement assets and allocate them</li>
          <li>Configure your withdrawal strategy based on market conditions</li>
          <li>Calculate and view your withdrawal projections</li>
        </ol>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onGetStarted}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

// Export as default without using React.FC
export default WelcomeScreen; 