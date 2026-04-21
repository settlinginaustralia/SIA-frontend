import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import SidenavDropdown from './SidenavDropdown'

function SidenavViewsSection({
  viewsOpen,
  onViewsToggle,
  sidebarExpanded,
  openMenus,
  onMenuToggle,
  tutorialFilterGroups,
  downloadViews,
}) {
  const { t } = useLanguage()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!viewsOpen) return

    function handlePointerDown(event) {
      if (rootRef.current?.contains(event.target)) return
      if (
        event.target.closest?.('[data-sidebar-branch="start-here"]') ||
        event.target.closest?.('[data-sidebar-branch="sidebar-footer"]')
      )
        return
      onViewsToggle(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [viewsOpen, onViewsToggle])

  return (
    <div
      ref={rootRef}
      data-sidebar-branch="views"
      className={`sidebar-views-section${
        viewsOpen ? ' sidebar-views-section--open' : ''
      }`}
    >
      <button
        type="button"
        className="sidebar-nav-item sidebar-views-section__trigger w-100 border-0 bg-transparent text-white text-start"
        aria-expanded={viewsOpen}
        onClick={() => onViewsToggle(!viewsOpen)}
      >
        <i className="bi bi-layers sidebar-nav-item__icon" aria-hidden="true" />
        <span className="sidebar-nav-item__label">{t('sidebar.views')}</span>
        {sidebarExpanded ? (
          <i
            className="bi bi-chevron-down sidebar-views-section__chevron ms-auto"
            aria-hidden="true"
          />
        ) : null}
      </button>

      <div className="sidebar-views-section__panel">
        <SidenavDropdown
          icon="bi bi-collection-play"
          text={t('sidebar.tutorials')}
          filterGroups={tutorialFilterGroups}
          isOpen={!!openMenus.tutorials}
          onToggle={(open) => onMenuToggle('tutorials', open)}
          sidebarExpanded={sidebarExpanded || viewsOpen}
          variant="nested"
        />
        <SidenavDropdown
          icon="bi bi-download"
          text={t('sidebar.downloads')}
          items={downloadViews}
          isOpen={!!openMenus.downloads}
          onToggle={(open) => onMenuToggle('downloads', open)}
          sidebarExpanded={sidebarExpanded || viewsOpen}
          variant="nested"
        />
      </div>
    </div>
  )
}

export default SidenavViewsSection
