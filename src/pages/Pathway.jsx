import React from 'react'
import { useParams } from 'react-router-dom'

const PATH_TITLES = {
  'study-pathway': 'Study Pathway',
  'work-pathway': 'Work Pathway',
  'skilled-migration': 'Skilled Migration',
  settlement: 'Settlement',
}

function Pathway() {
  const { pathId } = useParams()
  const title = PATH_TITLES[pathId] || 'Pathway'

  return (
    <div className="sia-page sia-page--wide">
      <h1 className="sia-page__title">{title}</h1>
    </div>
  )
}

export default Pathway

