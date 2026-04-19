import React from 'react'
import { useSearchParams } from 'react-router-dom'

const VIEW_LABEL = {
  all: 'All files',
  recent: 'Recent',
  starred: 'Starred',
}

function Downloads() {
  const [params] = useSearchParams()
  const view = params.get('view') || 'all'
  const label = VIEW_LABEL[view] || view

  return (
    <div className="sia-page">
      <h1 className="sia-page__title">Downloads</h1>
      <p className="sia-page__lead">{label}</p>

      <section className="sia-card" aria-label="Downloads list">
        <h2 className="sia-card__title">{label}</h2>
        <p className="sia-card__body">
          This page is connected to the sidebar. Next we can load real downloads
          data here.
        </p>
      </section>
    </div>
  )
}

export default Downloads

