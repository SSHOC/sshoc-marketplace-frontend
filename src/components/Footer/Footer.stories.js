import React from 'react'
import { withMemoryRouter } from '../../utils'
import Footer from './Footer'

export default {
  title: 'Components|Footer',
  decorators: [withMemoryRouter],
}

export const basic = () => <Footer />
