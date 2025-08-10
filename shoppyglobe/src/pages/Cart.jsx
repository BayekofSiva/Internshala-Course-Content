import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice.js'
import CartItem from '../components/CartItem.jsx'
import { Link } from 'react-router-dom'

export default function Cart() {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const dispatch = useDispatch()

  if (!items.length) {
    return (
      <div className="card" style={{padding: 18}}>
        <h3>Your cart is emptier than my fridge before payday.</h3>
        <Link className="btn" to="/">Go find shiny things</Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid">
        {items.map(it => <CartItem key={it.id} item={it} />)}
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <strong style={{ fontSize: 20 }}>Total: ${total.toFixed(2)}</strong>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost" onClick={() => dispatch(clearCart())}>Clear</button>
          <Link className="btn" to="/checkout">Checkout</Link>
        </div>
      </div>
    </>
  )
}
