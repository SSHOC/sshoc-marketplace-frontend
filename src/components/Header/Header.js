import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import FlexList from '../../elements/FlexList/FlexList'
import Link from '../../elements/Link/Link'
// import { useColorMode } from '../../styles'

const Logo = () => (
  <nav>
    <Flex
      as={Link}
      css={css({
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: 'small',
        py: 4,
        ':hover': {
          borderBottomColor: 'transparent',
        },
      })}
      to="/"
    >
      <span css={css({ fontSize: 6, fontWeight: 'bold' })}>SSHOC</span>
      <span
        css={css({
          color: 'muted',
          fontSize: 1,
          letterSpacing: 4.5,
          textTransform: 'uppercase',
        })}
      >
        Marketplace
      </span>
    </Flex>
  </nav>
)

const NavLink = styled(Link)(
  css({
    ml: 5,
  })
)

const Header = () => (
  <Box
    as="header"
    css={css({
      borderBottomColor: 'border',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
    })}
  >
    <Container
      as={Flex}
      css={css({
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 0,
      })}
    >
      <Logo />
      <Flex
        css={{
          alignItems: 'flex-end',
          alignSelf: 'stretch',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <nav>&nbsp;</nav>
        <nav>
          <FlexList>
            <li>
              <NavLink to="/search?categories=tools">Tools</NavLink>
            </li>
            <li>
              <NavLink to="/search?categories=training-materials">
                Training Materials
              </NavLink>
            </li>
            <li>
              <NavLink to="/search?categories=datasets">Datasets</NavLink>
            </li>
            <li>
              <NavLink to="/search?categories=solutions">Solutions</NavLink>
            </li>
            <li>
              <NavLink to="/about">About the SSHOC</NavLink>
            </li>
          </FlexList>
        </nav>
      </Flex>
    </Container>
  </Box>
)

export default Header
