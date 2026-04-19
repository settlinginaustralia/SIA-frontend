import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import '../styles/MainSiteLayout.css'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import NavBar from './NavBar'
import ProfilePanel from './ProfilePanel'

const mainNavLinks = [
  { label: 'Home', to: '/', icon: 'bi-house' },
  { label: 'About', to: '/about', icon: 'bi-info-circle' },
  { label: 'Membership (Pricing)', to: '/membership', icon: 'bi-credit-card' },
  { label: 'Resources / Blog', to: '/resources', icon: 'bi-journal-text' },
  { label: 'FAQ', to: '/faq', icon: 'bi-question-circle' },
  { label: 'Contact', to: '/contact', icon: 'bi-envelope' },
]

function MainSiteLayout() {
  const { profileOpen, closeProfile } = useOutletContext() ?? {}
  const navbarRowRef = useRef(null)
  const profileRailRef = useRef(null)
  const [navbarRowPx, setNavbarRowPx] = useState(64)

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

  return (
    <div
      className="sia-home"
      style={{ ['--profile-rail-top']: `${navbarRowPx}px` }}
    >
      <div className="sia-home__stickyTop">
        <div className="sia-home__navbarRow" ref={navbarRowRef}>
          <NavBar />
        </div>
        <nav className="sia-home__subnav" aria-label="Site sections">
          {mainNavLinks.map(({ label, to, icon }) => (
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
              <span className="sia-home__subnavLabel">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {profileOpen ? <ProfilePanel ref={profileRailRef} /> : null}
      <main className="sia-home__main">
        <Outlet />
      </main>
    </div>
  )
}

export default MainSiteLayout
