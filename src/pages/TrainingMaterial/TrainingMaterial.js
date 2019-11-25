import React from 'react'
import { useParams } from 'react-router-dom'

const TrainingMaterialPage = () => {
  const { id } = useParams()

  return (
    <>
      <h1>TrainingMaterial {id}</h1>
    </>
  )
}

export default TrainingMaterialPage
