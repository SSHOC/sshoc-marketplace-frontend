import React from 'react'
import 'styled-components/macro'
import PrivacyPolicyScreen from '../../components/PrivacyPolicyScreen/PrivacyPolicyScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import { useNavigationFocusScroll, useSearchParams } from '../../utils'

const PrivacyPolicyPage = () => {
  const focusRef = useNavigationFocusScroll()
  const [, setSearchParams] = useSearchParams()

  return (
    <Main ref={focusRef}>
      <Screen
        breadcrumbs={[
          { label: 'Home', value: '/' },
          { label: `Privacy Policy` },
        ]}
        onSearchParamsChange={setSearchParams}
      >
        <PrivacyPolicyScreen />
      </Screen>
    </Main>
  )
}

export default PrivacyPolicyPage
