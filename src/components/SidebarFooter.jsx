import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function themeTriggerIcon(themeMode) {
  if (themeMode === 'light') return 'bi bi-sun-fill'
  if (themeMode === 'dark') return 'bi bi-moon-stars-fill'
  return 'bi bi-circle-half'
}

function SidebarFooter({ notificationsOpen, onNotificationsToggle }) {
  const { themeMode, setThemeMode } = useTheme()
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const themeWrapRef = useRef(null)

  useEffect(() => {
    if (!themeMenuOpen) return

    function handlePointerDown(event) {
      if (
        themeWrapRef.current &&
        !themeWrapRef.current.contains(event.target)
      ) {
        setThemeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [themeMenuOpen])

  function pickTheme(mode) {
    setThemeMode(mode)
    setThemeMenuOpen(false)
  }

  return (
    <footer
      className="sidebar-footer"
      data-sidebar-branch="sidebar-footer"
      aria-label="Sidebar tools"
    >
      <div className="sidebar-footer__row">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-footer__iconLink${isActive ? ' sidebar-footer__iconLink--active' : ''}`
          }
          aria-label="Settings"
          title="Settings"
        >
          <i className="bi bi-gear" aria-hidden="true" />
        </NavLink>
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            `sidebar-footer__iconLink${isActive ? ' sidebar-footer__iconLink--active' : ''}`
          }
          aria-label="Help"
          title="Help"
        >
          <i className="bi bi-question-circle" aria-hidden="true" />
        </NavLink>
        <div ref={themeWrapRef} className="sidebar-footer__theme-wrap">
          <button
            type="button"
            className={`sidebar-footer__theme-trigger${
              themeMenuOpen ? ' sidebar-footer__theme-trigger--open' : ''
            }`}
            aria-expanded={themeMenuOpen}
            aria-haspopup="true"
            aria-label="Theme: choose light, dark, or system"
            title="Theme"
            onClick={() => setThemeMenuOpen((o) => !o)}
          >
            <i
              className={themeTriggerIcon(themeMode)}
              aria-hidden="true"
            />
          </button>

          {themeMenuOpen ? (
            <ul className="sidebar-footer__theme-menu" role="menu">
              <li role="none">
                <button
                  type="button"
                  className={`sidebar-footer__theme-option${
                    themeMode === 'light'
                      ? ' sidebar-footer__theme-option--active'
                      : ''
                  }`}
                  role="menuitem"
                  onClick={() => pickTheme('light')}
                >
                  <i className="bi bi-sun-fill" aria-hidden="true" />
                  Light
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  className={`sidebar-footer__theme-option${
                    themeMode === 'dark'
                      ? ' sidebar-footer__theme-option--active'
                      : ''
                  }`}
                  role="menuitem"
                  onClick={() => pickTheme('dark')}
                >
                  <i className="bi bi-moon-stars-fill" aria-hidden="true" />
                  Dark
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  className={`sidebar-footer__theme-option${
                    themeMode === 'system'
                      ? ' sidebar-footer__theme-option--active'
                      : ''
                  }`}
                  role="menuitem"
                  onClick={() => pickTheme('system')}
                >
                  <i className="bi bi-circle-half" aria-hidden="true" />
                  System
                </button>
              </li>
            </ul>
          ) : null}
        </div>

        <button
          type="button"
          className={`sidebar-footer__notify${
            notificationsOpen ? ' sidebar-footer__notify--active' : ''
          }`}
          aria-label="Notifications"
          title="Notifications"
          aria-pressed={!!notificationsOpen}
          onClick={() => onNotificationsToggle?.()}
        >
          <i className="bi bi-bell" aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}

export default SidebarFooter
