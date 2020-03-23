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
// import { createPath } from '../../utils'

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
    <Title>About</Title>

    <SectionTitle id="what-is-the-sshomp">
      What is the SSH Open Marketplace?
    </SectionTitle>
    <Paragraph css={css({ mb: 6 })}>
      The Social Sciences and Humanities Open Marketplace, built as part of the{' '}
      <Link to="https://www.sshopencloud.eu/">
        Social Sciences and Humanities Open Cloud project (SSHOC)
      </Link>
      , is a discovery portal which pools and contextualises resources for
      Social Sciences and Humanities research communities: tools, services,
      training materials, datasets and activities (workflows and scenarios). The
      Marketplace highlights and showcases solutions for every step of the SSH
      research data life cycle.
    </Paragraph>

    <SectionTitle id="key-aspects">Key aspects</SectionTitle>
    <Stack as="ul" css={css({ mb: 4 })}>
      <ListItem>
        <BulletPoint>01</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          <strong>Curation</strong> &mdash; This portal thrives on a curation
          process that makes it easy to discover the most appropriate results
          for each request, so that researchers can discover the best resources
          for the digital aspects of their work. The curation process relies on
          three components: automatic integration of data sources to keep the
          platform up to date, moderation and the contribution of the SSH
          community itself.
        </Paragraph>
      </ListItem>
      <ListItem>
        <BulletPoint>02</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          <strong>Community</strong> &mdash; The content available in the SSH
          Open Marketplace and its contextualisation is the result of
          collaborative work that is characterised by a user-centric view.
          Features that allow contributions, feedback and comments are
          implemented to ensure that the portal mirrors real research practices.
        </Paragraph>
      </ListItem>
      <ListItem>
        <BulletPoint>03</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          <strong>Contextualisation</strong> &mdash; The portal puts all items
          into context. This contextualisation will help to adapt and reuse the
          content of the SSH Open Marketplace, no matter if they are a piece of
          software, a dataset, a research workflow or scientific article.
        </Paragraph>
      </ListItem>
    </Stack>

    <SectionTitle id="relation-to-eosc">Relation to EOSC</SectionTitle>
    <Paragraph css={css({ mb: 6 })}>
      The SSH Open Marketplace is a Social Sciences and Humanities-friendly
      component for the European Open Science Cloud (EOSC) since the SSHOC
      project, from which this discovery portal is being constructed, is the SSH
      cluster of the EOSC. As a domain oriented portal, it supplements the
      existing services offered by EOSC (e.g. EOSC Marketplace) and aims to
      facilitate fluid exchange of tools, services, data and knowledge.
    </Paragraph>

    <SectionTitle id="in-development">In development</SectionTitle>
    <Paragraph css={css({ mb: 6 })}>
      The development of the portal takes place within Work Package 7 (WP7) of
      the larger SSHOC project and is led by the DARIAH ERIC. An alpha release
      is planned for June 2020, a beta version will follow in December of the
      same year. The final release is expected for December 2021.
    </Paragraph>

    <SectionTitle id="contact-us">Contact us</SectionTitle>
    <Paragraph>
      For any questions relating to the development of the SSH Open Marketplace
      or the SSHOC project, please visit the{' '}
      <Link to="https://www.sshopencloud.eu/">website</Link> or contact{' '}
      <Link to="mailto:info@sshopencloud.eu">info@sshopencloud.eu</Link>.
    </Paragraph>
    <Paragraph css={css({ mb: 6 })}>
      If you want to actively follow the development of the SSH Open
      Marketplace, have a look at our{' '}
      <Link to="https://gitlab.gwdg.de/sshoc">GitLab instance</Link>.
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
    transition: theme => `border-color ${theme.transitions.default}`,
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

const SideNav = ({ url }) => (
  <aside
    css={css({
      bg: 'subtler',
      flexBasis: 'sidebar',
      flexGrow: 0,
      flexShrink: 1,
      mr: 4,
      mb: -16,
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
            About
          </NavLink>
        </li>
        {/* <li>
          <NavLink to={createPath(url, 'news')}>New functionalities</NavLink>
        </li>
        <li>
          <NavLink to={createPath(url, 'faq')}>
            Frequently asked questions
          </NavLink>
        </li> */}
      </Stack>
    </nav>
  </aside>
)

const AboutScreen = () => {
  const { /* path, */ url } = useRouteMatch()

  return (
    <Flex css={css({ flex: 1, mt: 3 })}>
      <SideNav url={url} />
      <Box css={css({ flex: 4, p: 5 })}>
        <Switch>
          {/* <Route path={createPath(path, 'news')}>
            <div>News</div>
          </Route>
          <Route path={createPath(path, 'faq')}>
            <div>F.A.Q.</div>
          </Route> */}
          <Route>
            <About />
          </Route>
        </Switch>
      </Box>
    </Flex>
  )
}

export default AboutScreen
