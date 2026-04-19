import React from 'react'
import '../styles/NavBar.css'
import { useOutletContext } from 'react-router-dom'

function NavBar() {
  const { profileOpen, toggleProfile } = useOutletContext() ?? {}

  return (
    <header className="sia-navbar" role="banner">
      <div className="sia-navbar__left">
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