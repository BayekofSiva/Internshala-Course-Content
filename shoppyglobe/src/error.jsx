import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function RouteError({ message = 'Unexpected error.' }) {
  return (
    <div className="card" style={{padding: 22, textAlign: 'center'}}>
      <h2>Oops! Our API went for a coffee ☕</h2>
      <p style={{opacity:.9}}>{message}</p>
      <Link className="btn" to="/">Back to safety</Link>
    </div>
  )
}
RouteError.propTypes = { message: PropTypes.string }
