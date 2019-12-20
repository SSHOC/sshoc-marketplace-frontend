import React from 'react'
import ErrorMessage from './ErrorMessage'
import Stack from '../../elements/Stack/Stack'

export default {
  title: 'Components|ErrorMessage',
}

export const levels = () => (
  <Stack>
    <ErrorMessage level="error">Error Message</ErrorMessage>
    <ErrorMessage level="info">Info Message</ErrorMessage>
    <ErrorMessage level="warn">Warning Message</ErrorMessage>
  </Stack>
)
