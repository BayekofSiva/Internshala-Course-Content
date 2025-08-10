import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice.js'

export default function ProductItem({ product }) {
  const dispatch = useDispatch()
  const { id, title, price, thumbnail, category } = product

  return (
    <article className="card">
      <Link to={`/product/${id}`}>
        <img className="product-img" src={thumbnail} alt={title} loading="lazy" />
      </Link>
      <div style={{ padding: 12 }}>
        <span className="badge">{category}</span>
        <h3 style={{ margin: '6px 0 10px' }}>{title}</h3>
        <div className="row">
          <span className="price">${price}</span>
          <button className="btn" onClick={() => dispatch(addToCart(product))}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    category: PropTypes.string,
  }).isRequired
}
