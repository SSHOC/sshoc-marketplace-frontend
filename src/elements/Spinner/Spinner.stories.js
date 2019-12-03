import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Spinner from './Spinner'

export default {
  title: 'Elements|Spinner',
}

export const sizes = () => (
  <>
    <Spinner />
    <Spinner width="3em" height="3em" />
  </>
)

export const colors = () => (
  <>
    <Spinner css={css({ color: 'primary' })} />
    <Spinner css={css({ color: 'primary' })} width="3em" height="3em" />
  </>
)

export const delayed = () => (
  <>
    <Spinner width="3em" height="3em" />
    <Spinner delayed width="3em" height="3em" />
  </>
)
