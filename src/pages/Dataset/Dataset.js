import React from 'react'
import { useParams } from 'react-router-dom'

const DatasetPage = () => {
  const { id } = useParams()

  return (
    <>
      <h1>Dataset {id}</h1>
    </>
  )
}

export default DatasetPage
