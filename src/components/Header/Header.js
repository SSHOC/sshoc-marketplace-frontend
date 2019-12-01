import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import FlexList from '../../elements/FlexList/FlexList'
import Link from '../../elements/Link/Link'
import Stack from '../../elements/Stack/Stack'
// import { useColorMode } from '../../styles'

const Logo = () => (
  <nav>
    <Stack
      as={Link}
      css={css({
        alignItems: 'center',
        lineHeight: 'small',
        my: 3,
        py: 3,
        ':hover': {
          borderBottomColor: 'transparent',
        },
      })}
      to="/"
    >
      <span css={css({ fontSize: 8, fontWeight: 'bold' })}>SSHOC</span>
      <span
        css={css({
          color: 'muted',
          fontSize: 1,
          letterSpacing: 4.5,
          textTransform: 'uppercase',
          mr: -4.5,
        })}
      >
        Marketplace
      </span>
    </Stack>
  </nav>
)

const NavLink = styled(Link).attrs({ variant: 'nav' })(
  css({
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
        <nav>&nbsp;</nav>
        <nav>
          <FlexList>
            <li>
              <NavLink to="/search?categories=dataset">Datasets</NavLink>
            </li>
            <li>
              <NavLink to="/search?categories=solution">Solutions</NavLink>
            </li>
            <li>
              <NavLink to="/search?categories=tool">Tools</NavLink>
            </li>
            <li>
              <NavLink to="/search?categories=training-material">
                Training Materials
              </NavLink>
            </li>
            <li css={css({ alignItems: 'center', display: 'flex', mx: 2 })}>
              <div
                role="separator"
                css={css({
                  borderRightColor: 'border',
                  borderRightWidth: 1,
                  borderRightStyle: 'solid',
                  height: '60%',
                })}
              />
            </li>
            <li>
              <NavLink to="/about">About the SSHOC</NavLink>
            </li>
          </FlexList>
        </nav>
      </Stack>
    </Container>
  </Box>
)

export default Header
