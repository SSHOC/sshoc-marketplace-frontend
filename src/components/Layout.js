import React from 'react'

import Footer from './Footer'
import Header from './Header'

import styles from './Layout.module.css'

const Layout = ({ children }) => (
  <div className={styles.layout}>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
)

export default Layout
