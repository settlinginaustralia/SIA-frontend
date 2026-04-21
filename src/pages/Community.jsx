import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function Community() {
  const { t } = useLanguage()
  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('pages.communityTitle')}</h1>
      <p className="sia-page__lead">{t('pages.communityLead')}</p>
    </div>
  )
}

export default Community
