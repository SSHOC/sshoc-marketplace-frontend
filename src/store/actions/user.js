import API, { getErrorMessage } from '../../api'
import {
  API_REQUEST,
  FETCH_POLICY,
  USER_LOGIN,
  USER_LOGOUT,
} from '../constants'
import { createNormalizer } from '../utils/createNormalizer'

export const userLogin = ({ username, password }) => ({
  type: API_REQUEST,
  payload: {
    ...API.userLogin({ username, password }),
  },
  meta: {
    fetchPolicy: FETCH_POLICY.NO_CACHE,
    getErrorMessage,
    next: USER_LOGIN,
    normalize: createNormalizer({ resourceType: 'user' }),
    request: {
      name: 'userLogin',
    },
  },
})
userLogin.toString = () => 'userLogin'

export const userLogout = () => ({
  type: USER_LOGOUT,
})
