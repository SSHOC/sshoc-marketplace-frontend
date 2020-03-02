import css from '@styled-system/css'
import React from 'react'
import { useDispatch } from 'react-redux'
import styled, { css as styledcss, keyframes } from 'styled-components/macro'
import { removeToast } from '../../store/actions/toast'

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const ToastContainer = styled('div')(
  ({ level }) =>
    css({
      bg: 'primary',
      borderRadius: 2,
      color: 'white',
      fontWeight: 'bold',
      p: 3,
      pointerEvents: 'auto',
      m: 2,
      width: 'toast',
    }),
  styledcss`
    animation: ${fade} 200ms ease;
  `
)

const Toast = ({ toast }) => {
  const dispatch = useDispatch()

  return (
    <ToastContainer
      level={toast.level}
      onClick={() => dispatch(removeToast(toast.timestamp))}
    >
      <div>{toast.message}</div>
    </ToastContainer>
  )
}

export default Toast
