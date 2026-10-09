import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import MomentLightbox from '../components/MomentLightbox'
import SiteFooter from '../components/SiteFooter'
import { visits } from '../content/archive'
import { formattedTripDate, LanguageToggle, localizedPlace, localizedRegion, localizedTripTitle, useLanguage } from '../content/language'
import type { Moment } from '../types/archive'

type TripPhotoLayout = 'full' | 'wide' | 'half' | 'third'

function getTripPhotoLayout(count: number): TripPhotoLayout[] {
  const layout: TripPhotoLayout[] = []
  let remaining = count

  while (remaining > 0) {
    if (remaining === 1) {
      layout.push('full')
      break
    }
    if (remaining === 2) {
      layout.push('wide', 'half')
      break
    }
    if (remaining === 3) {
      layout.push('third', 'third', 'third')
      break
    }
    if (remaining === 4) {
      layout.push('wide', 'half', 'wide', 'half')
      break
    }

    layout.push('wide', 'half', 'third', 'third', 'third')
    remaining -= 5
  }

  return layout
}

export default function TripDetailPage() {
  const { language, t } = useLanguage()
  const { tripId } = useParams()
  const location = useLocation()
  const visit = visits.find((item) => item.id === tripId)
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null)
  const place = visit ? localizedPlace(visit.place, language) : ''
  const region = visit ? localizedRegion(visit.region, language) : ''
  const title = visit ? localizedTripTitle(visit.place, language) : ''
  const date = visit ? formattedTripDate(visit.id, language, visit.date) : ''
  const photoMoments: Moment[] = visit
    ? visit.images.map((image, index) => ({
      src: image,
      alt: t.imageNumber(index + 1, place),
      place,
      date,
    }))
    : []
  const photoLayout = getTripPhotoLayout(visit?.images.length ?? 0)

  useEffect(() => {
    document.title = visit ? `${place} — ${title} | ${t.documentTitle.split('|')[0].trim()}` : `${t.allTrips} | ${t.documentTitle.split('|')[0].trim()}`
  }, [place, t.allTrips, t.documentTitle, title, visit])

  const returnState = location.state?.fromTrip ? undefined : { fromTrip: true, scrollToHash: '#album' }

  if (!visit) {
    return (
      <div className="site-shell trip-page">
        <header className="trip-topbar">
          <Link className="wordmark" to="/#top" aria-label={t.homeLinkDetail}>
            <span className="wordmark-symbol" aria-hidden="true">d.</span>
            <span>Dấu Chân<small>{t.brandSubtitle}</small></span>
          </Link>
          <LanguageToggle />
        </header>
        <main className="trip-not-found">
          <p className="eyebrow">{t.missingTrip}</p>
          <h1>{t.missingAlbum}</h1>
          <Link className="hero-link" to="/#album">{t.backToAlbum} <span aria-hidden="true">←</span></Link>
        </main>
        <SiteFooter detail />
      </div>
    )
  }

  return (
    <div className="site-shell trip-page">
      <header className="trip-topbar">
        <Link className="wordmark" to="/#top" aria-label={t.homeLinkDetail}>
          <span className="wordmark-symbol" aria-hidden="true">d.</span>
          <span>Dấu Chân<small>{t.brandSubtitle}</small></span>
        </Link>
        <div className="trip-topbar-actions">
          <LanguageToggle />
          <Link className="trip-topbar-back" to="/" state={returnState}>{t.allTrips} <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <main className="trip-detail" id="trip-detail">
        <nav className="trip-breadcrumb" aria-label={t.breadcrumb}>
          <Link to="/" state={returnState}>{t.album}</Link><span aria-hidden="true">/</span><span>{place}</span>
        </nav>
        <section className="trip-intro" aria-labelledby="trip-title">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✳</span> {region.toLocaleUpperCase(language === 'vi' ? 'vi-VN' : 'en-US')} · {visit.year}</p>
            <h1 id="trip-title">{title}</h1>
            <p className="trip-note">{language === 'vi' ? visit.note : t.photoFromTrip(place, date)}</p>
          </div>
          <div className="trip-facts" aria-label={t.tripFacts}>
            <div><span>{t.placeLabel}</span><strong>{place}</strong></div>
            <div><span>{t.duration}</span><strong>{date}</strong></div>
            <div><span>{t.inAlbum}</span><strong>{t.mediaCount(visit.images.length, visit.videos)}</strong></div>
          </div>
        </section>

        <figure className="trip-cover">
          <img src={visit.cover} alt={`${place}: ${title}`} fetchPriority="high" />
          <figcaption><span>{place}</span><span>{date}</span></figcaption>
        </figure>

        <section className="trip-gallery-section" aria-labelledby="trip-gallery-title">
          <div className="trip-gallery-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✳</span> {t.albumPhotos}</p>
              <h2 id="trip-gallery-title">{t.daysIn(place)}</h2>
            </div>
            <p>{t.photoCountText(visit.images.length)}</p>
          </div>
          <div className="trip-photo-grid">
            {visit.images.map((image, index) => (
              <button className={`trip-photo trip-photo-${photoLayout[index]}`} key={image} onClick={() => setSelectedMoment(index)} type="button" aria-label={t.openPhoto(index + 1, place)}>
                <img src={image} alt={t.photoAlt(place, index + 1)} loading="lazy" />
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter detail />
      <MomentLightbox moments={photoMoments} activeIndex={selectedMoment} onChange={setSelectedMoment} onClose={() => setSelectedMoment(null)} />
    </div>
  )
}
