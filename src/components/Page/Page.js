import React from 'react'
import 'styled-components/macro'
import Grid from '../../elements/Grid/Grid'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import Toasts from '../Toasts/Toasts'

const Page = ({ children }) => (
  <>
    <Grid
      css={{
        gridTemplateRows: 'auto 1fr auto',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Header />
      {children}
      <Footer />
    </Grid>
    <Toasts />
  </>
)

export default Page
