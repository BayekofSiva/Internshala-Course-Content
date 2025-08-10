import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Footer from './components/Footer.jsx'

const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container">
        <ErrorBoundary>
          <Suspense fallback={<div className="loader">Loading awesomeness…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>   
      <Footer />   
    </div>
  )
}