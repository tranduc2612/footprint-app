import { useEffect } from 'react'
import { useLanguage } from '../content/language'
import type { Moment } from '../types/archive'

type MomentLightboxProps = {
  moments: Moment[]
  activeIndex: number | null
  onChange: (index: number) => void
  onClose: () => void
}

export default function MomentLightbox({ moments, activeIndex, onChange, onClose }: MomentLightboxProps) {
  const { t } = useLanguage()
  const moment = activeIndex === null ? null : moments[activeIndex]

  useEffect(() => {
    if (activeIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((activeIndex - 1 + moments.length) % moments.length)
      if (event.key === 'ArrowRight') onChange((activeIndex + 1) % moments.length)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, moments.length, onChange, onClose])

  if (!moment) return null

  const showNavigation = moments.length > 1
  const changeImage = (direction: -1 | 1) => {
    if (activeIndex === null) return
    onChange((activeIndex + direction + moments.length) % moments.length)
  }

  return (
    <div className="photo-viewer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="photo-viewer-stage" role="dialog" aria-modal="true" aria-label={t.lightbox}>
        <img className="photo-viewer-image" src={moment.src} alt={moment.alt} />
        <button className="photo-viewer-close" onClick={onClose} type="button" aria-label={t.closePhoto}><span className="photo-viewer-glyph" aria-hidden="true">×</span></button>
        {showNavigation && (
          <>
            <button className="photo-viewer-arrow photo-viewer-previous" onClick={() => changeImage(-1)} type="button" aria-label={t.previousPhoto}><span className="photo-viewer-glyph" aria-hidden="true">←</span></button>
            <button className="photo-viewer-arrow photo-viewer-next" onClick={() => changeImage(1)} type="button" aria-label={t.nextPhoto}><span className="photo-viewer-glyph" aria-hidden="true">→</span></button>
          </>
        )}
      </section>
    </div>
  )
}
