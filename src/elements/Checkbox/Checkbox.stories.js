import { action } from '@storybook/addon-actions'
import React from 'react'
import Checkbox from './Checkbox'

export default {
  title: 'Elements|Checkbox',
}

const actions = {
  onChange: action('onChange'),
}

export const states = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Checkbox {...actions} checked={false}>
        Label
      </Checkbox>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Checkbox {...actions} checked>
        Label
      </Checkbox>
    </div>
  </>
)

export const controlled = () => {
  // this is because storybooks calls the function with storyFn(),
  // and not as <Story />. We could just wrap this in React.createElement,
  // but it's fine to just disable eslint here
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const [checked, setChecked] = React.useState(false)

  return (
    <Checkbox
      {...actions}
      checked={checked}
      onChange={e => {
        actions.onChange(e)
        setChecked(checked => !checked)
      }}
    >
      Label
    </Checkbox>
  )
}
