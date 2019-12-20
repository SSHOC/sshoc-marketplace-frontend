import React from 'react'
import { withMemoryRouter } from '../../utils'
import Header from './Header'

export default {
  title: 'Components|Header',
  decorators: [withMemoryRouter],
}

export const basic = () => <Header />
