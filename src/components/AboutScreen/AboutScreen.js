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
import { createPath } from '../../utils'

const Title = styled(Heading).attrs({ as: 'h1' })(css({ mb: 5 }))

const SectionTitle = styled(Heading).attrs({ as: 'h2' })(css({ mb: 4 }))

const SectionHeading = styled(Heading).attrs({ as: 'h3' })(css({ mb: 4 }))

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
    <Title id="what-is-the-sshomp">What is the SSH Open Marketplace?</Title>

    <Paragraph css={css({ mb: 6 })}>
      The Social Sciences and Humanities Open Marketplace, built as part of the{' '}
      <Link to="https://www.sshopencloud.eu/">
        Social Sciences and Humanities Open Cloud project (SSHOC)
      </Link>
      , is a discovery portal which pools and contextualises resources for
      Social Sciences and Humanities research communities: tools, services,
      training materials, datasets and activities (workflows and scenarios). The
      Marketplace highlights and showcases solutions and research practices for
      every step of the SSH research data life cycle.
    </Paragraph>

    <SectionTitle id="key-aspects">Key aspects</SectionTitle>
    <Stack as="ul" css={css({ mb: 4 })}>
      <ListItem css={css({ mb: 0 })}>
        <BulletPoint>01</BulletPoint>
        <Paragraph css={css({ flex: 1 })}>
          <strong>Curation</strong> &mdash; This portal thrives on a curation
          process that makes it easy to discover the most appropriate results
          for each request, so that researchers can discover the best resources
          for the digital aspects of their work. The curation process relies on
          three components: automatic ingest and update of data sources;
          continuous curation of the information by the editorial team and -
          most important - contributions from its users, the SSH community.
        </Paragraph>
      </ListItem>
      <ListItem css={css({ mb: 0 })}>
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
      The SSH Open Marketplace is a Social Sciences and Humanities component for
      the European Open Science Cloud (EOSC) since the SSHOC project, from which
      this discovery portal is being constructed, is the SSH cluster of the
      EOSC. As a domain oriented portal, it supplements the existing services
      offered by EOSC (e.g. EOSC Catalogue &amp; Marketplace) and aims to
      facilitate fluid exchange of tools, services, data and knowledge.
    </Paragraph>

    <SectionTitle id="in-development">In development</SectionTitle>
    <Paragraph>
      The development of the portal takes place within Work Package 7 (WP7) of
      the larger SSHOC project and is led by the DARIAH ERIC.
    </Paragraph>
    <Paragraph>
      Three releases of this website are planed between June 2020 and December
      2021:
    </Paragraph>
    <Stack as="ul" css={css({ mb: 4 })}>
      <ListItem css={css({ ml: 4 })}>
        <strong>June 2020</strong>: alpha version of the website is available
        for testers
      </ListItem>
      <ListItem css={css({ ml: 4 })}>
        <strong>December 2020</strong>: beta and public release
      </ListItem>
      <ListItem css={css({ ml: 4 })}>
        <strong>December 2021</strong>: final release of the SSH Open
        Marketplace
      </ListItem>
    </Stack>
    <Paragraph>
      If you are interested in contributing to the SSH Open Marketplace, join
      our testers&apos; team, you can register{' '}
      <Link to="https://www.sshopencloud.eu/form/ssh-open-marketplace-join-community-testers">
        here
      </Link>
      , or check our public consultation where we gather users&apos; feedback
      (available soon on the{' '}
      <Link to="https://www.sshopencloud.eu/">SSHOC website</Link>).
    </Paragraph>
    <Paragraph css={css({ mb: 6 })}>
      And if you want to actively follow the development of the SSH Open
      Marketplace, have a look at{' '}
      <Link to="https://gitlab.gwdg.de/sshoc">our GitLab instance</Link>.
    </Paragraph>

    <SectionTitle id="contact-us">Contact us</SectionTitle>
    <Paragraph>
      For any questions relating to the development of the SSH Open Marketplace
      or the SSHOC project, please visit the{' '}
      <Link to="https://www.sshopencloud.eu/">website</Link> or contact{' '}
      <Link to="mailto:sshopenmarketplace@sshopencloud.eu">
        sshopenmarketplace@sshopencloud.eu
      </Link>
      .
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
            What is the SSH Open Marketplace?
          </NavLink>
        </li>
        <li>
          <NavLink to={createPath(url, 'how-it-is-built')}>
            How this website is built
          </NavLink>
        </li>
        <li>
          <NavLink to={createPath(url, 'team')}>
            The team behind the Marketplace
          </NavLink>
        </li>
      </Stack>
    </nav>
  </aside>
)

const HowThisWebsiteIsBuilt = () => (
  <>
    <Title>How this website is built</Title>

    <SectionTitle>Content and sources</SectionTitle>
    <Paragraph>
      During the development phase of the MP, <strong>sources</strong> where to
      collect information and populate the SSH Open Marketplace have been
      identified and prioritised. In an initial onboarding phase (Jan-Jun 2020),
      1,500 individual resources coming from TAPoR, Programming Historian and
      the Standardization Survival Kit (SSK) have been ingested. The extended
      population phase (Jun 2020-Dec2020) will be based on the following
      sources: CLARIN/SSHOC Switchboard, DH Conference papers, EOSC portal
      marketplace, CESSDA Data Catalogue, CLARIN VLO, CLARIN resource families,
      METHODICA, TERESAH.
    </Paragraph>
    <Paragraph>
      Resources and content collected in the above-mentioned sources are - for
      the time being - organised through 5 main types in the SSH Open
      Marketplace: (1) tools (software and service), (2) training materials, (3)
      workflows, (4) dataset and (5) research papers.
    </Paragraph>
    <Stack as="ul">
      <ListItem css={css({ mb: 0 })}>
        <Paragraph css={css({ ml: 4 })}>
          <strong>Source</strong>: A third-party catalogue, containing
          information about items of interest relevant in the scope of the
          Marketplace, which is ingested as a whole in the SSH Open Marketplace.
          One example: TAPoR, a gateway to the tools used in sophisticated text
          analysis and retrieval helped us to populate the SSH Open Marketplace
          with 1371 tools.
        </Paragraph>
      </ListItem>
      <ListItem css={css({ mb: 0 })}>
        <Paragraph css={css({ ml: 4 })}>
          A <strong>resource</strong> or an <strong>item</strong>: These
          represent the actual content level, i.e. individual entries in the SSH
          Open Marketplace, representing individual tools, services, training
          materials or workflows. For instance: Voyant Tools, a text analysis
          tool listed in TAPoR.
        </Paragraph>
      </ListItem>
    </Stack>
    <Paragraph css={css({ mb: 6 })}>
      For an overview on the content population of the future SSH Open
      Marketplace, you may read our{' '}
      <Link to="https://www.sshopencloud.eu/news/ssh-open-marketplace-whats-it-you">
        blog post
      </Link>
      .
    </Paragraph>

    <SectionTitle>Curation of the SSH Open Marketplace</SectionTitle>
    <SectionHeading>Curation criteria</SectionHeading>
    <Paragraph>
      The first criteria on which the selection of content is based are:
    </Paragraph>
    <Stack as="ul">
      <ListItem css={css({ mb: 0 })}>
        <Paragraph css={css({ ml: 4 })}>
          <strong>SSH scope</strong>: relating to whether a resource is
          pertinent in terms of its &quot;SSH disciplines&quot; scope.
        </Paragraph>
      </ListItem>
      <ListItem css={css({ mb: 0 })}>
        <Paragraph css={css({ ml: 4 })}>
          <strong>Used in research communities</strong>: relating to whether a
          resource is (widely) used in a given research community. In the SSH
          Open Marketplace, the contextualisation of an item and its relation
          with others, as well as some &quot;community features&quot; ensure we
          answer this criteria.
        </Paragraph>
      </ListItem>
      <ListItem css={css({ mb: 0 })}>
        <Paragraph css={css({ ml: 4 })}>
          <strong>Up-to-date/maintained</strong>: relating to the need to
          provide up-to-date resources, thus to identify possible outdated ones.
        </Paragraph>
      </ListItem>
      <ListItem css={css({ mb: 0 })}>
        <Paragraph css={css({ ml: 4 })}>
          <strong>Openness</strong>: resources showcased in the SSH Open
          Marketplace facilitate the uptake of Open Science workflows and open
          research practices and preferably are themselves built on open source
          solutions and/or published in open formats.
        </Paragraph>
      </ListItem>
    </Stack>
    <Paragraph>
      During the next months, this list will be enriched and improved.
    </Paragraph>
    <SectionHeading>Community curation</SectionHeading>
    <Paragraph>
      As a curator, you will be, from December 2020 onwards, able to suggest new
      content in the SSH Open Marketplace, but also to propose changes to
      existing items.
    </Paragraph>
    <Paragraph css={css({ mb: 6 })}>
      As a moderator, you could become a dedicated member of the SSH Open
      Marketplace&apos;s editorial board.
    </Paragraph>

    <SectionTitle>EOSC integration</SectionTitle>
    <Paragraph>
      The SSH Open Marketplace will be fully integrated in the EOSC landscape,
      for example by using EOSC Core services, such as the Federated Identity
      (AAI) services or the EOSC helpdesk. A SSHOC task force is working on
      means to harmonize views on common themes and foster contact with other
      European and international organizations operating in the EOSC
      environment. Specific attention will be paid to the integration of the
      marketplace with other EOSC catalogues and/ or marketplace(s). Beyond this
      task force we also rely for the interoperability issues on the{' '}
      <Link to="https://www.sshopencloud.eu/news/mapping-metadata-interoperability-problems-building-sshoc-interoperability-hub">
        SSHOC Data and Metadata Interoperability Hub
      </Link>
      .
    </Paragraph>
  </>
)

const Team = () => (
  <>
    <Title>The team behind the Marketplace</Title>

    <SectionTitle>How is the website maintained?</SectionTitle>
    <Paragraph>
      Developed within SSHOC, the SSH Open Marketplace will be sustained after
      the end of the project (in April 2022). At the moment of the Alpha
      release, five European Research Infrastructures Consortia (ERIC) members
      of the SSHOC project - DARIAH, CLARIN, CESSDA, ESS and SHARE -, agreed to
      sustain the SSH Open Marketplace for a first period of one year after the
      project.
    </Paragraph>
    <Paragraph>
      Discussions are ongoing to understand which business model will be adopted
      and how responsibilities will be shared among partners in the long run.
    </Paragraph>
    <Paragraph css={css({ mb: 6 })}>
      For more information on legal and data protection issues, please consult{' '}
      <Link to="/privacy-policy">
        our &quot;legal notice&quot; and &quot;privacy policy&quot; sections
      </Link>
      .
    </Paragraph>

    <SectionTitle>Meet the Team</SectionTitle>
    <Paragraph>
      The design and development of the SSH Open Marketplace has been carried
      out by SSHOC WP7 members:
    </Paragraph>
    <Stack as="ul" css={css({ mb: 4 })}>
      <ListItem>CESSDA ERIC: Carsten Thiel</ListItem>
      <ListItem>CLARIN ERIC: Dieter van Uytvanck, Alexander König</ListItem>
      <ListItem>
        DARIAH ERIC: Frank Fischer, Yoann Moranville, Laure Barbot, Eliza
        Papaki, Erzsébet Toth-Czifra
      </ListItem>
      <ListItem>
        PSNC: Tomasz Parkoła, Michał Kozak, Justyna Wytrążek, Ola Nowak
      </ListItem>
      <ListItem>OEAW: Matej Durco, Stefan Probst, Klaus Illmayer</ListItem>
      <ListItem>
        UGOE: Philipp Wieder, Stefan Buddenbohm, Joseph Dung, Raisa Barthauer
      </ListItem>
      <ListItem>TRUST-IT: Marieke Willems, Leonardo Marino</ListItem>
      <ListItem>SWC: Martin Kaltenböck, Sotiris Karampatakis</ListItem>
      <ListItem>
        CNRS: Nicolas Larrousse, Clara Petitfils, Suzanne Dumouchel
      </ListItem>
      <ListItem>CNR: Cesare Concordia</ListItem>
      <ListItem>FORTH: Chryssoula Bekiari, Athina Kritsotaki</ListItem>
    </Stack>
  </>
)

const AboutScreen = () => {
  const { path, url } = useRouteMatch()

  return (
    <Flex css={css({ flex: 1, mt: 3 })}>
      <SideNav url={url} />
      <Box css={css({ flex: 4, p: 5 })}>
        <Switch>
          <Route path={createPath(path, 'how-it-is-built')}>
            <HowThisWebsiteIsBuilt />
          </Route>
          <Route path={createPath(path, 'team')}>
            <Team />
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
