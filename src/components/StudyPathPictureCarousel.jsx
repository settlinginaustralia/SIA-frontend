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

/** Extra slides at the end so we can scroll forward forever, then jump back with no reverse animation. */
function buildTrackLayout(safeSlides, isWide) {
  const logicalCount = safeSlides.length
  if (!logicalCount) {
    return { trackSlides: [], logicalCount: 0, perView: 1, trackCount: 0, hasLoop: false }
  }
  const perView = isWide ? Math.min(3, logicalCount) : 1

  let trackSlides = safeSlides
  let hasLoop = false

  if (perView === 1) {
    if (logicalCount > 1) {
      trackSlides = [
        ...safeSlides,
        { ...safeSlides[0], id: `${safeSlides[0].id}--loop` },
      ]
      hasLoop = true
    }
  } else if (logicalCount > perView) {
    const clones = safeSlides.slice(0, perView).map((s, i) => ({
      ...s,
      id: `${s.id}--loop-${i}`,
    }))
    trackSlides = [...safeSlides, ...clones]
    hasLoop = true
  }

  const trackCount = trackSlides.length
  return { trackSlides, logicalCount, perView, trackCount, hasLoop }
}

function StudyPathPictureCarousel({ slides, label }) {
  const { t } = useLanguage()
  const resolvedLabel = label ?? t('home.carouselLabel')

  const safeSlides = useMemo(
    () => (Array.isArray(slides) ? slides.filter((s) => s && s.imageSrc) : []),
    [slides]
  )

  const [isWide, setIsWide] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const apply = () => setIsWide(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const { trackSlides, logicalCount, perView: layoutPerView, trackCount, hasLoop } = useMemo(
    () => buildTrackLayout(safeSlides, isWide),
    [safeSlides, isWide]
  )

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
    if (!viewport || !trackCount) {
      setMetrics({ perView: 1, slideWidth: 0, gap: 0, step: 0, maxStart: 0 })
      return
    }

    const perView = layoutPerView
    const gap = isWide ? 36 : 18

    const viewportWidth = viewport.clientWidth
    const slideWidth =
      perView > 0 ? (viewportWidth - gap * (perView - 1)) / perView : viewportWidth
    const step = slideWidth + gap
    const maxStart = Math.max(0, trackCount - perView)

    setMetrics({
      perView,
      slideWidth: Math.max(0, slideWidth),
      gap,
      step: Math.max(0, step),
      maxStart,
    })
  }, [trackCount, layoutPerView, isWide])

  const updateScrollHint = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxScroll = viewport.scrollWidth - viewport.clientWidth
    if (maxScroll <= 0) {
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

  /** When scrolled into the clone strip, snap back to the equivalent real position (no visible jump). */
  const normalizeLoopScroll = useCallback(
    (viewport, step, logicalLen, trackLen) => {
      if (!hasLoop || step <= 0 || trackLen <= logicalLen) return null
      const raw = viewport.scrollLeft / step
      const idx = Math.round(raw)
      if (idx < logicalLen) return idx
      const offset = idx - logicalLen
      const nextLeft = offset * step
      if (Math.abs(viewport.scrollLeft - nextLeft) > 2) {
        viewport.scrollTo({ left: nextLeft, behavior: 'auto' })
      }
      return offset
    },
    [hasLoop]
  )

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
      const { step, maxStart } = metrics
      const viewport = viewportRef.current
      if (!viewport || !step) return

      if (direction > 0 && hasLoop && startIndex === maxStart) {
        viewport.scrollTo({ left: 0, behavior: 'auto' })
        setStartIndex(0)
        return
      }

      scrollToStartIndex(startIndex + direction, 'smooth')
    },
    [hasLoop, metrics, scrollToStartIndex, startIndex]
  )

  const handleViewportKeyDown = useCallback(
    (event) => {
      if (!logicalCount) return
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
        const { maxStart, perView } = metrics
        const endIdx =
          hasLoop && perView > 1
            ? Math.max(0, logicalCount - perView)
            : hasLoop && perView === 1
              ? logicalCount - 1
              : maxStart
        scrollToStartIndex(endIdx, reduceMotionRef.current ? 'auto' : 'smooth')
      }
    },
    [hasLoop, logicalCount, metrics, scrollToStartIndex, stepBy]
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
  }, [trackCount, updateMetrics])

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
  }, [metrics.maxStart, metrics.step, trackCount])

  /** Always advance forward; at clone window jump to real start with no reverse scroll. */
  useEffect(() => {
    if (!trackCount) return
    if (reduceMotionRef.current) return
    if (paused) return
    if (!metrics.step) return

    const { perView, maxStart } = metrics
    const canPan = perView === 1 || maxStart > 0
    if (!canPan) return

    const stepPx = metrics.step

    const id = window.setInterval(() => {
      setStartIndex((prev) => {
        const viewport = viewportRef.current
        if (!viewport) return prev

        if (hasLoop && prev === maxStart) {
          viewport.scrollTo({ left: 0, behavior: 'auto' })
          return 0
        }

        const nextStart = prev + 1
        if (nextStart > maxStart) return prev

        viewport.scrollTo({
          left: nextStart * stepPx,
          behavior: 'smooth',
        })
        return nextStart
      })
    }, 4200)

    return () => window.clearInterval(id)
  }, [hasLoop, metrics.maxStart, metrics.perView, metrics.step, paused, trackCount])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    function onScroll() {
      if (!metrics.step) return
      const normalized = normalizeLoopScroll(
        viewport,
        metrics.step,
        logicalCount,
        trackCount
      )
      const raw = viewport.scrollLeft / metrics.step
      const nextStart =
        normalized != null ? normalized : Math.round(raw)
      setStartIndex(clamp(nextStart, 0, metrics.maxStart))
      updateScrollHint()
    }

    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => viewport.removeEventListener('scroll', onScroll)
  }, [
    logicalCount,
    metrics.maxStart,
    metrics.step,
    normalizeLoopScroll,
    trackCount,
    updateScrollHint,
  ])

  if (!logicalCount) return null

  const logicalVisible = Array.from({ length: metrics.perView }, (_, i) => {
    const ti = startIndex + i
    if (ti < logicalCount) return ti + 1
    return ti - logicalCount + 1
  })
  const first = Math.min(...logicalVisible)
  const last = Math.max(...logicalVisible)

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
        {t('home.carouselStatus', { first, last, count: logicalCount })}
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
            {trackSlides.map((slide) => (
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
              aria-label={t('home.carouselNavPrev')}
              onClick={() => stepBy(-1)}
            >
              <i className="bi bi-chevron-left" aria-hidden="true" />
            </button>
          ) : null}

          {metrics.perView > 1 && scrollHint.overflow && scrollHint.right ? (
            <button
              type="button"
              className="sia-studyPix__navBtn sia-studyPix__navBtn--right"
              aria-label={t('home.carouselNavNext')}
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
