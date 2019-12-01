import React from 'react'
import Centered from '../../elements/Centered/Centered'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

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
          <Text>
            Ooops, something went wrong. Click <Link to="/">here</Link> to
            return home.
          </Text>
        </Centered>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
