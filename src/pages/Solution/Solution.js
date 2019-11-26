import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'

const SolutionPage = () => {
  const { id } = useParams()

  return (
    <Container>
      <h1>Solution {id}</h1>
    </Container>
  )
}

export default SolutionPage
