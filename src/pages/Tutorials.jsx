import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'
import { useLanguage } from '../context/LanguageContext'

const VIEW_ICONS = {
  overview: 'bi-grid-1x2',
  guides: 'bi-journal-bookmark',
  videos: 'bi-play-circle',
  'deep-dives': 'bi-bezier2',
  expert: 'bi-person-badge',
  library: 'bi-collection',
  course: 'bi-mortarboard',
}

const VIEW_I18N = {
  overview: 'tutorials.views.overview',
  guides: 'tutorials.views.guides',
  videos: 'tutorials.views.videos',
  'deep-dives': 'tutorials.views.deepDives',
  expert: 'tutorials.views.expert',
  library: 'tutorials.views.library',
  course: 'tutorials.views.course',
}

const GROUP_DEFS = [
  { access: 'free', titleKey: 'tutorials.groupFree', views: ['overview', 'guides', 'videos'] },
  {
    access: 'premium',
    titleKey: 'tutorials.groupPremium',
    views: ['deep-dives', 'expert', 'library', 'course'],
  },
]

function Tutorials() {
  const { t } = useLanguage()
  const { tier } = useAccessTier()
  const [params] = useSearchParams()
  const access = params.get('access') || 'free'
  const view = params.get('view') || 'overview'

  const viewLabelKey = VIEW_I18N[view]
  const viewLabel = viewLabelKey ? t(viewLabelKey) : view
  const locked = access === 'premium' && tier !== 'premium'

  const groups = useMemo(
    () =>
      GROUP_DEFS.map((g) => ({
        access: g.access,
        title: t(g.titleKey),
        views: g.views,
      })),
    [t]
  )

  const visibleGroups = useMemo(() => {
    if (tier === 'premium') return groups
    return groups.filter((g) => g.access !== 'premium')
  }, [tier, groups])

  return (
    <div className="sia-page sia-page--wide">
      <h1 className="sia-page__title">{t('tutorials.title')}</h1>

      {locked ? (
        <section className="sia-card" aria-label={t('tutorials.lockTitle')}>
          <h2 className="sia-card__title">{t('tutorials.lockTitle')}</h2>
          <p className="sia-card__body">{t('tutorials.lockBody')}</p>
          <div style={{ marginTop: 12 }}>
            <Link className="sia-home__subnavLink" to="/membership">
              <span className="sia-home__subnavIcon" aria-hidden="true">
                <i className="bi bi-credit-card" />
              </span>
              <span className="sia-home__subnavLabel">{t('tutorials.viewPricing')}</span>
            </Link>
          </div>
        </section>
      ) : null}

      <section
        className="sia-card sia-card--browse"
        aria-label={t('tutorials.browseAria')}
        style={{ marginTop: 14 }}
      >
        <h2 className="sia-card__title">{t('tutorials.browseTitle')}</h2>
        <div className="sia-browseGrid">
          {visibleGroups.flatMap((g) =>
            g.views.map((v) => {
              const href = `/tutorials?access=${encodeURIComponent(g.access)}&view=${encodeURIComponent(v)}`
              const labelKey = VIEW_I18N[v]
              const label = labelKey ? t(labelKey) : v
              return (
                <Link
                  key={`${g.access}-${v}`}
                  className="sia-home__subnavLink sia-browseBtn"
                  to={href}
                >
                  <span className="sia-home__subnavIcon sia-browseBtn__icon" aria-hidden="true">
                    <i className={`bi ${VIEW_ICONS[v] || 'bi-collection-play'}`} />
                  </span>
                  <span className="sia-home__subnavLabel sia-browseBtn__label">{label}</span>
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
