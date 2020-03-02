import css from '@styled-system/css'
import React from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import 'styled-components/macro'
import Flex from '../../elements/Flex/Flex'
import { selectors } from '../../store/reducers'
import Toast from '../Toast/Toast'

const Portal = ({ children }) =>
  createPortal(children, document.getElementById('portal-toasts'))

const ToastsContainer = () => {
  const toasts = useSelector(selectors.toasts.selectCurrentToasts)

  return <Toasts toasts={toasts} />
}

export const Toasts = ({ toasts }) => (
  <Portal>
    <Flex
      css={css({
        alignItems: 'center',
        bottom: 60,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        left: 0,
        m: 2,
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
      })}
    >
      {toasts.map(toast => (
        <Toast key={toast.timestamp} toast={toast} />
      ))}
    </Flex>
  </Portal>
)

export default ToastsContainer
