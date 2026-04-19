import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'

const LABELS = {
  overview: 'Overview',
  guides: 'Guides',
  videos: 'Videos',
  'deep-dives': 'Deep dives',
  expert: 'Expert sessions',
  library: 'Full library',
  course: 'Course',
}

const VIEW_ICONS = {
  overview: 'bi-grid-1x2',
  guides: 'bi-journal-bookmark',
  videos: 'bi-play-circle',
  'deep-dives': 'bi-bezier2',
  expert: 'bi-person-badge',
  library: 'bi-collection',
  course: 'bi-mortarboard',
}

const GROUPS = [
  { access: 'free', title: 'Free tutorials', views: ['overview', 'guides', 'videos'] },
  {
    access: 'premium',
    title: 'Premium tutorials',
    views: ['deep-dives', 'expert', 'library', 'course'],
  },
]

function Tutorials() {
  const { tier } = useAccessTier()
  const [params] = useSearchParams()
  const access = params.get('access') || 'free'
  const view = params.get('view') || 'overview'

  const viewLabel = LABELS[view] || view
  const locked = access === 'premium' && tier !== 'premium'

  const visibleGroups = useMemo(() => {
    if (tier === 'premium') return GROUPS
    return GROUPS.filter((g) => g.access !== 'premium')
  }, [tier])

  return (
    <div className="sia-page sia-page--wide">
      <h1 className="sia-page__title">Tutorials</h1>

      {locked ? (
        <section className="sia-card" aria-label="Premium locked">
          <h2 className="sia-card__title">Premium tutorial</h2>
          <p className="sia-card__body">
            This tutorial category is for Premium members. Upgrade to unlock it.
          </p>
          <div style={{ marginTop: 12 }}>
            <Link className="sia-home__subnavLink" to="/membership">
              <span className="sia-home__subnavIcon" aria-hidden="true">
                <i className="bi bi-credit-card" />
              </span>
              <span className="sia-home__subnavLabel">View Membership pricing</span>
            </Link>
          </div>
        </section>
      ) : null}

      <section
        className="sia-card sia-card--browse"
        aria-label="Browse tutorial categories"
        style={{ marginTop: 14 }}
      >
        <h2 className="sia-card__title">Browse</h2>
        <div className="sia-browseGrid">
          {visibleGroups.flatMap((g) =>
            g.views.map((v) => {
              const href = `/tutorials?access=${encodeURIComponent(g.access)}&view=${encodeURIComponent(v)}`
              return (
                <Link
                  key={`${g.access}-${v}`}
                  className="sia-home__subnavLink sia-browseBtn"
                  to={href}
                >
                  <span className="sia-home__subnavIcon sia-browseBtn__icon" aria-hidden="true">
                    <i className={`bi ${VIEW_ICONS[v] || 'bi-collection-play'}`} />
                  </span>
                  <span className="sia-home__subnavLabel sia-browseBtn__label">
                    {LABELS[v] || v}
                  </span>
                </Link>
              )
            })
          )}
        </div>
        <p className="sia-browsePicked" aria-live="polite">
          {viewLabel}
        </p>
      </section>
    </div>
  )
}

export default Tutorials

