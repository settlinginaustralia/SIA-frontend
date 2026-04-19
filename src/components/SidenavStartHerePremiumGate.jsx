import React from 'react'

/** Shown to free users: Start Here exists but path selection is premium-only */
function SidenavStartHerePremiumGate({ sidebarExpanded }) {
  return (
    <div
      className="sidebar-starthere-gate"
      data-sidebar-branch="start-here"
    >
      <a
        className="sidebar-nav-item sidebar-starthere-gate__link"
        href="/membership"
        title="View Membership pricing to unlock Start Here pathways"
      >
        <i className="bi bi-lock-fill sidebar-nav-item__icon" aria-hidden="true" />
        <span className="sidebar-nav-item__label">Start Here</span>
        {sidebarExpanded ? (
          <span className="sidebar-premium-badge ms-auto">Premium</span>
        ) : null}
      </a>
      {sidebarExpanded ? (
        <p className="sidebar-starthere-gate__hint">
          View Membership pricing to unlock path selection and guided pathways.
        </p>
      ) : null}
    </div>
  )
}

export default SidenavStartHerePremiumGate
