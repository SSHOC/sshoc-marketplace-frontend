import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import FlexList from '../../elements/FlexList/FlexList'
import Link from '../../elements/Link/Link'
import Stack from '../../elements/Stack/Stack'
import { ReactComponent as SSHOCMPLogo } from '../../images/logo.svg'
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
            <NavItem>
              <NavLink to="/search?categories=dataset&sort=label">
                Datasets
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/search?categories=tool&sort=label">Tools</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/search?categories=training-material&sort=label">
                Training Materials
              </NavLink>
            </NavItem>
            <NavItem
              css={css({ alignItems: 'center', display: 'flex', mx: 2 })}
            >
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
            <NavItem>
              <NavLink to="/about">About</NavLink>
            </NavItem>
          </FlexList>
        </nav>
      </Stack>
    </Container>
  </Box>
)

export default Header
