import { action } from '@storybook/addon-actions'
import React from 'react'
import Button from '../Button/Button'
import Input from '../Input/Input'
import ButtonGroup from './ButtonGroup'

export default {
  title: 'Elements|ButtonGroup',
}

const actions = {
  button: {
    onClick: action('onClick'),
  },
  input: {
    onChange: action('onChange'),
  },
}

export const variants = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <ButtonGroup>
        <Button {...actions.button}>First</Button>
        <Button {...actions.button}>Second</Button>
      </ButtonGroup>
    </div>
    <div style={{ marginBottom: 10 }}>
      <ButtonGroup variant="primary">
        <Button {...actions.button}>First</Button>
        <Button {...actions.button}>Second</Button>
      </ButtonGroup>
    </div>
  </>
)

export const multiple = () => (
  <ButtonGroup>
    <Button {...actions.button}>First</Button>
    <Button {...actions.button}>Second</Button>
    <Button {...actions.button}>Third</Button>
  </ButtonGroup>
)

export const mixed = () => (
  <ButtonGroup>
    <Button {...actions.button}>First</Button>
    <Input {...actions.input} />
    <Button {...actions.button}>Second</Button>
  </ButtonGroup>
)
