import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="material-symbols-outlined text-error text-3xl"
                data-icon="error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
              <h2 className="text-2xl font-bold text-on-surface">Something went wrong</h2>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">
              We've encountered an unexpected error. Our team has been notified and we're working
              on a fix.
            </p>
            {this.state.error && (
              <div className="bg-error-container/10 p-4 rounded border border-error/20 mb-6">
                <p className="text-xs font-mono text-error break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-secondary text-on-secondary text-sm font-bold rounded hover:bg-secondary/90 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="flex-1 px-4 py-2 bg-surface-container text-on-surface text-sm font-bold rounded hover:bg-surface-container-high transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
