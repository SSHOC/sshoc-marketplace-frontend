import React from 'react'
import { useParams } from 'react-router-dom'

const ToolPage = () => {
  const { id } = useParams()

  return (
    <>
      <h1>Tool {id}</h1>
    </>
  )
}

export default ToolPage
