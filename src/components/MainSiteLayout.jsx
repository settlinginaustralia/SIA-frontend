import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import '../styles/MainSiteLayout.css'
import '../styles/SiaCard.css'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import NavBar from './NavBar'
import ProfilePanel from './ProfilePanel'
import SiteFooter from './SiteFooter'

const mainNavLinkDefs = [
  { labelKey: 'nav.home', to: '/', icon: 'bi-house' },
  { labelKey: 'nav.about', to: '/about', icon: 'bi-info-circle' },
  { labelKey: 'nav.membership', to: '/membership', icon: 'bi-credit-card' },
  { labelKey: 'nav.resources', to: '/resources', icon: 'bi-journal-text' },
  { labelKey: 'nav.faq', to: '/faq', icon: 'bi-question-circle' },
  { labelKey: 'nav.contact', to: '/contact', icon: 'bi-envelope' },
]

function MainSiteLayout() {
  const { t } = useLanguage()
  const { profileOpen, closeProfile, closeMobileNav } =
    useOutletContext() ?? {}
  const navbarRowRef = useRef(null)
  const subnavRef = useRef(null)
  const profileRailRef = useRef(null)
  const [navbarRowPx, setNavbarRowPx] = useState(64)
  const [subnavScrollHint, setSubnavScrollHint] = useState({
    overflow: false,
    left: false,
    right: false,
  })

  useLayoutEffect(() => {
    const el = navbarRowRef.current
    if (!el) return

    function measure() {
      setNavbarRowPx(Math.round(el.getBoundingClientRect().height))
    }

    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const updateSubnavScrollHint = useCallback(() => {
    const el = subnavRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 2) {
      setSubnavScrollHint({ overflow: false, left: false, right: false })
      return
    }
    const sl = el.scrollLeft
    setSubnavScrollHint({
      overflow: true,
      left: sl > 6,
      right: sl < maxScroll - 6,
    })
  }, [])

  const scrollSubnavBy = useCallback((direction) => {
    const el = subnavRef.current
    if (!el) return
    const amount = Math.max(140, Math.round(el.clientWidth * 0.55))
    el.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    })
  }, [])

  useLayoutEffect(() => {
    const el = subnavRef.current
    if (!el) return

    updateSubnavScrollHint()
    el.addEventListener('scroll', updateSubnavScrollHint, { passive: true })
    const ro = new ResizeObserver(() => updateSubnavScrollHint())
    ro.observe(el)
    window.addEventListener('resize', updateSubnavScrollHint)
    return () => {
      el.removeEventListener('scroll', updateSubnavScrollHint)
      ro.disconnect()
      window.removeEventListener('resize', updateSubnavScrollHint)
    }
  }, [updateSubnavScrollHint])

  useEffect(() => {
    if (!profileOpen || !closeProfile) return

    function handlePointerDown(event) {
      if (event.target.closest('[data-profile-trigger]')) return
      if (profileRailRef.current?.contains(event.target)) return
      closeProfile()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [profileOpen, closeProfile])

  useEffect(() => {
    if (profileOpen) closeMobileNav?.()
  }, [profileOpen, closeMobileNav])

  return (
    <div
      className="sia-home"
      style={{ ['--profile-rail-top']: `${navbarRowPx}px` }}
    >
      <div className="sia-home__stickyTop">
        <div className="sia-home__navbarRow" ref={navbarRowRef}>
          <NavBar />
        </div>
        <div className="sia-home__subnavWrap">
          <div className="sia-home__subnavStrip">
            <nav
              ref={subnavRef}
              className={`sia-home__subnav${
                subnavScrollHint.left ? ' sia-home__subnav--padStart' : ''
              }${subnavScrollHint.right ? ' sia-home__subnav--padEnd' : ''}`}
              aria-label={t('nav.siteSectionsAria')}
            >
              {mainNavLinkDefs.map(({ labelKey, to, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `sia-home__subnavLink${isActive ? ' sia-home__subnavLink--active' : ''}`
                  }
                >
                  <span className="sia-home__subnavIcon" aria-hidden="true">
                    <i className={`bi ${icon}`} />
                  </span>
                  <span className="sia-home__subnavLabel">{t(labelKey)}</span>
                </NavLink>
              ))}
            </nav>
            {subnavScrollHint.overflow && subnavScrollHint.left ? (
              <button
                type="button"
                className="sia-home__subnavScrollBtn sia-home__subnavScrollBtn--left"
                aria-label={t('nav.subnavScrollPrev')}
                onClick={() => scrollSubnavBy(-1)}
              >
                <i className="bi bi-chevron-left" aria-hidden="true" />
              </button>
            ) : null}
            {subnavScrollHint.overflow && subnavScrollHint.right ? (
              <button
                type="button"
                className="sia-home__subnavScrollBtn sia-home__subnavScrollBtn--right"
                aria-label={t('nav.subnavScrollNext')}
                onClick={() => scrollSubnavBy(1)}
              >
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {profileOpen ? <ProfilePanel ref={profileRailRef} /> : null}
      <main className="sia-home__main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default MainSiteLayout
