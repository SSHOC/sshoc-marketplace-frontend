import React from 'react'
import { withMemoryRouter } from '../../utils/test'
import AboutScreen from './AboutScreen'

export default {
  title: 'Screens|About',
  decorators: [withMemoryRouter],
}

export const basic = () => <AboutScreen />