import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const SolutionPage = () => {
  const focusRef = useNavigationFocus()
  const { id } = useParams()

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>Solution {id}</h1>
      </Container>
    </Main>
  )
}

export default SolutionPage
