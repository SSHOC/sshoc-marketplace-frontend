import { action } from '@storybook/addon-actions'
import React, { useEffect } from 'react'
import { MemoryRouter as Router, useHistory } from 'react-router-dom'

const HistoryListener = ({ children }) => {
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((location, historyAction) => {
      action(`history.${historyAction}`)(location)
    })
    return unlisten
  }, [history])

  return children
}

export const withMemoryRouter = storyFn => (
  <Router>
    <HistoryListener>{storyFn()}</HistoryListener>
  </Router>
)
