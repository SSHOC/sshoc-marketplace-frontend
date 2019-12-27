import { action } from '@storybook/addon-actions'
import React from 'react'
import { withMemoryRouter } from '../../utils/test'
import Link from './Link'

export default {
  title: 'Elements|Link',
  decorators: [withMemoryRouter],
}

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
