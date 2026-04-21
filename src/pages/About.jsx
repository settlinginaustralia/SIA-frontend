import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function About() {
  const { t } = useLanguage()
  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('pages.aboutTitle')}</h1>
      <p className="sia-page__lead">{t('pages.aboutLead')}</p>
    </div>
  )
}

export default About
