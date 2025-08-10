import React from 'react'

export default function useProducts() {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const ac = new AbortController()
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('https://dummyjson.com/products', { signal: ac.signal })
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        const json = await res.json()
        setData(Array.isArray(json.products) ? json.products : [])
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => ac.abort()
  }, [])

  return { data, loading, error }
}
