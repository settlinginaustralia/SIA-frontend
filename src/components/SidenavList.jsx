import React from 'react'

function SidenavList({icon, text, href}) {
  return (
    <div>
        <a className="sidebar-nav-item" href={href}>
          <i
            className={`${icon} sidebar-nav-item__icon`}
            aria-hidden="true"
          />
          <span className="sidebar-nav-item__label">{text}</span>

        </a>
    </div>
  )
}

export default SidenavList