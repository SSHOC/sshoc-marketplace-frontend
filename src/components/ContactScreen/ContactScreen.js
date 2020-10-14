import css from '@styled-system/css'
import React from 'react'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import styled from 'styled-components/macro'
import Text from '../../elements/Text/Text'

const Paragraph = styled(Text)(css({ lineHeight: 'large', mb: 4 }))
const Title = styled(Heading).attrs({ as: 'h1' })(css({ mb: 5 }))

const ContactScreen = () => (
  <>
    <Title>Contact</Title>
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

export default ContactScreen
