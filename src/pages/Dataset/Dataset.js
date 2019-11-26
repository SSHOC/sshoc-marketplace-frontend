import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'

const DatasetPage = () => {
  const { id } = useParams()

  return (
    <Container>
      <h1>Dataset {id}</h1>
    </Container>
  )
}

export default DatasetPage
