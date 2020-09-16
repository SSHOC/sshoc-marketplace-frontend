import {
  Menu,
  MenuButton,
  MenuItems,
  MenuLink,
  MenuPopover,
} from '@reach/menu-button'
import css from '@styled-system/css'
import variant from '@styled-system/variant'
import React from 'react'
import styled from 'styled-components/macro'
import Link from '../../components/Link/Link'
import Button from '../Button/Button'
import ButtonGroup from '../ButtonGroup/ButtonGroup'
import Chevron from '../Chevron/Chevron'

const DropdownMenu = Menu

const DropdownButton = Button.withComponent(MenuButton)

const DropdownPopover = styled(MenuPopover)(
  css({
    display: 'block',
    position: 'absolute',
    mt: 1,
    zIndex: 'select',
  })
)

const DropdownList = styled(MenuItems)(
  css({
    bg: 'background',
    borderColor: 'border',
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'small',
    display: 'block',
    maxHeight: 200,
    minWidth: '100%',
    py: 2,
    overflowY: 'auto',
    transition: theme => `box-shadow ${theme.transitions.default}`,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    '&:focus, &:focus-within': {
      boxShadow: theme => theme.shadows.small,
      outline: 'none',
      zIndex: 'focus',
    },
    '&:focus.focus-visible, &:focus-within.focus-visible': {
      boxShadow: theme =>
        [theme.shadows.small, theme.shadows.outline].join(', '),
    },
    // We cannot use styled(MenuButton) directly because of
    // https://github.com/reach/reach-ui/issues/119
    '& [data-reach-menu-item]': {
      color: 'inherit',
      cursor: 'pointer',
      display: 'block',
      fontSize: 3,
      px: 3,
      py: 2,
      textDecoration: 'initial',
      transition: theme =>
        [
          `background-color ${theme.transitions.default}`,
          `color ${theme.transitions.default}`,
        ].join(', '),
    },
    '& [data-reach-menu-item][data-selected]': {
      bg: 'subtler',
      color: 'text',
      outline: 'none',
    },
  }),
  variant({
    variants: {
      primary: {
        '& [data-reach-menu-item][data-selected]': {
          color: 'primary',
        },
        '& [data-reach-menu-item][data-selected]:active': {
          color: 'text',
        },
      },
    },
  })
)

const DropdownLink = MenuLink

const Dropdown = ({
  'aria-label': ariaLabel,
  className,
  links,
  size,
  variant,
  ...props
}) => {
  const { path, label } = links[0]

  if (links.length < 2) {
    return (
      <Button
        as={Link}
        disabled={!path}
        size={size}
        to={path}
        variant={variant}
      >
        {label}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      {({ isOpen }) => (
        <>
          <ButtonGroup className={className} {...props}>
            <Button
              as={Link}
              disabled={!path}
              size={size}
              to={path}
              variant={variant}
            >
              {label}
            </Button>
            <DropdownButton
              aria-label={ariaLabel}
              disabled={links.length < 2}
              variant={variant}
            >
              <Chevron
                direction={isOpen ? 'up' : 'down'}
                css={{ pointerEvents: 'none' }}
              />
            </DropdownButton>
          </ButtonGroup>
          <DropdownPopover>
            <DropdownList variant={variant}>
              {links.slice(1).map(({ path, label }) => (
                <DropdownLink as={Link} key={path} to={path}>
                  {label}
                </DropdownLink>
              ))}
            </DropdownList>
          </DropdownPopover>
        </>
      )}
    </DropdownMenu>
  )
}

export default Dropdown
