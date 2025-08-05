import { lazy, Suspense, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems } from './redux/selectors';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import useRouteAnalytics from './hooks/useRouteAnalytics';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));

// Route guard components
const AuthGuard = ({ children }) => {
  const isAuthenticated = false; // Replace with actual auth check
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const CartGuard = ({ children }) => {
  const cartItems = useSelector(selectCartItems);
  return cartItems.length > 0 ? children : <Navigate to="/cart" replace />;
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize analytics and theme
  useRouteAnalytics();
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? 'dark-theme' : ''}`}>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="theme-toggle"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      
      <Header />
      
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      <ScrollToTop />
    </div>
  );
}

export default AppWrapper;