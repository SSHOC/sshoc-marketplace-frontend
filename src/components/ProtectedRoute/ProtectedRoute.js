import React from 'react'
import { Route /*, Redirect */ } from 'react-router-dom'
import Centered from '../../elements/Centered/Centered'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { useSelector } from 'react-redux'
import { selectors } from '../../store/reducers'

const ProtectedRoute = ({ children, component, ...props }) => {
  const user = useSelector(selectors.user.selectCurrentUser)

  if (!user.token) {
    return (
      <Route
        render={({ location }) => (
          // <Redirect to={{ pathname: '/login', state: { from: location } }} />
          <Centered>
            <ErrorMessage>
              You need to be authenticated to view this page.
            </ErrorMessage>
          </Centered>
        )}
        {...props}
      />
    )
  }

  return (
    <Route component={component} {...props}>
      {children}
    </Route>
  )
}

export default ProtectedRoute
