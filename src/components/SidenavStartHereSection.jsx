import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import SidenavList from './SidenavList'

function SidenavStartHereSection({
  startHereOpen,
  onStartHereToggle,
  sidebarExpanded,
  pathSelectionLinks,
}) {
  const { t } = useLanguage()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!startHereOpen) return

    function handlePointerDown(event) {
      if (rootRef.current?.contains(event.target)) return
      /* Don’t close when opening / using another main branch (e.g. Views) */
      if (
        event.target.closest?.('[data-sidebar-branch="views"]') ||
        event.target.closest?.('[data-sidebar-branch="sidebar-footer"]')
      )
        return
      onStartHereToggle(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [startHereOpen, onStartHereToggle])

  return (
    <div
      ref={rootRef}
      data-sidebar-branch="start-here"
      className={`sidebar-starthere-section${
        startHereOpen ? ' sidebar-starthere-section--open' : ''
      }`}
    >
      <button
        type="button"
        className="sidebar-nav-item sidebar-starthere-section__trigger w-100 border-0 bg-transparent text-white text-start"
        aria-expanded={startHereOpen}
        onClick={() => onStartHereToggle(!startHereOpen)}
      >
        <i className="bi bi-compass sidebar-nav-item__icon" aria-hidden="true" />
        <span className="sidebar-nav-item__label">{t('startHere.trigger')}</span>
        {sidebarExpanded ? (
          <i
            className="bi bi-chevron-down sidebar-starthere-section__chevron ms-auto"
            aria-hidden="true"
          />
        ) : null}
      </button>

      <div className="sidebar-starthere-section__panel">
        <p className="sidebar-starthere-section__subhead">{t('startHere.pathSelection')}</p>
        <div className="sidebar-starthere-section__links">
          {pathSelectionLinks.map((item) => (
            <SidenavList
              key={item.href}
              icon={item.icon}
              text={t(item.labelKey)}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SidenavStartHereSection
