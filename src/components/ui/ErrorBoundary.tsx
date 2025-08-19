import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's a connection error
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
      toast.error('Connection to server failed. Please check your internet connection and try again.');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1,
    }));
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isConnectionError = this.state.error?.message.includes('ECONNREFUSED') || 
                               this.state.error?.message.includes('Failed to fetch');

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            
            <h2 className="text-xl font-semibold mb-2">
              {isConnectionError ? 'Connection Error' : 'Something Went Wrong'}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {isConnectionError 
                ? 'Unable to connect to the server. Please check your internet connection and ensure the backend server is running.'
                : 'An unexpected error occurred. Please try again.'
              }
            </p>

            {this.state.retryCount < 3 && (
              <Button 
                onClick={this.handleRetry}
                className="w-full mb-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again ({3 - this.state.retryCount} attempts left)
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={this.handleReset}
              className="w-full"
            >
              Reset
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 