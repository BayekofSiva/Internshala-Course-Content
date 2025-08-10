import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchTerm } from '../store/slices/uiSlice.js'
import useProducts from '../hooks/useProducts.js'
import ProductItem from './ProductItem.jsx'
import RouteError from '../error.jsx'

export default function ProductList() {
  const { data, loading, error } = useProducts()
  const term = useSelector(selectSearchTerm).toLowerCase()

  const filtered = React.useMemo(() => {
    if (!term) return data
    return data.filter(p =>
      (p.title || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term)
    )
  }, [data, term])

  if (loading) return <div className="loader">Fetching glorious products…</div>
  if (error) return <RouteError message={error} />

  return (
    <section className="grid">
      {filtered.map(p => <ProductItem key={p.id} product={p} />)}
      {!filtered.length && <div className="loader">No matches. Try a different search term.</div>}
    </section>
  )
}
