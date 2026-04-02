import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Tab Stack render error:', error, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="tab-manager error-boundary">
          <div className="tab-empty-state">
            <i className="codicon codicon-warning" aria-hidden="true" />
            <p>Something went wrong rendering the panel.</p>
            <button
              type="button"
              className="section-action"
              onClick={this.handleRetry}
            >
              <i className="codicon codicon-refresh" aria-hidden="true" />
              <span> Retry</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
