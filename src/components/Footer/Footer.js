import css from '@styled-system/css'
import React, { Fragment } from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Container from '../../elements/Container/Container'
import Divider from '../../elements/Divider/Divider'
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
  <Fragment>
    <Container variant="wide" css={css({ width: '100%' })}>
      <Divider />
      <Container css={css({ py: 6 })}>
        <Text css={css({ fontSize: 1, maxWidth: 680 })}>
          The SSH Open Marketplace is developed as part of the "Social Sciences
          and Humanities Open Cloud" SSHOC project, European Union's Horizon
          2020 project call H2020-INFRAEOSC-04-2018, grant agreement #823782.
        </Text>
      </Container>
    </Container>
    <Box as="footer" css={css({ bg: 'subtle', color: 'black' })}>
      <Container
        as={Flex}
        css={css({
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0,
        })}
        variant="wide"
      >
        <nav css={{ flexShrink: 0 }}>
          <FlexList css={{ alignItems: 'center' }}>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy">Privacy policy</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </FlexList>
        </nav>
      </Container>
    </Box>
  </Fragment>
)

export default Footer
