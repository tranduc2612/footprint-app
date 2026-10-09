import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import AlbumCard from '../components/AlbumCard'
import MomentLightbox from '../components/MomentLightbox'
import PlacesMap from '../components/PlacesMap'
import SiteFooter from '../components/SiteFooter'
import { archive, moments, places, visits, years } from '../content/archive'
import { formattedMonthYear, LanguageToggle, localizedMomentAlt, localizedPlace, localizedRegion, useLanguage } from '../content/language'

export default function HomePage() {
  const { language, t } = useLanguage()
  const [activePlace, setActivePlace] = useState('all')
  const [activeYear, setActiveYear] = useState('all')
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => {
    const initialHash = window.location.hash.replace(/^#/, '')
    return initialHash === 'album-toolbar' ? 'album' : initialHash || 'top'
  })
  const [activeMoment, setActiveMoment] = useState(0)
  const [isDraggingMoments, setIsDraggingMoments] = useState(false)
  const momentsTrackRef = useRef<HTMLDivElement>(null)
  const momentDragRef = useRef<{ startX: number; startScrollLeft: number; pointerId: number; moved: boolean } | null>(null)
  const suppressMomentClickRef = useRef(false)

  const filteredVisits = useMemo(
    () => visits.filter((visit) =>
      (activePlace === 'all' || visit.place === activePlace)
      && (activeYear === 'all' || visit.year === Number(activeYear)),
    ),
    [activePlace, activeYear],
  )

  useEffect(() => {
    document.title = t.documentTitle
  }, [t.documentTitle])

  const localizedMoments = useMemo(() => moments.map((moment) => ({
    ...moment,
    place: localizedPlace(moment.place, language),
    date: formattedMonthYear(moment.date, language),
    alt: localizedMomentAlt(moment.alt, language),
  })), [language])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [menuOpen])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')

    if (motionQuery.matches || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    document.documentElement.classList.add('motion-ready')
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' })

    targets.forEach((target) => revealObserver.observe(target))
    return () => {
      revealObserver.disconnect()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [activePlace, activeYear])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('#top, #album, #places, #moments'))
    if (!('IntersectionObserver' in window)) return

    const syncActiveSection = () => {
      const markerY = window.innerHeight * 0.37
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= markerY && bounds.bottom > markerY
      }) ?? [...sections].reverse().find((section) => section.getBoundingClientRect().top <= markerY)

      if (current) setActiveSection(current.id || 'top')
    }
    const sectionObserver = new IntersectionObserver(syncActiveSection, { threshold: 0, rootMargin: '-32% 0px -58% 0px' })

    sections.forEach((section) => sectionObserver.observe(section))
    const initialSyncFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(syncActiveSection)
    })
    return () => {
      window.cancelAnimationFrame(initialSyncFrame)
      sectionObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const track = momentsTrackRef.current
    if (!track || !('IntersectionObserver' in window)) return

    const slides = track.querySelectorAll<HTMLElement>('.moment')
    const slideObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveMoment(Number((current.target as HTMLElement).dataset.slideIndex))
    }, { root: track, threshold: [0.55, 0.75] })

    slides.forEach((slide) => slideObserver.observe(slide))
    return () => slideObserver.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToMoment = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(index, moments.length - 1))
    const track = momentsTrackRef.current
    const slide = track?.children.item(boundedIndex)
    if (track && slide) {
      const left = track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left
      track.scrollTo({ left, behavior: 'smooth' })
    }
    setActiveMoment(boundedIndex)
  }

  const startMomentDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    momentDragRef.current = {
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      pointerId: event.pointerId,
      moved: false,
    }
  }

  const moveMomentDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = momentDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const distance = event.clientX - drag.startX
    if (!drag.moved && Math.abs(distance) > 6) {
      drag.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setIsDraggingMoments(true)
    }
    if (drag.moved) {
      event.preventDefault()
      event.currentTarget.scrollLeft = drag.startScrollLeft - distance
    }
  }

  const endMomentDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = momentDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    if (drag.moved) {
      suppressMomentClickRef.current = true
      window.setTimeout(() => { suppressMomentClickRef.current = false }, 0)
    }
    momentDragRef.current = null
    setIsDraggingMoments(false)
  }

  return (
    <div className={`site-shell ${menuOpen ? 'menu-is-open' : ''}`}>
      <a className="skip-link" href="#album">{t.skipNavigation}</a>
      <aside className="side-dock" aria-label={t.quickNavigation}>
        <a className="dock-link" href="#top" aria-label={t.home} title={t.home} aria-current={activeSection === 'top' ? 'page' : undefined}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3.5 10 8.5-7 8.5 7" /><path d="M5.5 9v11h13V9M9.5 20v-6h5v6" /></svg>
        </a>
        <a className="dock-link" href="#album" aria-label="Album" title="Album" aria-current={activeSection === 'album' ? 'page' : undefined}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="16" rx="2" /><path d="M8 3.5v16M9 8h7M9 11h7M9 14h4" /></svg>
        </a>
        <a className="dock-link" href="#places" aria-label={t.map} title={t.map} aria-current={activeSection === 'places' ? 'page' : undefined}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 6 5.5-2 7 2 5.5-2v14l-5.5 2-7-2L3 20z" /><path d="M8.5 4v14M15.5 6v14" /><path d="M11 10.5a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z" /><path d="m11.6 12 1.4 2 1.4-2" /></svg>
        </a>
        <a className="dock-link" href="#moments" aria-label={t.moments} title={t.moments} aria-current={activeSection === 'moments' ? 'page' : undefined}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7.5h3l1.4-2h7.2l1.4 2h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-16A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z" /><circle cx="12" cy="13" r="3.5" /></svg>
        </a>
      </aside>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label={t.homeLink}>
          <span className="wordmark-symbol" aria-hidden="true">d.</span>
          <span>Dấu Chân<small>{t.brandSubtitle}</small></span>
        </a>
        <div className="topbar-actions">
          <LanguageToggle />
          <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen((open) => !open)} type="button" aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? t.closeMenu : t.openMenu}>
            <span /><span />
          </button>
        </div>
      </header>
      <nav className={`site-menu ${menuOpen ? 'is-open' : ''}`} id="site-menu" aria-label={t.mainNavigation} aria-hidden={!menuOpen} inert={!menuOpen}>
        <h2>{t.contents}</h2>
        <a href="#album" onClick={() => scrollTo('album')}>{t.album}</a>
        <a href="#places" onClick={() => scrollTo('places')}>{language === 'en' ? 'Places' : 'Địa điểm'}</a>
        <a href="#moments" onClick={() => scrollTo('moments')}>{t.moments}</a>
      </nav>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy" data-reveal="left">
            <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✳</span> {t.heroEyebrow}</p>
            <h1 id="hero-title">{t.heroTitleStart}<br />{language === 'en' ? '' : 'đi '}<em>{t.heroTitleEnd}</em></h1>
            <p className="hero-description">{t.heroDescription}</p>
            <button className="hero-link" onClick={() => scrollTo('album')} type="button">
              {t.browseAlbum} <span aria-hidden="true">↓</span>
            </button>
          </div>
          <div className="hero-art" aria-label={t.heroImage} data-reveal="right">
            <figure className="hero-photo hero-photo-main">
              <div className="hero-photo-image">
                <img src={archive.heroImage} alt={t.heroImageAlt} fetchPriority="high" />
              </div>
            </figure>
          </div>
        </section>

        <section className="overview-strip" aria-label={t.overview} data-reveal>
          <div><strong>{archive.stats.places}</strong><span>{t.placesCount}</span></div>
          <div><strong>{archive.stats.trips}</strong><span>{t.tripsCount}</span></div>
          <div><strong>{archive.stats.moments.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</strong><span>{t.memoriesCount}</span></div>
        </section>

        <section className="album-section section-wrap" id="album" aria-labelledby="album-title">
          <div className="section-heading" data-reveal="left">
            <div>
              <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✳</span> {t.albumEyebrow}</p>
              <h2 id="album-title">{t.albumTitleStart}<br />{language === 'en' ? '' : 'một '}<em>{t.albumTitleEnd}</em></h2>
            </div>
            <p className="section-intro">{t.albumDescription}</p>
          </div>

          <div className="album-toolbar" id="album-toolbar">
            <div className="filter-group">
              <label htmlFor="place-filter">{t.placeLabel}</label>
              <select id="place-filter" value={activePlace} onChange={(event) => setActivePlace(event.target.value)}>
                <option value="all">{t.allPlaces}</option>
                {places.map((place) => <option key={place.name} value={place.name}>{localizedPlace(place.name, language)}</option>)}
              </select>
              <label htmlFor="year-filter">{t.yearLabel}</label>
              <select id="year-filter" value={activeYear} onChange={(event) => setActiveYear(event.target.value)}>
                <option value="all">{t.allYears}</option>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <p className="album-result"><span>{String(filteredVisits.length).padStart(2, '0')}</span> {t.tripCountSuffix}</p>
          </div>

          {filteredVisits.length > 0 ? (
            <div className="album-grid">
              {filteredVisits.map((visit, index) => <AlbumCard key={visit.id} visit={visit} index={index} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>{t.emptyTitle}</h3>
              <p>{t.emptyDescription}</p>
            </div>
          )}
        </section>

        <section className="places-section section-wrap" id="places" aria-labelledby="places-title">
          <div className="places-heading" data-reveal="left">
            <h2 id="places-title">{t.placesTitleStart}<br />{language === 'en' ? '' : 'của '}<em>{t.placesTitleEnd}</em></h2>
          </div>
          <PlacesMap
            places={places}
            selectedPlace={activePlace}
            onSelectPlace={(place) => { setActivePlace(place); scrollTo('album-toolbar') }}
          />
          <div className="place-list">
            {places.map((place, index) => (
              <button className={`place-row ${activePlace === place.name ? 'is-selected' : ''}`} data-reveal key={place.name} type="button" onClick={() => { setActivePlace(place.name); scrollTo('album-toolbar') }} aria-pressed={activePlace === place.name}>
                <span className="place-index">0{index + 1}</span>
                <span className="place-name">{localizedPlace(place.name, language)}</span>
                <span className="place-region">{localizedRegion(place.region, language)}</span>
                <span className="place-visits">{t.visitsCount(place.visits)}</span>
                <span className="place-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="moments-section section-wrap" id="moments" aria-labelledby="moments-title">
          <div className="moments-heading" data-reveal="left">
            <div>
              <h2 id="moments-title">{t.momentsTitleStart}<br />{t.momentsTitleMiddle} <em>{t.momentsTitleEnd}</em></h2>
            </div>
            <p className="section-intro">{t.momentsDescription}</p>
            <div className="moment-slider-controls" aria-label={t.momentControls}>
              <span className="moment-count"><strong>{String(activeMoment + 1).padStart(2, '0')}</strong> / {String(moments.length).padStart(2, '0')}</span>
              <button className="moment-arrow" onClick={() => scrollToMoment(activeMoment - 1)} type="button" aria-label={t.previousMoment} disabled={activeMoment === 0}>
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button className="moment-arrow" onClick={() => scrollToMoment(activeMoment + 1)} type="button" aria-label={t.nextMoment} disabled={activeMoment === moments.length - 1}>
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
          <div
            className={`moments-gallery ${isDraggingMoments ? 'is-dragging' : ''}`}
            ref={momentsTrackRef}
            aria-label={t.momentSlider}
            onPointerDown={startMomentDrag}
            onPointerMove={moveMomentDrag}
            onPointerUp={endMomentDrag}
            onPointerCancel={endMomentDrag}
          >
            {localizedMoments.map((image, index) => (
              <button className="moment" data-reveal data-slide-index={index} key={image.src} onClick={(event) => {
                if (suppressMomentClickRef.current) {
                  event.preventDefault()
                  return
                }
                setSelectedMoment(index)
              }} type="button" aria-label={t.viewPhotoAt(image.place)}>
                <img src={image.src} alt={image.alt} loading="lazy" draggable={false} />
                <span className="moment-shade" />
                <span className="moment-caption"><span>{image.place}</span><span>{image.date}</span></span>
                <span className="moment-zoom" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="moment-pagination" aria-label={t.selectMoment}>
            {localizedMoments.map((image, index) => (
              <button className={`moment-dot ${activeMoment === index ? 'is-active' : ''}`} key={image.src} onClick={() => scrollToMoment(index)} type="button" aria-label={t.goToMoment(index + 1, image.place)} aria-current={activeMoment === index ? 'true' : undefined} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      <MomentLightbox moments={localizedMoments} activeIndex={selectedMoment} onChange={setSelectedMoment} onClose={() => setSelectedMoment(null)} />
    </div>
  )
}
