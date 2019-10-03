import React from 'react'
import { NavLink } from 'react-router-dom'

import styles from './Nav.module.css'

const Nav = () => (
  <nav className={styles.nav}>
    <ul className={styles.items}>
      <li className={styles.item}>
        <NavLink to="/">Home</NavLink>
      </li>
    </ul>
  </nav>
)

export default Nav
