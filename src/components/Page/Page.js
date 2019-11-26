import React from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

const Layout = styled(Box)({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  minHeight: '100vh',
  overflowX: 'hidden',
})

const Page = ({ children }) => (
  <Layout>
    <Header />
    <Box as="main">{children}</Box>
    <Footer />
  </Layout>
)

export default Page
