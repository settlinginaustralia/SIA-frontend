import React from 'react'
import { Link } from 'react-router-dom'

function SidenavList({ icon, text, href }) {
  return (
    <div>
      <Link className="sidebar-nav-item" to={href}>
        <i className={`${icon} sidebar-nav-item__icon`} aria-hidden="true" />
        <span className="sidebar-nav-item__label">{text}</span>
      </Link>
    </div>
  )
}

export default SidenavList