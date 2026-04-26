"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  showBackLink?: boolean;
  showHomeLink?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    // Log error to console or error reporting service
    // Error logged for monitoring: error.message
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback
          onRetry={this.handleReset}
          showBackLink={this.props.showBackLink}
          showHomeLink={this.props.showHomeLink}
        />
      );
    }

    return this.props.children;
  }
}
