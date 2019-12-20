import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import 'styled-components/macro'
import Dropdown from './Dropdown'

export default {
  title: 'Elements|Dropdown',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

const links = [
  { path: '#apples', label: 'Apples' },
  { path: '#bananas', label: 'Bananas' },
  { path: '#oranges', label: 'Oranges' },
]

export const sizes = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Dropdown links={links} />
    </div>
    <div style={{ marginBottom: 10 }}>
      <Dropdown links={links} size="large" />
    </div>
  </>
)

export const variants = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Dropdown links={links} />
    </div>
    <div style={{ marginBottom: 10 }}>
      <Dropdown links={links} variant="primary" />
    </div>
  </>
)
