import { action } from '@storybook/addon-actions'
import React from 'react'
import Select from './Select'

export default {
  title: 'Elements|Select',
}

const actions = {
  onChange: action('onChange'),
}

const items = [
  { value: 'apples', label: 'Apples' },
  { value: 'bananas', label: 'Bananas' },
  { value: 'oranges', label: 'Oranges' },
]

export const styles = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Select items={items} {...actions} />
    </div>
    <div style={{ marginBottom: 10 }}>
      <Select checkSelected items={items} {...actions} />
    </div>
  </>
)

export const variants = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Select items={items} {...actions} />
    </div>
    <div style={{ marginBottom: 10 }}>
      <Select checkSelected items={items} variant="primary" {...actions} />
    </div>
  </>
)
