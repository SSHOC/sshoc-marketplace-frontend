import React from 'react'
import Centered from '../../elements/Centered/Centered'
import Link from '../../elements/Link/Link'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

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
        <Centered>
          <ErrorMessage level="error">
            Sorry, something went wrong. Click <Link to="/">here</Link> to
            return home.
          </ErrorMessage>
        </Centered>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
