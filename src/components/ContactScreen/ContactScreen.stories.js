import React from 'react'
import { withMemoryRouter } from '../../utils'
import ContactScreen from './ContactScreen'
export default {
  title: 'Screens|Contact',
  decorators: [withMemoryRouter],
}

export const basic = () => <ContactScreen />
