import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useRouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Send to analytics service
    console.log(`Navigated to: ${location.pathname}`);
    // window.analytics.trackPageView();
  }, [location]);
}

useRouteAnalytics();