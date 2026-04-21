import React, { useCallback, useEffect, useState } from 'react'
import './styles/LayoutM.css'
import { Outlet } from 'react-router-dom'
import { useLanguage } from './context/LanguageContext'
import Side from './components/Side'
import NotificationsPanel from './components/NotificationsPanel'

function LayoutM() {
  const { t } = useLanguage()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [, setRailWide] = useState(true)
  const [notificationsWide, setNotificationsWide] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const openMobileNav = useCallback(() => setMobileNavOpen(true), [])
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  const toggleProfile = useCallback(() => {
    setProfileOpen((open) => !open)
  }, [])

  const closeProfile = useCallback(() => {
    setProfileOpen(false)
  }, [])

  const openNotifications = useCallback(() => {
    setNotificationsOpen(true)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return

    function onKeyDown(e) {
      if (e.key === 'Escape') closeMobileNav()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileNavOpen, closeMobileNav])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    function onChange() {
      if (mq.matches) setMobileNavOpen(false)
    }

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div
      className={`container-fluid d-flex flex-row sia-layout-root${
        mobileNavOpen ? ' sia-mobile-nav-open' : ''
      }`}
    >
      <button
        type="button"
        className="sia-nav-backdrop"
        aria-label={t('sidebar.toggleCloseMobile')}
        tabIndex={-1}
        onClick={closeMobileNav}
      />
      <aside id="sia-app-sidebar" className="sia-sidebar-aside">
        <Side
          notificationsOpen={notificationsOpen}
          onNotificationsToggle={() =>
            setNotificationsOpen((open) => !open)
          }
          onCloseNotifications={() => setNotificationsOpen(false)}
          onRailWideChange={setRailWide}
          mobileNavOpen={mobileNavOpen}
          onMobileNavClose={closeMobileNav}
        />
      </aside>
      <div className="sia-main-column">
        <div className="sia-main-stack">
          <div className="main-content-width main-scrollable sia-main-primary">
            <Outlet
              context={{
                profileOpen,
                toggleProfile,
                closeProfile,
                openNotifications,
                mobileNavOpen,
                openMobileNav,
                closeMobileNav,
              }}
            />
          </div>
          {notificationsOpen ? (
            <NotificationsPanel
              panelWide={notificationsWide}
              onToggleWidth={() => setNotificationsWide((wide) => !wide)}
              onClose={() => setNotificationsOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default LayoutM
