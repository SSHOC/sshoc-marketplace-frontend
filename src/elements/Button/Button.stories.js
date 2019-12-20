import { action } from '@storybook/addon-actions'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Link from '../../components/Link/Link'
import Icon from '../Icon/Icon'
import Spinner from '../Spinner/Spinner'
import Button from './Button'

export default {
  title: 'Elements|Button',
}

const actions = {
  onClick: action('onClick'),
}

export const sizes = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions}>Regular</Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} size="large">
        Large
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} size="small">
        Small
      </Button>
    </div>
  </>
)

export const variants = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions}>Basic</Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} variant="outline">
        Outline
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} variant="primary">
        Primary
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} variant="fancy">
        Fancy
      </Button>
    </div>
  </>
)

export const link = () => (
  <Router>
    <Button {...actions} as={Link} to="#">
      Link
    </Button>
  </Router>
)

export const disabled = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} disabled>
        Disabled Basic
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} disabled variant="outline">
        Disabled Outline
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} disabled variant="primary">
        Disabled Primary
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button {...actions} disabled variant="fancy">
        Disabled Fancy
      </Button>
    </div>
  </>
)

export const icons = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Button>
        Icon <Icon icon="sun" style={{ marginLeft: 10 }} />
      </Button>
    </div>
    <div style={{ marginBottom: 10 }}>
      <Button>
        <Spinner style={{ marginRight: 10 }} />
        Loading
      </Button>
    </div>
  </>
)
