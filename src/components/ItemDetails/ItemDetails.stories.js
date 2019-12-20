import React from 'react'
import { REQUEST_STATUS } from '../../store/constants'
import { createMockItem } from '../../utils'
import ItemDetails from './ItemDetails'

export default {
  title: 'Components|ItemDetails',
}

export const idle = () => (
  <ItemDetails request={{ info: {}, status: REQUEST_STATUS.IDLE }} />
)

export const loading = () => (
  <ItemDetails request={{ info: {}, status: REQUEST_STATUS.PENDING }} />
)

export const error = () => (
  <ItemDetails request={{ info: {}, status: REQUEST_STATUS.FAILED }} />
)

export const resource = () => (
  <ItemDetails
    request={{ info: {}, status: REQUEST_STATUS.SUCCEEDED }}
    resource={createMockItem(1)}
  />
)
