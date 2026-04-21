import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { pathSelectionLinks } from '../data/pathSelectionLinks'
import { studyPathSlides } from '../data/studyPathSlides'
import StudyPathPictureCarousel from './StudyPathPictureCarousel'
import '../styles/HomeHero.css'

function Home() {
  const { t } = useLanguage()

  return (
    <div className="sia-page sia-page--wide">
      <section className="sia-heroContent" aria-labelledby="home-intro-heading">
        <div className="sia-heroContent__inner">
          <h1 id="home-intro-heading" className="sia-hero__title">
            {t('home.title')}
          </h1>

          <p className="sia-hero__subtitle">{t('home.subtitle')}</p>

          <section
            className="sia-hero__brandScroller"
            aria-label={t('home.pathwaysAria')}
          >
            <ul className="sia-hero__brandTrack">
              {pathSelectionLinks.map((item) => (
                <li key={item.href}>
                  <Link className="sia-hero__brand" to={item.href}>
                    <i className={`sia-hero__brandIcon ${item.icon}`} aria-hidden="true" />
                    <span className="sia-hero__brandLabel">{t(item.labelKey)}</span>
                  </Link>
                </li>
              ))}
              {pathSelectionLinks.map((item) => (
                <li key={`${item.href}--marquee`} aria-hidden="true">
                  <Link
                    className="sia-hero__brand sia-hero__brand--marqueeDup"
                    to={item.href}
                    tabIndex={-1}
                  >
                    <i className={`sia-hero__brandIcon ${item.icon}`} aria-hidden="true" />
                    <span className="sia-hero__brandLabel">{t(item.labelKey)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <StudyPathPictureCarousel
            slides={studyPathSlides}
            label={t('home.carouselLabel')}
          />
        </div>
      </section>
    </div>
  )
}

export default Home
