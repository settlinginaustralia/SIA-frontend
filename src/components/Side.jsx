import React, { useEffect, useRef, useState } from 'react'
import '../styles/Sidebar.css'
import { useLocation } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'
import { pathSelectionLinks } from '../data/pathSelectionLinks'
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
      { label: 'Overview', view: 'overview', icon: 'bi bi-grid-1x2' },
      { label: 'Guides', view: 'guides', icon: 'bi bi-journal-bookmark' },
      { label: 'Videos', view: 'videos', icon: 'bi bi-play-circle' },
    ],
  },
  {
    title: 'Premium',
    access: 'premium',
    items: [
      { label: 'Deep dives', view: 'deep-dives', icon: 'bi bi-bezier2' },
      { label: 'Expert sessions', view: 'expert', icon: 'bi bi-person-badge' },
      { label: 'Full library', view: 'library', icon: 'bi bi-collection' },
      { label: 'Course', view: 'course', icon: 'bi bi-mortarboard' },
    ],
  },
]

const downloadViews = [
  { label: 'All files', href: '/downloads?view=all' },
  { label: 'Recent', href: '/downloads?view=recent' },
  { label: 'Starred', href: '/downloads?view=starred' },
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
  mobileNavOpen = false,
  onMobileNavClose,
}) {
  const location = useLocation()
  const pathRef = useRef(null)
  const { tier } = useAccessTier()
  const [sidebarClass, setSidebarClass] = useState('sidebar-width')
  const [openMenus, setOpenMenus] = useState(readOpenMenus)
  const [viewsOpen, setViewsOpen] = useState(() => readStored(SS_VIEWS, false))
  const [startHereOpen, setStartHereOpen] = useState(() =>
    readStored(SS_START, false)
  )

  const [isMobileLayout, setIsMobileLayout] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)')
    const apply = () => setIsMobileLayout(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (mobileNavOpen) setSidebarClass('sidebar-width')
  }, [mobileNavOpen])

  useEffect(() => {
    if (pathRef.current === null) {
      pathRef.current = location.pathname
      return
    }
    if (pathRef.current !== location.pathname) {
      pathRef.current = location.pathname
      onMobileNavClose?.()
    }
  }, [location.pathname, onMobileNavClose])

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
    if (isMobileLayout) {
      onMobileNavClose?.()
      return
    }
    setSidebarClass((prev) =>
      prev === 'sidebar-width' ? 'sidebar-width-sm' : 'sidebar-width'
    )
    setOpenMenus({ ...defaultOpenMenus })
    setViewsOpen(false)
    setStartHereOpen(false)
    onCloseNotifications?.()
  }

  function handleMobileNavLinkIntent(event) {
    if (!isMobileLayout) return
    const link = event.target.closest('a[href]')
    if (!link) return
    const href = link.getAttribute('href')
    if (!href || href.startsWith('#')) return
    onMobileNavClose?.()
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
      onClickCapture={handleMobileNavLinkIntent}
    >
      <button
        type="button"
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-expanded={isMobileLayout ? mobileNavOpen : expanded}
        aria-label={
          isMobileLayout
            ? 'Close menu'
            : expanded
              ? 'Collapse sidebar'
              : 'Expand sidebar'
        }
      >
        <i
          className={`bi ${isMobileLayout ? 'bi-x-lg' : 'bi-layout-sidebar'}`}
          aria-hidden="true"
        />
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
        onNotificationsToggle={() => {
          onNotificationsToggle?.()
          if (isMobileLayout) onMobileNavClose?.()
        }}
      />
    </div>
  )
}

export default Side
