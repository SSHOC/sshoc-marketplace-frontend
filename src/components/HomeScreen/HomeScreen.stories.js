import React from 'react'
import { withMemoryRouter } from '../../utils'
import HomeScreen from './HomeScreen'

export default {
  title: 'Screens|Home',
  decorators: [withMemoryRouter],
}

export const basic = () => <HomeScreen />
