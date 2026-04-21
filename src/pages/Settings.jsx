import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function Settings() {
  const { t } = useLanguage()

  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('settings.title')}</h1>
      <p className="sia-page__lead">{t('settings.lead')}</p>
    </div>
  )
}

export default Settings
