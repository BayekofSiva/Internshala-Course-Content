import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchTerm, selectSearchTerm, selectTheme, setTheme } from '../store/slices/uiSlice.js'
import { selectCartCount } from '../store/slices/cartSlice.js'
import { applyTheme } from '../utils/theme.js'

export default function Header() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const count = useSelector(selectCartCount)
  const searchTerm = useSelector(selectSearchTerm)

  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => { applyTheme(theme) }, [theme])

  function onSearch(e) {
    dispatch(setSearchTerm(e.target.value))
    if (location.pathname !== '/') navigate('/')
  }

  function toggleTheme() {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link className="brand" to="/">
          <span className="brand-badge">SG</span> ShoppyGlobe
        </Link>

        <nav className="nav-links">
          <Link className="link" to="/">Home</Link>
          <Link className="link" to="/cart">Cart ({count})</Link>
          <Link className="link" to="/checkout">Checkout</Link>
        </nav>

        <div className="actions">
          <input
            className="input"
            value={searchTerm}
            onChange={onSearch}
            placeholder="Search products…"
            aria-label="Search products"
          />
          <button className="btn ghost" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark 🌙' : 'Light ☀️'}
          </button>
        </div>
      </div>
    </header>
  )
}