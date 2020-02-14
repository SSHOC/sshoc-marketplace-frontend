import css from '@styled-system/css'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'styled-components/macro'
import Button from '../../elements/Button/Button'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import { userLogin, userLogout } from '../../store/actions/user'
import { REQUEST_STATUS } from '../../store/constants'
import { selectors } from '../../store/reducers'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const currentUser = useSelector(selectors.user.selectCurrentUser)
  const loginRequest = useSelector(state =>
    selectors.requests.selectRequestByName(state, { name: userLogin })
  )
  const loginStatus = loginRequest.status

  const onLogin = event => {
    event.preventDefault()
    dispatch(userLogin({ username, password }))
  }

  const onLogout = () => {
    dispatch(userLogout())
  }

  return loginStatus === REQUEST_STATUS.PENDING ? (
    <Flex>
      <Flex css={css({ alignItems: 'center', mr: 2 })}>Logging in&hellip;</Flex>
    </Flex>
  ) : currentUser.name ? (
    <Flex>
      <Flex css={css({ alignItems: 'center', mr: 2 })}>
        Logged in as {currentUser.name}
      </Flex>
      <Button onClick={onLogout} size="small" variant="primary">
        Logout
      </Button>
    </Flex>
  ) : (
    <Flex as="form" onSubmit={onLogin}>
      <Input
        css={css({ mr: 2 })}
        onChange={event => setUsername(event.target.value)}
        placeholder="Username"
        size="small"
        value={username}
      />
      <Input
        css={css({ mr: 2 })}
        onChange={event => setPassword(event.target.value)}
        placeholder="Password"
        size="small"
        type="password"
        value={password}
      />
      <Button size="small" type="submit" variant="primary">
        Login
      </Button>
    </Flex>
  )
}

export default LoginForm
