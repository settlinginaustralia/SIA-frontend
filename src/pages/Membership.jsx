import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function Membership() {
  const { t } = useLanguage()
  return (
    <div className="sia-page">
      <h1 className="sia-page__title">{t('pages.membershipTitle')}</h1>
      <p className="sia-page__lead">{t('pages.membershipLead')}</p>
    </div>
  )
}

export default Membership
