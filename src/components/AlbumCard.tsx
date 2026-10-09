import { Link } from 'react-router-dom'
import type { Visit } from '../types/archive'

type AlbumCardProps = {
  visit: Visit
  index: number
}

export default function AlbumCard({ visit, index }: AlbumCardProps) {
  const rememberScrollPosition = () => {
    window.sessionStorage.setItem('tripReturnScrollY', String(window.scrollY))
  }

  return (
    <article className={`album-card album-card-${index % 3}`} data-reveal>
      <Link className="album-cover" to={`/trips/${visit.id}`} onClick={rememberScrollPosition} aria-label={`Mở chi tiết ${visit.title} tại ${visit.place}`}>
        <img src={visit.cover} alt={`${visit.place}: ${visit.title}`} loading="lazy" />
        <span className="cover-shade" />
        <span className="cover-open" aria-hidden="true">↗</span>
        <span className="cover-media"><span aria-hidden="true">▧</span> {visit.images.length} ảnh{visit.videos > 0 && <> <b>·</b> <span aria-hidden="true">▷</span> {visit.videos} video</>}</span>
      </Link>
      <div className="album-card-copy">
        <div className="album-card-meta">
          <span className="album-location">{visit.place}, {visit.region}</span>
          <span className="album-date">{visit.date}</span>
        </div>
        <Link className="album-title-button" to={`/trips/${visit.id}`} onClick={rememberScrollPosition}>
          <span>{visit.title}</span><span aria-hidden="true">↗</span>
        </Link>
        <p>{visit.note}</p>
      </div>
    </article>
  )
}
