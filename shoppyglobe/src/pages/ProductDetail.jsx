import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice.js'
import RouteError from '../error.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [p, setP] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const dispatch = useDispatch()

  React.useEffect(() => {
    const ac = new AbortController()
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`https://dummyjson.com/products/${id}`, { signal: ac.signal })
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        setP(await res.json())
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => ac.abort()
  }, [id])

  if (loading) return <div className="loader">Assembling details…</div>
  if (error) return <RouteError message={error} />
  if (!p) return <div className="loader">No product found.</div>

  return (
    <article className="card" style={{overflow: 'hidden'}}>
      <img className="product-img" src={p.thumbnail} alt={p.title} />
      <div style={{ padding: 16 }}>
        <span className="badge">{p.category}</span>
        <h2 style={{marginTop: 6}}>{p.title}</h2>
        <p style={{opacity:.85}}>{p.description}</p>
        <div className="row" style={{marginTop: 12}}>
          <span className="price">${p.price}</span>
          <button className="btn" onClick={() => dispatch(addToCart(p))}>Add to Cart</button>
        </div>
      </div>
    </article>
  )
}
