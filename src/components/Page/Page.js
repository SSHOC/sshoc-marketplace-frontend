import React from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Grid from '../../elements/Grid/Grid'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

const Layout = styled(Grid)({
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
