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
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';


// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
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
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );

   <ScrollToTop />
   useRouteAnalytics();
}

export default () => (
  <Router>
    <App />
  </Router>
);