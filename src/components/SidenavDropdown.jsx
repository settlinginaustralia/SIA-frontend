import React, { useEffect, useRef } from 'react'

function buildTutorialFilterHref(access, view) {
  const params = new URLSearchParams({ access, view })
  return `/tutorials?${params.toString()}`
}

function DropdownLinkContent({ icon, label }) {
  return (
    <>
      {icon ? (
        <i className={`sidebar-dropdown__linkIcon ${icon}`} aria-hidden="true" />
      ) : null}
      <span className="sidebar-dropdown__linkLabel">{label}</span>
    </>
  )
}

function SidenavDropdown({
  icon,
  text,
  items = [],
  filterGroups,
  isOpen,
  onToggle,
  sidebarExpanded,
  variant = 'default',
}) {
  const rootRef = useRef(null)
  const nested = variant === 'nested'
  const hasFilterGroups = Array.isArray(filterGroups) && filterGroups.length > 0

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        onToggle(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen, onToggle])

  return (
    <div
      ref={rootRef}
      className={`sidebar-dropdown${isOpen ? ' sidebar-dropdown--open' : ''}${
        nested ? ' sidebar-dropdown--nested' : ''
      }`}
    >
      <button
        type="button"
        className="sidebar-nav-item sidebar-dropdown__trigger w-100 border-0 bg-transparent text-white text-start"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => onToggle(!isOpen)}
      >
        <i className={`${icon} sidebar-nav-item__icon`} aria-hidden="true" />
        <span className="sidebar-nav-item__label">{text}</span>
        {sidebarExpanded ? (
          <i
            className="bi bi-chevron-down sidebar-dropdown__chevron ms-auto"
            aria-hidden="true"
          />
        ) : null}
      </button>

      <ul className="sidebar-dropdown__menu" role="menu">
        {hasFilterGroups
          ? filterGroups.map((group) => (
              <li
                key={group.title}
                className="sidebar-dropdown__group"
                role="presentation"
              >
                <div className="sidebar-dropdown__group-title">{group.title}</div>
                <ul
                  className="sidebar-dropdown__group-list"
                  role="group"
                  aria-label={`${group.title} tutorials`}
                >
                  {group.items.map((item) => (
                    <li key={`${group.access}-${item.view}`} role="none">
                      <a
                        className="sidebar-dropdown__link"
                        href={buildTutorialFilterHref(group.access, item.view)}
                        role="menuitem"
                      >
                        <DropdownLinkContent icon={item.icon} label={item.label} />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          : items.map((item, index) => (
              <li key={`${item.href}-${item.label}-${index}`} role="none">
                <a
                  className="sidebar-dropdown__link"
                  href={item.href}
                  role="menuitem"
                >
                  <DropdownLinkContent icon={item.icon} label={item.label} />
                </a>
              </li>
            ))}
      </ul>
    </div>
  )
}

export default SidenavDropdown
