import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const VIEW_KEYS = {
  all: 'downloads.views.all',
  recent: 'downloads.views.recent',
  starred: 'downloads.views.starred',
}

function Downloads() {
  const { t } = useLanguage()
  const [params] = useSearchParams()
  const view = params.get('view') || 'all'
  const label = useMemo(() => {
    const key = VIEW_KEYS[view]
    return key ? t(key) : view
  }, [t, view])

  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('downloads.title')}</h1>
      <p className="sia-page__lead">{label}</p>

      <section className="sia-card" aria-label={t('downloads.listAria')}>
        <h2 className="sia-card__title">{label}</h2>
        <p className="sia-card__body">{t('downloads.cardBody')}</p>
      </section>
    </div>
  )
}

export default Downloads
