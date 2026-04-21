import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function Faq() {
  const { t } = useLanguage()
  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('pages.faqTitle')}</h1>
      <p className="sia-page__lead">{t('pages.faqLead')}</p>
    </div>
  )
}

export default Faq
