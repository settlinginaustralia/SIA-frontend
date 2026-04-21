import React, { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/Sidebar.css'
import { useLocation } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'
import { useLanguage } from '../context/LanguageContext'
import { pathSelectionLinks } from '../data/pathSelectionLinks'
import SidenavList from './SidenavList'
import SidenavStartHerePremiumGate from './SidenavStartHerePremiumGate'
import SidenavStartHereSection from './SidenavStartHereSection'
import SidenavViewsSection from './SidenavViewsSection'
import SidebarFooter from './SidebarFooter'

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
  const { t } = useLanguage()
  const location = useLocation()
  const pathRef = useRef(null)
  const { tier } = useAccessTier()

  /** Tutorials menu: two tiers (Free / Premium). Links set ?view=…&access=… for filtering. */
  const tutorialFilterGroups = useMemo(
    () => [
      {
        access: 'free',
        title: t('tutorials.sidebarTierFree'),
        listAriaLabel: `${t('tutorials.sidebarTierFree')} — ${t('tutorials.title')}`,
        items: [
          { label: t('tutorials.views.overview'), view: 'overview', icon: 'bi bi-grid-1x2' },
          { label: t('tutorials.views.guides'), view: 'guides', icon: 'bi bi-journal-bookmark' },
          { label: t('tutorials.views.videos'), view: 'videos', icon: 'bi bi-play-circle' },
        ],
      },
      {
        access: 'premium',
        title: t('tutorials.sidebarTierPremium'),
        listAriaLabel: `${t('tutorials.sidebarTierPremium')} — ${t('tutorials.title')}`,
        items: [
          { label: t('tutorials.views.deepDives'), view: 'deep-dives', icon: 'bi bi-bezier2' },
          { label: t('tutorials.views.expert'), view: 'expert', icon: 'bi bi-person-badge' },
          { label: t('tutorials.views.library'), view: 'library', icon: 'bi bi-collection' },
          { label: t('tutorials.views.course'), view: 'course', icon: 'bi bi-mortarboard' },
        ],
      },
    ],
    [t]
  )

  const downloadViews = useMemo(
    () => [
      { label: t('downloads.views.all'), href: '/downloads?view=all' },
      { label: t('downloads.views.recent'), href: '/downloads?view=recent' },
      { label: t('downloads.views.starred'), href: '/downloads?view=starred' },
    ],
    [t]
  )
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
            ? t('sidebar.toggleCloseMobile')
            : expanded
              ? t('sidebar.toggleCollapse')
              : t('sidebar.toggleExpand')
        }
      >
        <i
          className={`bi ${isMobileLayout ? 'bi-x-lg' : 'bi-layout-sidebar'}`}
          aria-hidden="true"
        />
      </button>

      <nav className="sidebar-nav sidebar-nav--grow" aria-label={t('sidebar.mainNavAria')}>
        <SidenavList
          icon="bi bi-house"
          text={t('sidebar.home')}
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
