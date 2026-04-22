import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import '../styles/SiteFooter.css'

function SiteFooter() {
  const { t } = useLanguage()
  const year = useMemo(() => new Date().getFullYear(), [])

  const siteLinks = [
    { to: '/', labelKey: 'nav.home', end: true },
    { to: '/about', labelKey: 'nav.about' },
    { to: '/signin', labelKey: 'footer.signUp' },
    { to: '/community', labelKey: 'pages.communityTitle' },
  ]

  const productLinks = [
    { to: '/membership', labelKey: 'nav.membership' },
    { to: '/resources', labelKey: 'nav.resources' },
  ]

  const supportLinks = [
    { to: '/faq', labelKey: 'nav.faq' },
    { to: '/contact', labelKey: 'nav.contact' },
  ]

  return (
    <footer className="sia-footer" role="contentinfo">
      <div className="sia-footer__inner">
        <div className="sia-footer__top">
          <div className="sia-footer__brand">
            <span className="sia-footer__logoType">{t('navbar.brand')}</span>
            <p className="sia-footer__tagline">{t('footer.tagline')}</p>
          </div>
          <nav className="sia-footer__cols" aria-label={t('footer.navAria')}>
            <div>
              <h2 className="sia-footer__colTitle">{t('footer.colSite')}</h2>
              <ul className="sia-footer__list">
                {siteLinks.map(({ to, labelKey, end }) => (
                  <li key={to}>
                    <NavLink
                      className={({ isActive }) =>
                        `sia-footer__link${isActive ? ' sia-footer__link--active' : ''}`
                      }
                      to={to}
                      end={!!end}
                    >
                      {t(labelKey)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="sia-footer__colTitle">{t('footer.colProduct')}</h2>
              <ul className="sia-footer__list">
                {productLinks.map(({ to, labelKey }) => (
                  <li key={to}>
                    <NavLink
                      className={({ isActive }) =>
                        `sia-footer__link${isActive ? ' sia-footer__link--active' : ''}`
                      }
                      to={to}
                    >
                      {t(labelKey)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="sia-footer__colTitle">{t('footer.colSupport')}</h2>
              <ul className="sia-footer__list">
                {supportLinks.map(({ to, labelKey }) => (
                  <li key={to}>
                    <NavLink
                      className={({ isActive }) =>
                        `sia-footer__link${isActive ? ' sia-footer__link--active' : ''}`
                      }
                      to={to}
                    >
                      {t(labelKey)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <div className="sia-footer__bottom">
          <p className="sia-footer__copyright">
            {t('footer.copyright', { year })}
          </p>
          <div className="sia-footer__bottomActions">
            <NavLink
              className={({ isActive }) =>
                `sia-footer__signup${isActive ? ' sia-footer__signup--active' : ''}`
              }
              to="/signin"
            >
              {t('footer.signUp')}
            </NavLink>
            <div className="sia-footer__legal">
              <a
                className="sia-footer__legalLink"
                href="#privacy"
                title={t('footer.privacyHrefTitle')}
              >
                {t('footer.privacy')}
              </a>
              <span className="sia-footer__legalSep" aria-hidden="true">
                ·
              </span>
              <a
                className="sia-footer__legalLink"
                href="#terms"
                title={t('footer.termsHrefTitle')}
              >
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
