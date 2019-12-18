import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Text from '../../elements/Text/Text'

const ErrorMessage = ({ level = 'info', message }) => (
  <Text css={css({ fontSize: 4 })}>{message}</Text>
)

export default ErrorMessage
