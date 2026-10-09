import { Link } from 'react-router-dom'
import { formattedTripDate, localizedPlace, localizedRegion, localizedTripTitle, useLanguage } from '../content/language'
import type { Visit } from '../types/archive'

type AlbumCardProps = {
  visit: Visit
  index: number
}

export default function AlbumCard({ visit, index }: AlbumCardProps) {
  const { language, t } = useLanguage()
  const place = localizedPlace(visit.place, language)
  const title = localizedTripTitle(visit.place, language)
  const date = formattedTripDate(visit.id, language, visit.date)

  const rememberScrollPosition = () => {
    window.sessionStorage.setItem('tripReturnScrollY', String(window.scrollY))
  }

  return (
    <article className={`album-card album-card-${index % 3}`} data-reveal>
      <Link className="album-cover" to={`/trips/${visit.id}`} onClick={rememberScrollPosition} aria-label={t.openTrip(title, place)}>
        <img src={visit.cover} alt={`${visit.place}: ${visit.title}`} loading="lazy" />
        <span className="cover-shade" />
        <span className="cover-open" aria-hidden="true">↗</span>
        <span className="cover-media"><span aria-hidden="true">▧</span> {t.mediaCount(visit.images.length, visit.videos)}</span>
      </Link>
      <div className="album-card-copy">
        <div className="album-card-meta">
          <span className="album-location">{place}, {localizedRegion(visit.region, language)}</span>
          <span className="album-date">{date}</span>
        </div>
        <Link className="album-title-button" to={`/trips/${visit.id}`} onClick={rememberScrollPosition} aria-label={t.openTrip(title, place)}>
          <span>{title}</span><span aria-hidden="true">↗</span>
        </Link>
        <p>{language === 'vi' ? visit.note : t.photoFromTrip(place, date)}</p>
      </div>
    </article>
  )
}
