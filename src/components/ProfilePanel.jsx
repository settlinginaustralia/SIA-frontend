import React, { forwardRef } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'
import '../styles/ProfilePanel.css'

const defaultUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
}

const ProfilePanel = forwardRef(function ProfilePanel({ user = defaultUser }, ref) {
  const { tier } = useAccessTier()
  const { closeProfile, openNotifications } = useOutletContext() ?? {}
  const isPremium = tier === 'premium'
  const displayName = user?.name ?? defaultUser.name
  const displayEmail = user?.email ?? defaultUser.email

  return (
    <aside
      ref={ref}
      className="main-profile-rail side-bg"
      aria-label="Profile"
    >
      <div className="main-profile-rail__user" role="group" aria-label="Signed-in user">
        <div className="main-profile-rail__userAvatar" aria-hidden="true">
          <i className="bi bi-person-fill" />
        </div>
        <div className="main-profile-rail__userMeta">
          <p className="main-profile-rail__userName">{displayName}</p>
          <p className="main-profile-rail__userEmail">{displayEmail}</p>
        </div>
      </div>
      <section
        className="main-profile-rail__planBilling"
        aria-labelledby="profile-plan-billing-heading"
      >
        <h3
          id="profile-plan-billing-heading"
          className="main-profile-rail__planBillingTitle"
        >
          Plan & billing
        </h3>
        <div className="main-profile-rail__planRow">
          <span className="main-profile-rail__planLabel">Status</span>
          <span
            className={`main-profile-rail__planBadge main-profile-rail__planBadge--${tier}`}
          >
            {isPremium ? 'Premium' : 'Free'}
          </span>
        </div>
      </section>
      <div className="main-profile-rail__upgrade">
        {isPremium ? (
          <Link
            to="/membership"
            className="main-profile-rail__billingBtn"
            onClick={() => closeProfile?.()}
          >
            Manage plan & billing
          </Link>
        ) : (
          <Link
            to="/membership"
            className="main-profile-rail__upgradeBtn"
            onClick={() => closeProfile?.()}
          >
            Upgrade to Premium
          </Link>
        )}
      </div>
      <div className="main-profile-rail__body">
        <nav
          className="main-profile-rail__menu"
          aria-label="Account actions"
        >
          <ul className="main-profile-rail__menuList">
          <li>
            <Link
              to="/community"
              className="main-profile-rail__menuRow"
              onClick={() => closeProfile?.()}
            >
              <i
                className="bi bi-people main-profile-rail__menuIcon"
                aria-hidden="true"
              />
              <span>Community</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="main-profile-rail__menuRow"
              onClick={() => {
                openNotifications?.()
                closeProfile?.()
              }}
            >
              <i
                className="bi bi-bell main-profile-rail__menuIcon"
                aria-hidden="true"
              />
              <span>Notifications</span>
            </button>
          </li>
          <li>
            <Link
              to="/settings"
              className="main-profile-rail__menuRow"
              onClick={() => closeProfile?.()}
            >
              <i
                className="bi bi-gear main-profile-rail__menuIcon"
                aria-hidden="true"
              />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/faq"
              className="main-profile-rail__menuRow"
              onClick={() => closeProfile?.()}
            >
              <i
                className="bi bi-question-circle main-profile-rail__menuIcon"
                aria-hidden="true"
              />
              <span>Help</span>
            </Link>
          </li>
          <li className="main-profile-rail__menuItem--logout">
            <button
              type="button"
              className="main-profile-rail__menuRow main-profile-rail__menuRow--logout"
              onClick={() => closeProfile?.()}
            >
              <i
                className="bi bi-box-arrow-right main-profile-rail__menuIcon"
                aria-hidden="true"
              />
              <span>Logout</span>
            </button>
          </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
})

export default ProfilePanel
