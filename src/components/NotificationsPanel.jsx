import React, { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/NotificationsPanel.css'

function NotificationsPanel({ panelWide = true, onToggleWidth, onClose }) {
  const [activeTab, setActiveTab] = useState('whatsNew')
  const tabsRef = useRef(null)
  const [indicator, setIndicator] = useState({ x: 0, w: 0 })

  const emptyCopy = useMemo(() => {
    if (activeTab === 'inbox') {
      return {
        title: 'Inbox is empty',
        body: 'Messages and direct notifications will appear here.',
      }
    }

    return {
      title: 'No notifications to show yet',
      body: "You'll see helpful info here soon. Stay tuned!",
    }
  }, [activeTab])

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
      aria-label="Notifications"
    >
      <div className="main-notifications-rail__header">
        <h2 className="main-notifications-rail__title">Notifications</h2>
        <div className="main-notifications-rail__headerActions">
          <button
            type="button"
            className="main-notifications-rail__collapse"
            onClick={onToggleWidth}
            aria-label={panelWide ? 'Collapse notifications panel' : 'Expand notifications panel'}
            aria-pressed={panelWide ? 'true' : 'false'}
          >
            <i className={panelWide ? 'bi bi-chevron-left' : 'bi bi-chevron-right'} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="main-notifications-rail__close"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className="main-notifications-rail__tabs"
        role="tablist"
        aria-label="Notifications views"
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
          What&apos;s new
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
          Inbox
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
