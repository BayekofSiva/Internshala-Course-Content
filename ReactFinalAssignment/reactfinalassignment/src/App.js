// src/App.js
import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded components with code splitting
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Route guard components
const AuthGuard = ({ children }) => {
  const isAuthenticated = false; // Replace with actual auth check
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const CartGuard = ({ children }) => {
  const cartItems = useSelector(selectCartItems);
  return cartItems.length > 0 ? children : <Navigate to="/cart" replace />;
};

function App() {
  const location = useLocation(); 

  return (
    <>
      <Header />
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <CartGuard>
                    <AuthGuard>
                      <Checkout />
                    </AuthGuard>
                  </CartGuard>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </ErrorBoundary>
    </>
  );

   <ScrollToTop />
   useRouteAnalytics();
}

export default () => (
  <Router>
    <App />
  </Router>
);