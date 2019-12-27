import React from 'react'
import { withMemoryRouter } from '../../utils/test'
import PrivacyPolicyScreen from './PrivacyPolicyScreen'

export default {
  title: 'Screens|PrivacyPolicy',
  decorators: [withMemoryRouter],
}

export const basic = () => <PrivacyPolicyScreen />
