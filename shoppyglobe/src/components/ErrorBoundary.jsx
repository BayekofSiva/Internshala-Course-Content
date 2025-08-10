import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    // You could log this to a service
    console.error('ErrorBoundary caught:', error, info)
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Optional: reload current route
    // window.location.reload()
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{padding: 22}}>
          <h2>Something broke… but we brought duct tape 🛠️</h2>
          <p style={{opacity:.85}}>{String(this.state.error || '')}</p>
          <button className="btn" onClick={this.handleReset}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}
