import css from '@styled-system/css'
import React from 'react'
import {
  NavLink as RouterNavLink,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Stack from '../../elements/Stack/Stack'
import Text from '../../elements/Text/Text'

const Title = styled(Heading).attrs({ as: 'h1' })(css({ mb: 5 }))

const SectionTitle = styled(Heading).attrs({ as: 'h2' })(css({ mb: 4 }))

const Paragraph = styled(Text)(css({ lineHeight: 'large', mb: 4 }))

const ListItem = styled(Flex).attrs({ as: 'li' })(css({ mb: 3 }))

const BulletPoint = styled(Text)(
  css({
    flexBasis: 60,
    flexShrink: 0,
    flexGrow: 0,
    fontSize: 7,
    fontWeight: 'semiBold',
    lineHeight: 1,
  })
)

const About = () => (
  <>
    <Title>About the SSHOC</Title>

    <SectionTitle>What is the SSHOC Marketplace?</SectionTitle>
    <Paragraph css={css({ mb: 6 })}>
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
    </Paragraph>

    <SectionTitle>Key assumptions</SectionTitle>
    <Paragraph>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, totam
      quo. Aliquid accusamus explicabo quia hic facere, obcaecati ipsa quae
      dolorem impedit, et atque fugit eligendi iure autem, tempore reiciendis?
    </Paragraph>
    <Stack as="ul" css={css({ mb: 4 })}>
      <ListItem>
        <BulletPoint>01</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Paragraph>
      </ListItem>
      <ListItem>
        <BulletPoint>02</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Paragraph>
      </ListItem>
      <ListItem>
        <BulletPoint>03</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Paragraph>
      </ListItem>
      <ListItem>
        <BulletPoint>04</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          accusamus, nam deserunt consequatur iste natus quaerat et at tempora
          minus eos aut? Molestiae sequi corrupti quam porro amet, nam
          similique?
        </Paragraph>
      </ListItem>
    </Stack>

    <SectionTitle>More info</SectionTitle>
    <Paragraph>
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
    </Paragraph>
    <Paragraph css={css({ mb: 6 })}>
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
    </Paragraph>
  </>
)

const NavLink = styled(Link).attrs({ as: RouterNavLink, variant: 'nav' })(
  css({
    borderLeftColor: 'subtle',
    borderLeftStyle: 'solid',
    borderLeftWidth: 6,
    color: 'muted',
    display: 'flex',
    fontSize: 2,
    justifyContent: 'space-between',
    p: 4,
    transition: 'border-color 0.2s ease-out',
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

const createPath = (basepath, path) =>
  [basepath, path].join(basepath.endsWith('/') ? '' : '/')

const SideNav = ({ url }) => (
  <aside
    css={css({
      bg: 'subtler',
      flexBasis: 'sidebar',
      flexGrow: 1,
      flexShrink: 0,
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
          <NavLink exact to={url}>
            About the SSHOC
          </NavLink>
        </li>
        <li>
          <NavLink to={createPath(url, 'news')}>New functionalities</NavLink>
        </li>
        <li>
          <NavLink to={createPath(url, 'faq')}>
            Frequently asked questions
          </NavLink>
        </li>
      </Stack>
    </nav>
  </aside>
)

const AboutScreen = () => {
  const { path, url } = useRouteMatch()

  return (
    <Flex css={css({ flex: 1, mt: 3 })}>
      <SideNav url={url} />
      <Box css={css({ flex: 4, p: 5 })}>
        <Switch>
          <Route path={createPath(path, 'news')}>
            <div>News</div>
          </Route>
          <Route path={createPath(path, 'faq')}>
            <div>F.A.Q.</div>
          </Route>
          <Route>
            <About />
          </Route>
        </Switch>
      </Box>
    </Flex>
  )
}

export default AboutScreen
