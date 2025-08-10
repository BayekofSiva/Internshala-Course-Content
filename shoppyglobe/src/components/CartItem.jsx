import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { increment, decrement, removeFromCart } from '../store/slices/cartSlice.js'

export default function CartItem({ item }) {
  const dispatch = useDispatch()
  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, padding: 12 }}>
      <img className="product-img" src={item.thumbnail} alt={item.title} style={{aspectRatio: '1/1'}} />
      <div>
        <h3 style={{margin: '0 0 6px'}}>{item.title}</h3>
        <div className="row">
          <div>
            <button className="btn ghost" onClick={() => dispatch(decrement(item.id))}>−</button>
            <span style={{ padding: '0 10px' }}>{item.qty}</span>
            <button className="btn ghost" onClick={() => dispatch(increment(item.id))}>+</button>
          </div>
          <strong className="price">${(item.qty * item.price).toFixed(2)}</strong>
        </div>
      </div>
      <button className="btn" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
    </div>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    qty: PropTypes.number.isRequired,
  }).isRequired
}
