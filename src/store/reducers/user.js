import { USER_LOGIN, USER_LOGOUT } from '../constants'

const initialState = {}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGOUT:
    case USER_LOGIN.FAILED:
      return initialState

    case USER_LOGIN.SUCCEEDED: {
      const [user] = Object.values(action.payload.resources.user)
      return user
    }

    case USER_LOGIN.PENDING:
      return state

    default:
      return state
  }
}

export default userReducer

export const selectCurrentUser = state => state
