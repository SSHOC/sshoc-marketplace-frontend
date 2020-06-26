import css from '@styled-system/css'
import React from 'react'
import Heading from '../../elements/Heading/Heading'
import styled from 'styled-components/macro'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

const Title = styled(Heading).attrs({ as: 'h1' })(css({ mb: 5 }))

const SectionTitle = styled(Heading).attrs({ as: 'h2' })(css({ mb: 4 }))

const SectionHeading = styled(Heading).attrs({ as: 'h3' })(css({ mb: 4 }))

const Paragraph = styled(Text)(css({ lineHeight: 'large', mb: 4 }))

const PrivacyPolicyScreen = () => (
  <>
    <Title>Privacy Policy and Legal Notice</Title>

    <SectionTitle>Privacy Policy</SectionTitle>
    <Paragraph>
      This privacy statement describes how the SSH Open Marketplace collects and
      uses data while browsing this website or using our API. We are committed
      to ensuring that your personal details are protected when you use our
      website, or API. If you have any questions about how we use your personal
      information or comply with data protection legislation, please contact us.
    </Paragraph>

    <SectionHeading>What information do we collect?</SectionHeading>
    <Paragraph>
      <strong>Analytics</strong> We use Matomo Analytics to measure the use of
      the SSH Open Marketplace. It collects data about your activities that does
      not personally or directly identify you when you visit our website. This
      information may include content you view, the date and time that you
      viewed the content or your location information associated with your IP
      address. The SSH Open Marketplace uses this information to improve the
      structure and content of our website. More information on how Matomo uses
      data when you use the SSH Open Marketplace can be found on this page.
    </Paragraph>
    <Paragraph>
      <strong>Contact and login details</strong> We collect contact information
      for the user accounts, name and email address of the logged users. This
      information is either provided directly by the user, or after their
      acknowledgment via their Identity Provider (IdP) used in the
      Authentication and Authorization Infrastructure (AAI).
    </Paragraph>

    <SectionHeading>How do we use this information?</SectionHeading>
    <Paragraph>
      The analytics information retrieved only helps in improving the website,
      or getting usage data at a very generic level. The login information is
      used to manage access to the admin site.
    </Paragraph>

    <SectionHeading>
      Will the SSH Open Marketplace share your personal details with anyone
      else?
    </SectionHeading>
    <Paragraph>
      We will not sell, distribute or lease your personal information to third
      parties unless disclosure is required by law. If you feel that this site
      is not following its stated privacy policy, you may contact us. We will be
      sure to address your concerns.
    </Paragraph>

    <SectionTitle css={css({ mt: 6 })}>Legal notice</SectionTitle>
    <Paragraph>
      Development version of the SSH Open Marketplace runs on Austrian servers
      at the Austrian Academy of Science.
    </Paragraph>

    <Paragraph>
      <strong>
        Legal disclosure according to §§ 24, 25 Austrian media law and § 5
        E-Commerce law
      </strong>
    </Paragraph>

    <Paragraph>
      <strong>
        Media owner, publisher, responsible for content and editorial office,
        service provider:
      </strong>
    </Paragraph>

    <Paragraph>
      <div>Austrian Academy of Sciences</div>
      <div>
        Corporate body organized under public law (BGBl 569/1921 idF BGBl I
        130/2003)
      </div>
      <div>
        Austrian Centre for Digital Humanities and Cultural Heritage (ACDH-CH)
      </div>
      <div>Dr. Ignaz Seipel-Platz 2, 1010 Vienna, Austria</div>
      <div>E-Mail: acdh@oeaw.ac.at</div>
    </Paragraph>

    <Paragraph>
      <strong>Nature and purpose of the business:</strong>
    </Paragraph>

    <Paragraph>
      The Austrian Academy of Sciences (OEAW) has the legal duty to support the
      sciences and humanities in every respect. As a learned society, the OEAW
      fosters discourse and cooperation between science and society, politics
      and economy.
    </Paragraph>

    <Paragraph>
      The Austrian Centre for Digital Humanities and Cultural Heritage (ACDH-CH)
      is an OEAW institute founded with the goal to support digital methods in
      arts and humanities disciplines. The ACDH-CH supports digital research in
      manifold ways.
    </Paragraph>

    <Paragraph>
      The ACDH-CH is a consortium member of CLARIAH-AT (http://clariah.at). In
      SSHOC, ACDH-CH is a member of the SSHOC partner DARIAH-EU.
    </Paragraph>

    <Paragraph>
      <strong>Signing power:</strong>
    </Paragraph>

    <Paragraph>
      <div>President: Univ.-Prof. Dr. Anton Zeilinger</div>
      <div>Vice president: Univ.-Doz. Dr. phil. Michael Alram</div>
      <div>
        Class presidents: Univ.-Prof. Dr. phil. Oliver Jens Schmitt, Univ.-Prof.
        Dipl.-Ing. Dr. techn. Georg Brasseur
      </div>
      <div>
        Supervisory body: Academy council. For more information, please visit{' '}
        <Link to="https://www.oeaw.ac.at/die-oeaw/gremien/akademierat/">
          https://www.oeaw.ac.at/die-oeaw/gremien/akademierat/
        </Link>
      </div>
    </Paragraph>

    <Paragraph>
      <strong>Main aim:</strong>
    </Paragraph>

    <Paragraph>
      This website provides an open marketplace as it is defined by the{' '}
      <Link to="https://cordis.europa.eu/project/id/823782">
        SSHOC grant agreement
      </Link>
      .
    </Paragraph>

    <Paragraph>
      <strong>Disclaimer:</strong>
    </Paragraph>

    <Paragraph>
      The Austrian Academy of Sciences does not take responsibility for the
      nature, accuracy, entirety or quality of the provided information.
    </Paragraph>

    <Paragraph>
      In the case of links to websites of other media owners, whose content the
      OEAW is neither directly nor indirectly responsible for, the OEAW does not
      assume liability for their content and excludes any liability in this
      case.
    </Paragraph>

    <SectionTitle css={css({ mt: 6 })}>Copyright notice</SectionTitle>
    <Paragraph>
      <strong>License for source code</strong> The license for the source code
      of the SSH Open Marketplace is Apache License 2.0. More information about
      this license can be found{' '}
      <Link to="https://choosealicense.com/licenses/apache-2.0/">here</Link>.
    </Paragraph>
    <Paragraph>
      <strong>License for content</strong> This website collects its content
      from various sources with different reuse policies. Most of the time,
      catalogues where metadata were collected presented clear licences and you
      can always find information on sources on every item of our catalogue.
    </Paragraph>
    <Paragraph>
      Contributors and Moderators of the SSH Open Marketplace enrich the
      metadata, add new information and links to it.
    </Paragraph>
    <Paragraph>
      We are currently looking for the best licensing framework to support our
      model: we aim to ensure wide distribution and reuse of our data, and to
      avoid attribution stacking or license stacking, but we do consider
      attribution to be an essential information to be provided by data
      aggregators. This section of our website will be updated accordingly.
    </Paragraph>

    <SectionTitle css={css({ mt: 6 })}>Data privacy notice</SectionTitle>
    <Paragraph>
      Please find the ÖAW's detailed data privacy statement{' '}
      <Link to="https://www.oeaw.ac.at/die-oeaw/datenschutz/">here</Link>. The
      contact data published in the context of the imprint duty may not be used
      to send promotional or informational material not explicitly requested. We
      explicitly disagree with this usage.
    </Paragraph>
  </>
)

export default PrivacyPolicyScreen
