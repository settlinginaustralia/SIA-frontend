import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function Contact() {
  const { t } = useLanguage()
  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('pages.contactTitle')}</h1>
      <p className="sia-page__lead">{t('pages.contactLead')}</p>
    </div>
  )
}

export default Contact
