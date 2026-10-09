import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import MomentLightbox from '../components/MomentLightbox'
import SiteFooter from '../components/SiteFooter'
import { visits } from '../content/archive'
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
  const { tripId } = useParams()
  const location = useLocation()
  const visit = visits.find((item) => item.id === tripId)
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null)
  const photoMoments: Moment[] = visit
    ? visit.images.map((image, index) => ({
      src: image,
      alt: `Ảnh ${index + 1} trong chuyến đi ${visit.place}`,
      place: visit.place,
      date: visit.date,
    }))
    : []
  const photoLayout = getTripPhotoLayout(visit?.images.length ?? 0)

  useEffect(() => {
    document.title = visit ? `${visit.place} — ${visit.title} | Dấu Chân` : 'Chi tiết chuyến đi | Dấu Chân'
  }, [visit])

  const returnState = location.state?.fromTrip ? undefined : { fromTrip: true, scrollToHash: '#album' }

  if (!visit) {
    return (
      <div className="site-shell trip-page">
        <header className="trip-topbar">
          <Link className="wordmark" to="/#top" aria-label="Dấu Chân, về trang chủ">
            <span className="wordmark-symbol" aria-hidden="true">d.</span>
            <span>Dấu Chân<small>ALBUM CỦA CHÚNG MÌNH</small></span>
          </Link>
        </header>
        <main className="trip-not-found">
          <p className="eyebrow">KHÔNG TÌM THẤY CHUYẾN ĐI</p>
          <h1>Album này chưa có ở đây.</h1>
          <Link className="hero-link" to="/#album">Quay lại album <span aria-hidden="true">←</span></Link>
        </main>
        <SiteFooter detail />
      </div>
    )
  }

  return (
    <div className="site-shell trip-page">
      <header className="trip-topbar">
        <Link className="wordmark" to="/#top" aria-label="Dấu Chân, về trang chủ">
          <span className="wordmark-symbol" aria-hidden="true">d.</span>
          <span>Dấu Chân<small>ALBUM CỦA CHÚNG MÌNH</small></span>
        </Link>
        <Link className="trip-topbar-back" to="/" state={returnState}>Tất cả chuyến đi <span aria-hidden="true">↗</span></Link>
      </header>

      <main className="trip-detail" id="trip-detail">
        <nav className="trip-breadcrumb" aria-label="Đường dẫn">
          <Link to="/" state={returnState}>Album</Link><span aria-hidden="true">/</span><span>{visit.place}</span>
        </nav>
        <section className="trip-intro" aria-labelledby="trip-title">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✳</span> {visit.region.toLocaleUpperCase('vi-VN')} · {visit.year}</p>
            <h1 id="trip-title">{visit.title}</h1>
            <p className="trip-note">{visit.note}</p>
          </div>
          <div className="trip-facts" aria-label="Thông tin chuyến đi">
            <div><span>Địa điểm</span><strong>{visit.place}</strong></div>
            <div><span>Thời gian</span><strong>{visit.date}</strong></div>
            <div><span>Trong album</span><strong>{visit.images.length} ảnh{visit.videos > 0 ? ` · ${visit.videos} video` : ''}</strong></div>
          </div>
        </section>

        <figure className="trip-cover">
          <img src={visit.cover} alt={`${visit.place}: ${visit.title}`} fetchPriority="high" />
          <figcaption><span>{visit.place}</span><span>{visit.date}</span></figcaption>
        </figure>

        <section className="trip-gallery-section" aria-labelledby="trip-gallery-title">
          <div className="trip-gallery-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✳</span> ALBUM ẢNH</p>
              <h2 id="trip-gallery-title">Những ngày ở {visit.place}.</h2>
            </div>
            <p>{String(visit.images.length).padStart(2, '0')} tấm ảnh</p>
          </div>
          <div className="trip-photo-grid">
            {visit.images.map((image, index) => (
              <button className={`trip-photo trip-photo-${photoLayout[index]}`} key={image} onClick={() => setSelectedMoment(index)} type="button" aria-label={`Mở ảnh ${index + 1} trong album ${visit.place}`}>
                <img src={image} alt={`${visit.place}, ảnh ${index + 1}`} loading="lazy" />
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
