import css from '@styled-system/css'
import React from 'react'
import { NavLink as RouterNavLink, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'
import SearchBar from '../../components/SearchBar/SearchBar'
import Box from '../../elements/Box/Box'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Main from '../../elements/Main/Main'
import Stack from '../../elements/Stack/Stack'
import Text from '../../elements/Text/Text'
import BackgroundImage from '../../images/bg_about.png'
import BackgroundImageHiDPI from '../../images/bg_about@2x.png'
import { useNavigationFocus } from '../../utils'

// TODO: DRY

const About = () => (
  <>
    <Heading as="h1" css={css({ mb: 5 })}>
      About the SSHOC
    </Heading>

    <Heading as="h2" css={css({ mb: 4 })}>
      What is the SSHOC Marketplace?
    </Heading>
    <Text css={css({ lineHeight: 'large', mb: 6 })}>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae vitae sint
      neque voluptatibus ratione obcaecati reiciendis odit minus molestiae,
      saepe ullam temporibus omnis cum necessitatibus tempore, enim iure
      delectus? Similique? Distinctio voluptatum in at tempore voluptate? Nemo
      quaerat porro numquam dolores ad tenetur consectetur. Optio, esse itaque!
      Reprehenderit natus fuga quibusdam dolor exercitationem, accusamus earum
      nisi in quaerat et pariatur! Error id voluptatem excepturi. Nam illo
      delectus adipisci necessitatibus ullam, quis doloribus voluptatum
      blanditiis aut animi modi consequuntur nostrum? Quia voluptate qui
      voluptas recusandae est deserunt quas consequatur mollitia corporis?
    </Text>

    <Heading as="h2" css={css({ mb: 4 })}>
      Key assumptions
    </Heading>
    <Text css={css({ lineHeight: 'large', mb: 4 })}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, totam
      quo. Aliquid accusamus explicabo quia hic facere, obcaecati ipsa quae
      dolorem impedit, et atque fugit eligendi iure autem, tempore reiciendis?
    </Text>
    <Box css={css({ mb: 6 })}>
      <Flex css={css({ mb: 3 })}>
        <Text
          css={css({
            flexBasis: 60,
            flexShrink: 0,
            flexGrow: 0,
            fontSize: 7,
            fontWeight: 'semiBold',
            lineHeight: 1,
          })}
        >
          01
        </Text>
        <Text css={css({ flex: 1, lineHeight: 'large' })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Text>
      </Flex>
      <Flex css={css({ mb: 3 })}>
        <Text
          css={css({
            flexBasis: 60,
            flexShrink: 0,
            flexGrow: 0,
            fontSize: 7,
            fontWeight: 'semiBold',
            lineHeight: 1,
          })}
        >
          02
        </Text>
        <Text css={css({ flex: 1, lineHeight: 'large' })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Text>
      </Flex>
      <Flex css={css({ mb: 3 })}>
        <Text
          css={css({
            flexBasis: 60,
            flexShrink: 0,
            flexGrow: 0,
            fontSize: 7,
            fontWeight: 'semiBold',
            lineHeight: 1,
          })}
        >
          03
        </Text>
        <Text css={css({ flex: 1, lineHeight: 'large' })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Text>
      </Flex>
      <Flex css={css({ mb: 3 })}>
        <Text
          css={css({
            flexBasis: 60,
            flexShrink: 0,
            flexGrow: 0,
            fontSize: 7,
            fontWeight: 'semiBold',
            lineHeight: 1,
          })}
        >
          04
        </Text>
        <Text css={css({ flex: 1, lineHeight: 'large' })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Text>
      </Flex>
    </Box>

    <Heading as="h2" css={css({ mb: 4 })}>
      More info
    </Heading>
    <Text css={css({ lineHeight: 'large', mb: 4 })}>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores ex
      expedita beatae quis sequi. Doloribus, repudiandae minus sapiente natus
      quod ipsam rem earum illo nesciunt aliquam adipisci, omnis maxime soluta?
      Eligendi accusantium consequatur repellendus debitis, adipisci nobis sequi
      repudiandae laboriosam aperiam, inventore, dignissimos illo laudantium
      aliquam recusandae dicta temporibus asperiores voluptates deserunt
      quaerat! Id modi placeat aperiam earum! Repellat, qui. Minus illum ipsam
      iste error natus officiis est ad, omnis rerum dolor, cupiditate, ea in
      nostrum assumenda soluta quod. Veniam, commodi ex. Necessitatibus,
      aliquam. Qui inventore molestias alias animi aliquid!
    </Text>
    <Text css={css({ lineHeight: 'large', mb: 6 })}>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum aliquid
      nulla veniam quisquam corrupti omnis officia cum hic neque atque. Nesciunt
      dolore tempore vitae voluptates et quod fugit, tenetur debitis! Fugiat,
      eos! Ab tempora repellendus quas magni. Ipsum suscipit molestias velit et
      numquam dignissimos voluptatum eveniet corporis dolores fugit enim earum,
      similique molestiae cupiditate placeat laborum exercitationem,
      necessitatibus quis praesentium! Voluptates asperiores est repellat minus
      itaque quas rem natus commodi. Necessitatibus, sint eveniet. Rem
      praesentium quidem at laboriosam aliquid nihil corrupti, placeat iusto
      illum! Amet odio debitis fugiat impedit adipisci. Laboriosam voluptate
      sapiente aut, facere quae vero neque voluptates a nihil beatae culpa natus
      autem amet quibusdam doloremque et adipisci eligendi dignissimos ratione
      dolor laborum voluptatibus velit temporibus quaerat? Impedit! Magni ad
      quaerat sequi pariatur, repellat, rem nobis impedit modi ipsum non tenetur
      ut odio, eum ratione ducimus libero aspernatur? Qui pariatur nulla,
      tempora accusamus quis eius ipsam rerum quaerat?
    </Text>
  </>
)

const NavLink = styled(Link).attrs({ as: RouterNavLink, variant: 'nav' })(
  css({
    color: 'muted',
    display: 'flex',
    fontSize: 2,
    justifyContent: 'space-between',
    p: 4,
    borderLeftColor: 'subtle',
    borderLeftStyle: 'solid',
    borderLeftWidth: 6,
    '&:hover': {
      bg: 'subtlest',
      borderLeftColor: 'primary',
      color: 'primary',
    },
    '&:active': {
      borderLeftColor: 'text',
      color: 'text',
    },
    '&.active': {
      bg: 'subtle',
      borderLeftColor: 'primary',
      color: 'text',
    },
    '&.active:hover': {
      color: 'primary',
    },
    '&:focus': {
      position: 'relative',
    },
  })
)

const AboutPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main
      css={{
        // TODO: Proper media query, or use <img srcset /> or <picture />
        backgroundImage: `url(${
          window.devicePixelRatio >= 1 ? BackgroundImageHiDPI : BackgroundImage
        })`,
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
      ref={focusRef}
    >
      <Container
        as={Flex}
        css={css({ flexDirection: 'column', height: '100%', pb: 0 })}
      >
        <SearchBar css={{ alignSelf: 'flex-end', width: '50%' }} />
        <Breadcrumbs
          paths={[{ label: 'Home', value: '/' }, { label: `About` }]}
        />
        <Flex css={css({ flex: 1, mt: 3 })}>
          <aside
            css={css({
              bg: 'subtler',
              flex: 1,
              minWidth: 'sidebar',
              mr: 4,
              position: 'relative',
              '&::before': {
                bg: 'inherit',
                content: '""',
                height: '100%',
                position: 'absolute',
                right: '100%',
                top: 0,
                width: '100vw',
              },
            })}
          >
            <nav>
              <Stack as="ul">
                <li>
                  <NavLink exact to="/about">
                    About the SSHOC
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about/news">New functionalities</NavLink>
                </li>
                <li>
                  <NavLink to="/about/faq">Frequently asked questions</NavLink>
                </li>
              </Stack>
            </nav>
          </aside>
          <Box css={css({ flex: 4, p: 5 })}>
            <Switch>
              <Route path="/about/news">
                <div>News</div>
              </Route>
              <Route path="/about/faq">
                <div>F.A.Q.</div>
              </Route>
              <Route>
                <About />
              </Route>
            </Switch>
          </Box>
        </Flex>
      </Container>
    </Main>
  )
}

export default AboutPage
