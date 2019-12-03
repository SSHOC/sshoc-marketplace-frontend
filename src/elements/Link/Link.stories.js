import { action } from '@storybook/addon-actions'
import { addDecorator } from '@storybook/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Link from './Link'

export default {
  title: 'Elements|Link',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

const actions = {
  onClick: action('onClick'),
}

export const basic = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Link to="/" {...actions}>
        Relative Link
      </Link>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Link to="https://www.example.com" {...actions}>
        Absolute Link
      </Link>
    </div>
  </>
)

export const variants = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Link to="/">Link</Link>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Link to="/" variant="nav">
        Nav Link
      </Link>
    </div>
  </>
)

export const button = () => (
  <Link as="button" {...actions}>
    Button
  </Link>
)
