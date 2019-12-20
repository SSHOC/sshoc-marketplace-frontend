import React from 'react'
import { withMemoryRouter } from '../../utils'
import SearchForm from './SearchForm'

export default {
  title: 'Components|SearchForm',
  decorators: [withMemoryRouter],
}

export const basic = () => <SearchForm />
