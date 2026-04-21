import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function ResourcesBlog() {
  const { t } = useLanguage()
  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('pages.resourcesTitle')}</h1>
      <p className="sia-page__lead">{t('pages.resourcesLead')}</p>
    </div>
  )
}

export default ResourcesBlog
