import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import '../styles/StudyPathPictureCarousel.css'
import { useLanguage } from '../context/LanguageContext'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function StudyPathPictureCarousel({ slides, label }) {
  const { t } = useLanguage()
  const resolvedLabel = label ?? t('home.carouselLabel')

  const safeSlides = useMemo(
    () => (Array.isArray(slides) ? slides.filter((s) => s && s.imageSrc) : []),
    [slides]
  )
  const count = safeSlides.length

  const viewportRef = useRef(null)
  const reduceMotionRef = useRef(prefersReducedMotion())

  const [startIndex, setStartIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const [metrics, setMetrics] = useState({
    perView: 1,
    slideWidth: 0,
    gap: 0,
    step: 0,
    maxStart: 0,
  })

  const [scrollHint, setScrollHint] = useState({
    overflow: false,
    left: false,
    right: false,
  })

  const updateMetrics = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport || !count) {
      setMetrics({ perView: 1, slideWidth: 0, gap: 0, step: 0, maxStart: 0 })
      return
    }

    const isDesktop = window.matchMedia('(min-width: 900px)').matches
    const perView = isDesktop ? Math.min(3, count) : 1
    const gap = isDesktop ? 36 : 18

    const viewportWidth = viewport.clientWidth
    const slideWidth =
      perView > 0 ? (viewportWidth - gap * (perView - 1)) / perView : viewportWidth
    const step = slideWidth + gap
    const maxStart = Math.max(0, count - perView)

    setMetrics({ perView, slideWidth: Math.max(0, slideWidth), gap, step: Math.max(0, step), maxStart })
  }, [count])

  const updateScrollHint = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxScroll = viewport.scrollWidth - viewport.clientWidth
    if (maxScroll <= 2) {
      setScrollHint({ overflow: false, left: false, right: false })
      return
    }

    const sl = viewport.scrollLeft
    setScrollHint({
      overflow: true,
      left: sl > 6,
      right: sl < maxScroll - 6,
    })
  }, [])

  const scrollToStartIndex = useCallback(
    (nextStart, behavior) => {
      const viewport = viewportRef.current
      if (!viewport) return

      const { step, maxStart } = metrics
      if (!step) return

      const start = clamp(nextStart, 0, maxStart)
      setStartIndex(start)

      const prefersAuto = reduceMotionRef.current ? 'auto' : behavior
      viewport.scrollTo({ left: start * step, behavior: prefersAuto })
    },
    [metrics]
  )

  const stepBy = useCallback(
    (direction) => {
      scrollToStartIndex(startIndex + direction, 'smooth')
    },
    [scrollToStartIndex, startIndex]
  )

  const handleViewportKeyDown = useCallback(
    (event) => {
      if (!count) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        stepBy(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        stepBy(-1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        scrollToStartIndex(0, reduceMotionRef.current ? 'auto' : 'smooth')
      } else if (event.key === 'End') {
        event.preventDefault()
        scrollToStartIndex(metrics.maxStart, reduceMotionRef.current ? 'auto' : 'smooth')
      }
    },
    [count, metrics.maxStart, scrollToStartIndex, stepBy]
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      reduceMotionRef.current = mq.matches
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    updateMetrics()
  }, [count, updateMetrics])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    updateScrollHint()

    const ro = new ResizeObserver(() => {
      updateMetrics()
      updateScrollHint()
    })
    ro.observe(viewport)

    window.addEventListener('resize', updateMetrics)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateMetrics)
    }
  }, [updateMetrics, updateScrollHint])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    if (!metrics.step) return

    setStartIndex((prev) => {
      const start = clamp(prev, 0, metrics.maxStart)
      viewport.scrollTo({ left: start * metrics.step, behavior: 'auto' })
      return start
    })
  }, [metrics.maxStart, metrics.step, count])

  useEffect(() => {
    if (!count) return
    if (reduceMotionRef.current) return
    if (paused) return
    if (metrics.perView !== 1) return

    const id = window.setInterval(() => {
      setStartIndex((prev) => {
        const nextStart = (prev + 1) % count
        const viewport = viewportRef.current
        if (viewport && metrics.step) {
          viewport.scrollTo({
            left: nextStart * metrics.step,
            behavior: 'smooth',
          })
        }
        return nextStart
      })
    }, 4200)

    return () => window.clearInterval(id)
  }, [count, metrics.perView, metrics.step, paused])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    function onScroll() {
      if (!metrics.step) return
      const nextStart = Math.round(viewport.scrollLeft / metrics.step)
      setStartIndex(clamp(nextStart, 0, metrics.maxStart))
      updateScrollHint()
    }

    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => viewport.removeEventListener('scroll', onScroll)
  }, [metrics.maxStart, metrics.step, updateScrollHint])

  if (!count) return null

  const first = startIndex + 1
  const last = clamp(startIndex + metrics.perView, 1, count)

  const slideLayoutStyle =
    metrics.slideWidth > 0
      ? { flex: `0 0 ${metrics.slideWidth}px`, width: `${metrics.slideWidth}px` }
      : metrics.perView > 1
        ? { flex: `0 0 calc((100% - ${metrics.gap * (metrics.perView - 1)}px) / ${metrics.perView})` }
        : undefined

  return (
    <section
      className="sia-studyPix"
      aria-roledescription="carousel"
      aria-label={resolvedLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <p className="sia-studyPix__status" aria-live="polite">
        {t('home.carouselStatus', { first, last, count })}
      </p>

      <div className="sia-studyPix__frame">
        <div className="sia-studyPix__strip">
          <div
            ref={viewportRef}
            className={`sia-studyPix__viewport${
              metrics.perView > 1 && scrollHint.overflow && scrollHint.left
                ? ' sia-studyPix__viewport--padStart'
                : ''
            }${
              metrics.perView > 1 && scrollHint.overflow && scrollHint.right
                ? ' sia-studyPix__viewport--padEnd'
                : ''
            }`}
            tabIndex={0}
            onKeyDown={handleViewportKeyDown}
          >
            {safeSlides.map((slide) => (
              <div key={slide.id} className="sia-studyPix__slide" style={slideLayoutStyle}>
                <div className="sia-studyPix__tile">
                  <img
                    className="sia-studyPix__img"
                    src={slide.imageSrc}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  {slide.caption ? (
                    <p className="sia-studyPix__caption">{slide.caption}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {metrics.perView > 1 && scrollHint.overflow && scrollHint.left ? (
            <button
              type="button"
              className="sia-studyPix__navBtn sia-studyPix__navBtn--left"
              aria-label="Show previous pictures"
              onClick={() => stepBy(-1)}
            >
              <i className="bi bi-chevron-left" aria-hidden="true" />
            </button>
          ) : null}

          {metrics.perView > 1 && scrollHint.overflow && scrollHint.right ? (
            <button
              type="button"
              className="sia-studyPix__navBtn sia-studyPix__navBtn--right"
              aria-label="Show more pictures"
              onClick={() => stepBy(1)}
            >
              <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

    </section>
  )
}

export default StudyPathPictureCarousel
