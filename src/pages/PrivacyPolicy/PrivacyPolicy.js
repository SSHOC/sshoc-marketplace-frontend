import React from 'react'
import 'styled-components/macro'
import PrivacyPolicyScreen from '../../components/PrivacyPolicyScreen/PrivacyPolicyScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import { useNavigationFocus, useSearchParams } from '../../utils'

const PrivacyPolicyPage = () => {
  const focusRef = useNavigationFocus()
  const [, setSearchParams] = useSearchParams()

  return (
    <Main ref={focusRef}>
      <Screen
        breadcrumbs={[
          { label: 'Home', value: '/' },
          { label: `Privacy Policy` },
        ]}
        setSearchParams={setSearchParams}
      >
        <PrivacyPolicyScreen />
      </Screen>
    </Main>
  )
}

export default PrivacyPolicyPage
