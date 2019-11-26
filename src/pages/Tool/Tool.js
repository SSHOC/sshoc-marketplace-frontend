import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../elements/Container/Container'

const ToolPage = () => {
  const { id } = useParams()

  return (
    <Container>
      <h1>Tool {id}</h1>
    </Container>
  )
}

export default ToolPage
