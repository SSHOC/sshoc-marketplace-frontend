import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import FlexList from '../../elements/FlexList/FlexList'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

const NavLink = styled(Link).attrs({ variant: 'nav' })(
  css({
    color: 'text',
    px: 3,
    py: 3,
    '&:hover': {
      bg: 'subtler',
      color: 'primary',
    },
    '&:active': {
      color: 'text',
    },
  })
)

const Footer = () => (
  <Box as="footer" css={css({ bg: 'subtle', color: 'black' })}>
    <Container
      as={Flex}
      css={css({
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 0,
      })}
    >
      <nav>
        <FlexList>
          <li>
            <NavLink to="/about">About the SSHOC</NavLink>
          </li>
          <li>
            <NavLink to="/privacy-policy">Privacy policy</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </FlexList>
      </nav>
      <Text>Copyright</Text>
    </Container>
  </Box>
)

export default Footer
