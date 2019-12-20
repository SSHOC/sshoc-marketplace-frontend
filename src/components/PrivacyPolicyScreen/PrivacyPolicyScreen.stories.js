import React from 'react'
import PrivacyPolicyScreen from './PrivacyPolicyScreen'
import { StaticRouter as Router } from 'react-router-dom'

export default {
  title: 'Screens|PrivacyPolicy',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <PrivacyPolicyScreen />
