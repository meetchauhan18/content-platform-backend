// libs imports
import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-gray-600">
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
