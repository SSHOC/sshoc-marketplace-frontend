import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const ToolPage = () => {
  const focusRef = useNavigationFocus()
  const { id } = useParams()

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>Tool {id}</h1>
      </Container>
    </Main>
  )
}

export default ToolPage
