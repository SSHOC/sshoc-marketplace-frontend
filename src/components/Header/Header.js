import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'
import { ITEM_CATEGORY } from '../../constants'
import Box from '../../elements/Box/Box'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import FlexList from '../../elements/FlexList/FlexList'
import Link from '../../elements/Link/Link'
import Stack from '../../elements/Stack/Stack'
import { ReactComponent as SSHOCMPLogo } from '../../images/logo.svg'
import { pluralize } from '../../utils'
import LoginForm from '../LoginForm/LoginForm'

const Logo = () => (
  <nav>
    <Link
      aria-label="Home"
      css={css({ display: 'block', lineHeight: 1, my: 3, mx: 3 })}
      to="/"
    >
      <SSHOCMPLogo />
    </Link>
  </nav>
)

const NavItem = styled(Flex).attrs({ as: 'li' })({
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
})

const NavLink = styled(Link).attrs({ variant: 'nav' })(
  css({
    alignItems: 'center',
    display: 'inline-flex',
    flex: 1,
    fontFamily: 'heading',
    fontSize: 15,
    px: 4,
    py: 3,
    '&:hover': {
      bg: 'subtler',
    },
    '&:focus': {
      position: 'relative',
    },
  })
)

const Header = () => (
  <Box
    as="header"
    css={css({
      borderBottomColor: 'subtle',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      position: 'relative',
    })}
  >
    <Container
      as={Flex}
      css={css({
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 0,
        px: 1,
      })}
      variant="wide"
    >
      <Logo />
      <Stack
        css={{
          alignItems: 'flex-end',
          alignSelf: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        <Flex css={css({ alignItems: 'stretch', height: 40, py: 1 })}>
          <LoginForm />
        </Flex>
        <nav>
          <FlexList>
            {Object.entries(ITEM_CATEGORY).map(([key, label]) => (
              <NavItem key={key}>
                <NavLink to={`/search?categories=${key}&sort=label`}>
                  {pluralize(label)}
                </NavLink>
              </NavItem>
            ))}
            <Separator />
            <NavItem>
              <NavLink to="/browse">Browse</NavLink>
            </NavItem>
            <Separator />
            <NavItem>
              <NavLink to="/about">About</NavLink>
            </NavItem>
          </FlexList>
        </nav>
      </Stack>
    </Container>
  </Box>
)

const Separator = () => (
  <NavItem css={css({ alignItems: 'center', display: 'flex', mx: 2 })}>
    <div
      role="separator"
      css={css({
        borderRightColor: 'border',
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        height: '60%',
      })}
    />
  </NavItem>
)

export default Header
