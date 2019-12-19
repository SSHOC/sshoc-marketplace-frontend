import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Text from '../../elements/Text/Text'

// TODO: error levels
const ErrorMessage = ({ children, level = 'info' }) => (
  <Text css={css({ fontSize: 4 })}>
    {children || 'Sorry, something went wrong'}
  </Text>
)

export default ErrorMessage
