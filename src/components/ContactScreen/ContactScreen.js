import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Heading from '../../elements/Heading/Heading'

const ContactScreen = () => (
  <Heading variant="h1" css={css({ mt: 4 })}>
    Contact
  </Heading>
)

export default ContactScreen
