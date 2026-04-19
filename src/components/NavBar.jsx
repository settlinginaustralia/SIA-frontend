import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import '../styles/NavBar.css'
import { useOutletContext } from 'react-router-dom'

function readIsMobile() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 767.98px)').matches
}

function NavBar() {
  const {
    profileOpen,
    toggleProfile,
    mobileNavOpen,
    openMobileNav,
  } = useOutletContext() ?? {}

  const [isMobile, setIsMobile] = useState(readIsMobile)
  const [siteMenuOpen, setSiteMenuOpen] = useState(false)
  const [menuTopPx, setMenuTopPx] = useState(64)
  const topRowRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (mobileNavOpen) setSiteMenuOpen(false)
  }, [mobileNavOpen])

  useEffect(() => {
    if (profileOpen) setSiteMenuOpen(false)
  }, [profileOpen])

  useEffect(() => {
    if (!siteMenuOpen) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setSiteMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [siteMenuOpen])

  const updateMenuTop = useCallback(() => {
    const el = topRowRef.current
    if (!el) return
    setMenuTopPx(Math.round(el.getBoundingClientRect().bottom + 8))
  }, [])

  useLayoutEffect(() => {
    if (!isMobile || !siteMenuOpen) return

    updateMenuTop()
    const ro = new ResizeObserver(() => updateMenuTop())
    if (topRowRef.current) ro.observe(topRowRef.current)
    window.addEventListener('scroll', updateMenuTop, true)
    window.addEventListener('resize', updateMenuTop)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', updateMenuTop, true)
      window.removeEventListener('resize', updateMenuTop)
    }
  }, [isMobile, siteMenuOpen, updateMenuTop])

  const siteMenuPanel = siteMenuOpen ? (
    <>
      <button
        type="button"
        className="sia-navbar__siteMenuBackdrop"
        aria-label="Close site menu"
        tabIndex={-1}
        onClick={() => setSiteMenuOpen(false)}
      />
      <div
        id="sia-navbar-site-menu"
        className="sia-navbar__siteMenuPanel"
        style={{
          top: `${menuTopPx}px`,
          maxHeight: `calc(100dvh - ${menuTopPx}px - max(16px, env(safe-area-inset-bottom)))`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Search and account"
      >
        <div className="sia-navbar__siteMenuHeader">
          <span className="sia-navbar__siteMenuTitle">Site menu</span>
          <button
            type="button"
            className="sia-navbar__siteMenuClose"
            onClick={() => setSiteMenuOpen(false)}
            aria-label="Close site menu"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="sia-navbar__siteMenuBody">
          <div className="sia-navbar__search sia-navbar__search--menu" role="search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              className="sia-navbar__searchInput"
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
          <div className="sia-navbar__siteMenuActions">
            <button
              type="button"
              className={`sia-navbar__profile sia-navbar__profile--menu${profileOpen ? ' sia-navbar__profile--open' : ''}`}
              data-profile-trigger
              onClick={() => {
                toggleProfile?.()
                setSiteMenuOpen(false)
              }}
              aria-label="Profile"
              aria-pressed={profileOpen ? 'true' : 'false'}
              title="Profile"
            >
              <i className="bi bi-person-circle" aria-hidden="true" />
              <span className="sia-navbar__siteMenuActionLabel">Profile</span>
            </button>
            <a
              className="sia-navbar__signin sia-navbar__signin--menu"
              href="/signin"
              onClick={() => setSiteMenuOpen(false)}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </>
  ) : null

  if (isMobile) {
    return (
      <header className="sia-navbar sia-navbar--mobileCompact" role="banner">
        <div className="sia-navbar__mobileTopRow" ref={topRowRef}>
          <button
            type="button"
            className="sia-navbar__menuBtn sia-navbar__menuBtn--sidebar"
            onClick={() => openMobileNav?.()}
            aria-label="Open app navigation"
            aria-expanded={mobileNavOpen ? 'true' : 'false'}
            aria-controls="sia-app-sidebar"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>
          <div
            className="sia-navbar__brand sia-navbar__brand--mobileCenter"
            aria-label="Settling In Australia"
          >
            Settling In Australia
          </div>
          <button
            type="button"
            className={`sia-navbar__siteMenuBtn${siteMenuOpen ? ' sia-navbar__siteMenuBtn--open' : ''}`}
            onClick={() => setSiteMenuOpen((o) => !o)}
            aria-label="Open site menu"
            aria-expanded={siteMenuOpen ? 'true' : 'false'}
            aria-controls="sia-navbar-site-menu"
          >
            <i className="bi bi-three-dots-vertical" aria-hidden="true" />
          </button>
        </div>
        {siteMenuPanel}
      </header>
    )
  }

  return (
    <header className="sia-navbar" role="banner">
      <div className="sia-navbar__left">
        <button
          type="button"
          className="sia-navbar__menuBtn sia-navbar__menuBtn--sidebar"
          onClick={() => openMobileNav?.()}
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen ? 'true' : 'false'}
          aria-controls="sia-app-sidebar"
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>
        <div className="sia-navbar__brand" aria-label="Settling In Australia">
          Settling In Australia
        </div>
      </div>

      <div className="sia-navbar__center">
        <div className="sia-navbar__search" role="search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            className="sia-navbar__searchInput"
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="sia-navbar__right">
        <button
          type="button"
          className={`sia-navbar__profile${profileOpen ? ' sia-navbar__profile--open' : ''}`}
          data-profile-trigger
          onClick={() => toggleProfile?.()}
          aria-label="Profile"
          aria-pressed={profileOpen ? 'true' : 'false'}
          title="Profile"
        >
          <i className="bi bi-person-circle" aria-hidden="true" />
        </button>
        <a className="sia-navbar__signin" href="/signin">
          Sign in
        </a>
      </div>
    </header>
  )
}

export default NavBar
