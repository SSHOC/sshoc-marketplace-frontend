import React from 'react'
import styled from 'styled-components/macro'
import Flex from '../../elements/Flex/Flex'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

const Centered = styled(Flex)({
  alignItems: 'center',
  height: '100%',
  justifyContent: 'center',
})

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
