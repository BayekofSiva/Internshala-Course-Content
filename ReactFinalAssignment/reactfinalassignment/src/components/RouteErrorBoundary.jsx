import { Component } from 'react';
import { useRouteError } from 'react-router-dom';

class RouteErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? (
      <div className="error-fallback">
        <h2>Couldn't load this section</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    ) : this.props.children;
  }
}

// Usge:
<Suspense fallback={<LoadingSpinner />}>
  <RouteErrorBoundary>
    <LazyComponent />
  </RouteErrorBoundary>
</Suspense>