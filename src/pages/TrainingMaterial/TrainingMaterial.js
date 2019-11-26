import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'

const TrainingMaterialPage = () => {
  const { id } = useParams()

  return (
    <Container>
      <h1>TrainingMaterial {id}</h1>
    </Container>
  )
}

export default TrainingMaterialPage
