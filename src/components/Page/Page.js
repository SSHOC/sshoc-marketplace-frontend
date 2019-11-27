import React from 'react'
import 'styled-components/macro'
import Grid from '../../elements/Grid/Grid'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

const Page = ({ children }) => (
  <Grid
    css={{
      gridTemplateRows: 'auto 1fr auto',
      minHeight: '100vh',
      overflowX: 'hidden',
    }}
  >
    <Header />
    {children}
    <Footer />
  </Grid>
)

export default Page
