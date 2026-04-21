import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

function themeTriggerIcon(themeMode) {
  if (themeMode === 'light') return 'bi bi-sun-fill'
  if (themeMode === 'dark') return 'bi bi-moon-stars-fill'
  return 'bi bi-circle-half'
}

function SidebarFooter({ notificationsOpen, onNotificationsToggle }) {
  const { t } = useLanguage()
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
      aria-label={t('sidebar.footerAria')}
    >
      <div className="sidebar-footer__row">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-footer__iconLink${isActive ? ' sidebar-footer__iconLink--active' : ''}`
          }
          aria-label={t('sidebar.settingsAria')}
          title={t('sidebar.settingsTitle')}
        >
          <i className="bi bi-gear" aria-hidden="true" />
        </NavLink>
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            `sidebar-footer__iconLink${isActive ? ' sidebar-footer__iconLink--active' : ''}`
          }
          aria-label={t('sidebar.helpAria')}
          title={t('sidebar.helpTitle')}
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
            aria-label={t('sidebar.themeAria')}
            title={t('sidebar.themeTitle')}
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
                  {t('sidebar.themeLight')}
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
                  {t('sidebar.themeDark')}
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
                  {t('sidebar.themeSystem')}
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
          aria-label={t('sidebar.notificationsAria')}
          title={t('sidebar.notificationsTitle')}
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
