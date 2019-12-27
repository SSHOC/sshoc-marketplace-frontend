import React from 'react'
import { REQUEST_STATUS } from '../../store/constants'
import { createMockItem, withMemoryRouter } from '../../utils/test'
import { ItemScreen } from './ItemScreen'

export default {
  title: 'Screens|Item',
  decorators: [withMemoryRouter],
}

export const idle = () => (
  <ItemScreen request={{ info: {}, status: REQUEST_STATUS.IDLE }} />
)

export const loading = () => (
  <ItemScreen request={{ info: {}, status: REQUEST_STATUS.PENDING }} />
)

export const error = () => (
  <ItemScreen
    request={{
      error: { message: 'Custom error message returned from server' },
      info: {},
      status: REQUEST_STATUS.FAILED,
    }}
  />
)

export const empty = () => (
  <ItemScreen request={{ info: {}, status: REQUEST_STATUS.SUCCEEDED }} />
)

export const resource = () => (
  <ItemScreen
    request={{ info: {}, status: REQUEST_STATUS.SUCCEEDED }}
    resource={createMockItem(1)}
  />
)
