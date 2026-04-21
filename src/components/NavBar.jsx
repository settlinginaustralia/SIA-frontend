import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import '../styles/NavBar.css'
import { Link, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function readIsMobile() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 767.98px)').matches
}

function NavBar() {
  const { t } = useLanguage()
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
        aria-label={t('navbar.closeSiteMenu')}
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
        aria-label={t('navbar.siteMenuDialogAria')}
      >
        <div className="sia-navbar__siteMenuHeader">
          <span className="sia-navbar__siteMenuTitle">
            {t('navbar.siteMenuTitle')}
          </span>
          <button
            type="button"
            className="sia-navbar__siteMenuClose"
            onClick={() => setSiteMenuOpen(false)}
            aria-label={t('navbar.closeSiteMenu')}
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
              placeholder={t('navbar.searchPlaceholder')}
              aria-label={t('navbar.searchAria')}
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
              aria-label={t('navbar.profile')}
              aria-pressed={profileOpen ? 'true' : 'false'}
              title={t('navbar.profile')}
            >
              <i className="bi bi-person-circle" aria-hidden="true" />
              <span className="sia-navbar__siteMenuActionLabel">
                {t('navbar.profile')}
              </span>
            </button>
            <Link
              className="sia-navbar__signin sia-navbar__signin--menu"
              to="/signin"
              onClick={() => setSiteMenuOpen(false)}
            >
              <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
              {t('navbar.signIn')}
            </Link>
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
            aria-label={t('navbar.openAppNav')}
            aria-expanded={mobileNavOpen ? 'true' : 'false'}
            aria-controls="sia-app-sidebar"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>
          <div
            className="sia-navbar__brand sia-navbar__brand--mobileCenter"
            aria-label={t('navbar.brandAria')}
          >
            {t('navbar.brand')}
          </div>
          <button
            type="button"
            className={`sia-navbar__siteMenuBtn${siteMenuOpen ? ' sia-navbar__siteMenuBtn--open' : ''}`}
            onClick={() => setSiteMenuOpen((o) => !o)}
            aria-label={t('navbar.openSiteMenu')}
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
          aria-label={t('navbar.openNav')}
          aria-expanded={mobileNavOpen ? 'true' : 'false'}
          aria-controls="sia-app-sidebar"
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>
        <div className="sia-navbar__brand" aria-label={t('navbar.brandAria')}>
          {t('navbar.brand')}
        </div>
      </div>

      <div className="sia-navbar__center">
        <div className="sia-navbar__search" role="search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            className="sia-navbar__searchInput"
            type="search"
            placeholder={t('navbar.searchPlaceholder')}
            aria-label={t('navbar.searchAria')}
          />
        </div>
      </div>

      <div className="sia-navbar__right">
        <button
          type="button"
          className={`sia-navbar__profile${profileOpen ? ' sia-navbar__profile--open' : ''}`}
          data-profile-trigger
          onClick={() => toggleProfile?.()}
          aria-label={t('navbar.profile')}
          aria-pressed={profileOpen ? 'true' : 'false'}
          title={t('navbar.profile')}
        >
          <i className="bi bi-person-circle" aria-hidden="true" />
        </button>
        <Link className="sia-navbar__signin" to="/signin">
          <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
          {t('navbar.signIn')}
        </Link>
      </div>
    </header>
  )
}

export default NavBar
