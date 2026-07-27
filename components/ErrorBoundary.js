import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    // Full hard reload to clear corrupted memory state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cloth flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-surface rounded-xl border border-ink/10 p-8 max-w-sm w-full shadow-sm">
            <h1 className="text-xl font-bold text-rust mb-2">Something went wrong</h1>
            <p className="text-ink/60 text-sm mb-6">
              The application encountered an unexpected error.
            </p>
            <button
              onClick={this.handleReload}
              className="btn btn-primary w-full rounded-xl py-3.5 font-semibold"
            >
              Tap to reload
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 text-left bg-rust/5 p-4 rounded-lg overflow-x-auto">
                <p className="text-xs text-rust font-mono whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
