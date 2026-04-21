import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import '../styles/NotificationsPanel.css'

function NotificationsPanel({ panelWide = true, onToggleWidth, onClose }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('whatsNew')
  const tabsRef = useRef(null)
  const [indicator, setIndicator] = useState({ x: 0, w: 0 })

  const emptyCopy = useMemo(() => {
    if (activeTab === 'inbox') {
      return {
        title: t('notifications.emptyInboxTitle'),
        body: t('notifications.emptyInboxBody'),
      }
    }

    return {
      title: t('notifications.emptyGeneralTitle'),
      body: t('notifications.emptyGeneralBody'),
    }
  }, [activeTab, t])

  useEffect(() => {
    const root = tabsRef.current
    if (!root) return
    const activeEl = root.querySelector('[data-active="true"]')
    if (!activeEl) return

    setIndicator({
      x: activeEl.offsetLeft,
      w: activeEl.offsetWidth,
    })
  }, [activeTab, panelWide])

  return (
    <aside
      className="main-notifications-rail side-bg"
      data-panel-wide={panelWide ? 'true' : 'false'}
      aria-label={t('notifications.aria')}
    >
      <div className="main-notifications-rail__header">
        <h2 className="main-notifications-rail__title">{t('notifications.title')}</h2>
        <div className="main-notifications-rail__headerActions">
          <button
            type="button"
            className="main-notifications-rail__collapse"
            onClick={onToggleWidth}
            aria-label={
              panelWide ? t('notifications.collapseWide') : t('notifications.collapseNarrow')
            }
            aria-pressed={panelWide ? 'true' : 'false'}
          >
            <i className={panelWide ? 'bi bi-chevron-left' : 'bi bi-chevron-right'} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="main-notifications-rail__close"
            onClick={onClose}
            aria-label={t('notifications.close')}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className="main-notifications-rail__tabs"
        role="tablist"
        aria-label={t('notifications.tablistAria')}
      >
        <div
          className="main-notifications-rail__tabsRow"
          ref={tabsRef}
          style={
            {
              '--notifications-tab-ind-x': `${indicator.x}px`,
              '--notifications-tab-ind-w': `${indicator.w}px`,
            }
          }
        >
        <button
          type="button"
          className={`main-notifications-rail__tab ${activeTab === 'whatsNew' ? 'is-active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'whatsNew'}
          aria-controls="notifications-panel-whatsnew"
          id="notifications-tab-whatsnew"
          onClick={() => setActiveTab('whatsNew')}
          data-active={activeTab === 'whatsNew' ? 'true' : 'false'}
        >
          {t('notifications.tabWhatsNew')}
        </button>
        <button
          type="button"
          className={`main-notifications-rail__tab ${activeTab === 'inbox' ? 'is-active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'inbox'}
          aria-controls="notifications-panel-inbox"
          id="notifications-tab-inbox"
          onClick={() => setActiveTab('inbox')}
          data-active={activeTab === 'inbox' ? 'true' : 'false'}
        >
          {t('notifications.tabInbox')}
        </button>
        </div>
      </div>
      <div className="main-notifications-rail__body">
        <div
          className="main-notifications-rail__emptyState"
          role="tabpanel"
          id={activeTab === 'inbox' ? 'notifications-panel-inbox' : 'notifications-panel-whatsnew'}
          aria-labelledby={activeTab === 'inbox' ? 'notifications-tab-inbox' : 'notifications-tab-whatsnew'}
        >
          <div className="main-notifications-rail__emptyIcon" aria-hidden="true">
            <i className={activeTab === 'inbox' ? 'bi bi-inbox' : 'bi bi-bell'} />
          </div>
          <div className="main-notifications-rail__emptyText" role="status">
            <p className="main-notifications-rail__emptyTitle">{emptyCopy.title}</p>
            <p className="main-notifications-rail__empty">{emptyCopy.body}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default NotificationsPanel
