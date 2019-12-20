import React from 'react'
import { withMemoryRouter } from '../../utils'
import PrivacyPolicyScreen from './PrivacyPolicyScreen'

export default {
  title: 'Screens|PrivacyPolicy',
  decorators: [withMemoryRouter],
}

export const basic = () => <PrivacyPolicyScreen />
