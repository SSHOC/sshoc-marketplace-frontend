import { addDecorator } from '@storybook/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createMockItem } from '../../utils'
import SearchResult from './SearchResult'

export default {
  title: 'Components|SearchResult',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

export const basic = () => <SearchResult result={createMockItem(1)} />
