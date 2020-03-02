import { REMOVE_TOAST, SHOW_TOAST } from '../constants'

const initialState = {}

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST: {
      const { timestamp } = action.payload

      return {
        ...state,
        [timestamp]: action.payload,
      }
    }

    case REMOVE_TOAST: {
      const { timestamp } = action.payload

      const { [timestamp]: _, ...filteredState } = state

      return filteredState
    }

    default:
      return state
  }
}

export default toastReducer

export const selectCurrentToasts = state => Object.values(state)
