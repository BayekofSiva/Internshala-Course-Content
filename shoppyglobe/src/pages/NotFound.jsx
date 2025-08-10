import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card" style={{padding: 22, textAlign: 'center'}}>
      <h2>404 — Page went shopping without you 🛍️</h2>
      <p>We tried calling it, but it’s on “Do Not Disturb.”</p>
      <Link className="btn" to="/">Return to Home</Link>
    </div>
  )
}
