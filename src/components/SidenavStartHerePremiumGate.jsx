import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

/** Shown to free users: Start Here exists but path selection is premium-only */
function SidenavStartHerePremiumGate({ sidebarExpanded }) {
  const { t } = useLanguage()
  return (
    <div
      className="sidebar-starthere-gate"
      data-sidebar-branch="start-here"
    >
      <Link
        className="sidebar-nav-item sidebar-starthere-gate__link"
        to="/membership"
        title={t('sidebar.startHereGateTitle')}
      >
        <i className="bi bi-lock-fill sidebar-nav-item__icon" aria-hidden="true" />
        <span className="sidebar-nav-item__label">{t('startHere.trigger')}</span>
        {sidebarExpanded ? (
          <span className="sidebar-premium-badge ms-auto">{t('profile.tierPremium')}</span>
        ) : null}
      </Link>
      {sidebarExpanded ? (
        <p className="sidebar-starthere-gate__hint">{t('sidebar.startHereHint')}</p>
      ) : null}
    </div>
  )
}

export default SidenavStartHerePremiumGate
