import React from 'react'
import 'styled-components/macro'
import ContactScreen from '../../components/ContactScreen/ContactScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import { useNavigationFocus, useSearchParams } from '../../utils'

const ContactPage = () => {
  const focusRef = useNavigationFocus()
  const [, setSearchParams] = useSearchParams()

  return (
    <Main ref={focusRef}>
      <Screen
        breadcrumbs={[{ label: 'Home', value: '/' }, { label: `Contact` }]}
        setSearchParams={setSearchParams}
      >
        <ContactScreen />
      </Screen>
    </Main>
  )
}

export default ContactPage
