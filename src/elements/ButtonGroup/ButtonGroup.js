import css from '@styled-system/css'
import React, { forwardRef } from 'react'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Container = styled(Box)(
  css({
    display: 'inline-flex',
    '& > *': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
    },
    '& > *:first-child': {
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '& > *:last-child': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 2,
      borderBottomRightRadius: 2,
      borderRightWidth: 1,
    },
  })
)

const ButtonGroup = forwardRef((props, ref) => (
  <Container ref={ref}>
    {React.Children.map(props.children, child =>
      React.cloneElement(child, {
        className: [child.props.className, props.className].join(),
        variant: child.props.variant || props.variant,
      })
    )}
  </Container>
))

export default ButtonGroup
