import React from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <p>
          Ooops, something went wrong. Click <Link to="/">here</Link> to return
          home.
        </p>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
