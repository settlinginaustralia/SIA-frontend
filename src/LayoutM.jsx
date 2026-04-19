import React, { useCallback, useState } from 'react'
import './styles/LayoutM.css'
import { Outlet } from 'react-router-dom'
import Side from './components/Side'
import NotificationsPanel from './components/NotificationsPanel'

function LayoutM() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [, setRailWide] = useState(true)
  const [notificationsWide, setNotificationsWide] = useState(true)

  const toggleProfile = useCallback(() => {
    setProfileOpen((open) => !open)
  }, [])

  const closeProfile = useCallback(() => {
    setProfileOpen(false)
  }, [])

  const openNotifications = useCallback(() => {
    setNotificationsOpen(true)
  }, [])

  return (
    <div className="container-fluid d-flex flex-row sia-layout-root">
      <Side
        notificationsOpen={notificationsOpen}
        onNotificationsToggle={() =>
          setNotificationsOpen((open) => !open)
        }
        onCloseNotifications={() => setNotificationsOpen(false)}
        onRailWideChange={setRailWide}
      />
      <div className="sia-main-column">
        <div className="sia-main-stack">
          <div className="main-content-width main-scrollable sia-main-primary">
            <Outlet
              context={{
                profileOpen,
                toggleProfile,
                closeProfile,
                openNotifications,
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
