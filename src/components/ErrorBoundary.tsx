import React, { Component } from 'react';

// Simplified props and state interfaces
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

// Simplified ErrorBoundary class
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  // Use any type for error to avoid TypeScript issues
  static getDerivedStateFromError(error: any): State {
    return { 
      hasError: true, 
      errorMessage: error?.message || 'An unknown error occurred'
    };
  }

  // Use any types for error and errorInfo to avoid TypeScript issues
  componentDidCatch(error: any, errorInfo: any): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto my-8">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Something went wrong</h2>
          <p className="mb-4 text-gray-700">
            We're sorry, but there was an error loading this part of the application.
          </p>
          {this.state.errorMessage && (
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <p className="font-mono text-sm text-red-800 whitespace-pre-wrap">
                {this.state.errorMessage}
              </p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 