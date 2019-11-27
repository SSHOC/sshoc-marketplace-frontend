import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const TrainingMaterialPage = () => {
  const focusRef = useNavigationFocus()
  const { id } = useParams()

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>TrainingMaterial {id}</h1>
      </Container>
    </Main>
  )
}

export default TrainingMaterialPage
