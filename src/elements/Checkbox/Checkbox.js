import css from '@styled-system/css'
import React, { forwardRef } from 'react'
import 'styled-components/macro'
import Box from '../Box/Box'
import Checkmark from '../Checkmark/Checkmark'
import Invisible from '../Invisible/Invisible'

const Checkbox = forwardRef(
  (
    {
      'aria-label': ariaLabel,
      checked,
      children,
      label,
      onChange,
      value,
      ...props
    },
    ref
  ) => (
    <Box
      as="label"
      css={css({
        alignItems: 'center',
        cursor: 'pointer',
        display: 'inline-flex',
        mr: 1,
        transition: 'box-shadow 0.2s ease-out, color 0.2s ease-out',
        userSelect: 'none',
        verticalAlign: 'top',
        '&:hover': {
          color: 'primary',
        },
        // TODO: Should the focus ring include the label?
        // '&:focus-within, &:active': {
        //   boxShadow: 'outline',
        //   outline: 'none',
        // },
        '&:active': {
          color: 'text',
        },
      })}
      {...props}
    >
      <Invisible
        aria-label={ariaLabel}
        as="input"
        checked={checked}
        css={{
          height: 1,
          margin: -1,
          opacity: 0,
          overflow: 'hidden',
          position: 'absolute',
          width: 1,
        }}
        onChange={onChange}
        ref={ref}
        type="checkbox"
        value={value}
      />
      <div
        aria-hidden
        css={css({
          alignItems: 'center',
          bg: checked ? 'primary' : 'subtler',
          borderColor: checked ? 'primary' : 'border',
          borderStyle: 'solid',
          borderRadius: 2,
          borderWidth: 1,
          color: 'subtlest',
          display: 'inline-flex',
          height: 16,
          justifyContent: 'center',
          mr: 2,
          pointerEvents: 'none',
          transition:
            'background-color 0.2s ease-out, border-color 0.2s ease-out',
          width: 16,
          'input[type=checkbox]:focus + &': {
            boxShadow: 'outline',
            outline: 'none',
          },
        })}
      >
        <Checkmark
          css={{
            opacity: checked ? 1 : 0,
            transition: 'opacity 0.2s ease-out',
          }}
          height="12"
          width="12"
        />
      </div>
      {label || children || null}
    </Box>
  )
)

export default Checkbox
