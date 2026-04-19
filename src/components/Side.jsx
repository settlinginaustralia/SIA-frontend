import React, { useEffect, useState } from 'react'
import '../styles/Sidebar.css'
import { useAccessTier } from '../context/AccessTierContext'
import SidenavList from './SidenavList'
import SidenavStartHerePremiumGate from './SidenavStartHerePremiumGate'
import SidenavStartHereSection from './SidenavStartHereSection'
import SidenavViewsSection from './SidenavViewsSection'
import SidebarFooter from './SidebarFooter'

/** Tutorials menu: two tiers (Free / Premium). Links set ?view=…&access=… for filtering. */
const tutorialFilterGroups = [
  {
    title: 'Free',
    access: 'free',
    items: [
      { label: 'Overview', view: 'overview' },
      { label: 'Guides', view: 'guides' },
      { label: 'Videos', view: 'videos' },
    ],
  },
  {
    title: 'Premium',
    access: 'premium',
    items: [
      { label: 'Deep dives', view: 'deep-dives' },
      { label: 'Expert sessions', view: 'expert' },
      { label: 'Full library', view: 'library' },
      { label: 'Course', view: 'course' },
    ],
  },
]

const downloadViews = [
  { label: 'All files', href: '/downloads?view=all' },
  { label: 'Recent', href: '/downloads?view=recent' },
  { label: 'Starred', href: '/downloads?view=starred' },
]

const pathSelectionLinks = [
  { icon: 'bi bi-mortarboard', text: 'Study Pathway', href: '/path/study-pathway' },
  { icon: 'bi bi-briefcase', text: 'Work Pathway', href: '/path/work-pathway' },
  {
    icon: 'bi bi-globe2',
    text: 'Skilled Migration',
    href: '/path/skilled-migration',
  },
  { icon: 'bi bi-house-heart', text: 'Settlement', href: '/path/settlement' },
]

const SS_VIEWS = 'sia.sidebar.viewsOpen'
const SS_START = 'sia.sidebar.startHereOpen'
const SS_MENU = 'sia.sidebar.openMenu'

const defaultOpenMenus = { tutorials: false, downloads: false }

function readStored(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** Supports multiple dropdowns open; migrates legacy string value in sessionStorage */
function readOpenMenus() {
  const raw = readStored(SS_MENU, null)
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return {
      tutorials: !!raw.tutorials,
      downloads: !!raw.downloads,
    }
  }
  if (raw === 'tutorials') return { tutorials: true, downloads: false }
  if (raw === 'downloads') return { tutorials: false, downloads: true }
  return { ...defaultOpenMenus }
}

function Side({
  notificationsOpen = false,
  onNotificationsToggle,
  onCloseNotifications,
  onRailWideChange,
}) {
  const { tier } = useAccessTier()
  const [sidebarClass, setSidebarClass] = useState('sidebar-width')
  const [openMenus, setOpenMenus] = useState(readOpenMenus)
  const [viewsOpen, setViewsOpen] = useState(() => readStored(SS_VIEWS, false))
  const [startHereOpen, setStartHereOpen] = useState(() =>
    readStored(SS_START, false)
  )

  useEffect(() => {
    sessionStorage.setItem(SS_VIEWS, JSON.stringify(viewsOpen))
  }, [viewsOpen])

  useEffect(() => {
    sessionStorage.setItem(SS_START, JSON.stringify(startHereOpen))
  }, [startHereOpen])

  useEffect(() => {
    sessionStorage.setItem(SS_MENU, JSON.stringify(openMenus))
  }, [openMenus])

  const expanded = sidebarClass === 'sidebar-width'

  useEffect(() => {
    onRailWideChange?.(expanded)
  }, [expanded, onRailWideChange])

  function toggleSidebar() {
    setSidebarClass((prev) =>
      prev === 'sidebar-width' ? 'sidebar-width-sm' : 'sidebar-width'
    )
    setOpenMenus({ ...defaultOpenMenus })
    setViewsOpen(false)
    setStartHereOpen(false)
    onCloseNotifications?.()
  }

  function setMenuOpen(key, open) {
    setOpenMenus((prev) => ({ ...prev, [key]: !!open }))
  }

  const anyViewsDropdownOpen =
    openMenus.tutorials || openMenus.downloads

  const panelOpen =
    viewsOpen ||
    (tier === 'premium' && startHereOpen) ||
    anyViewsDropdownOpen

  return (
    <div
      className={`${sidebarClass} side-bg pageHieght sidebar-pd sidebar-shell${
        panelOpen ? ' sidebar-pd--menu-open' : ''
      }`}
    >
      <button
        type="button"
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <i className="bi bi-layout-sidebar" aria-hidden="true" />
      </button>

      <nav className="sidebar-nav sidebar-nav--grow" aria-label="Main">
        <SidenavList
          icon="bi bi-house"
          text="Home"
          href="/"
        />

        {tier === 'premium' ? (
          <SidenavStartHereSection
            startHereOpen={startHereOpen}
            onStartHereToggle={setStartHereOpen}
            sidebarExpanded={expanded}
            pathSelectionLinks={pathSelectionLinks}
          />
        ) : (
          <SidenavStartHerePremiumGate sidebarExpanded={expanded} />
        )}

        <SidenavViewsSection
          viewsOpen={viewsOpen}
          onViewsToggle={setViewsOpen}
          sidebarExpanded={expanded}
          openMenus={openMenus}
          onMenuToggle={setMenuOpen}
          tutorialFilterGroups={tutorialFilterGroups}
          downloadViews={downloadViews}
        />
      </nav>

      <SidebarFooter
        notificationsOpen={notificationsOpen}
        onNotificationsToggle={onNotificationsToggle}
      />
    </div>
  )
}

export default Side
