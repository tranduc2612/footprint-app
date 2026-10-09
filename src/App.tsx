import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { LanguageProvider, LanguageToggle, useLanguage } from './content/language'
import HomePage from './pages/HomePage'
import TripDetailPage from './pages/TripDetailPage'

function RouteScrollManager() {
  const location = useLocation()
  const handledLocations = useRef(new Set<string>())

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (handledLocations.current.has(location.key)) return
    const isInitialLocation = handledLocations.current.size === 0
    handledLocations.current.add(location.key)

    if (location.pathname.startsWith('/trips/')) {
      window.scrollTo(0, 0)
      return
    }

    if (isInitialLocation) {
      window.sessionStorage.removeItem('tripReturnScrollY')
      const initialAnchorId = location.hash.replace(/^#/, '')
      window.requestAnimationFrame(() => {
        const initialAnchor = initialAnchorId ? document.getElementById(initialAnchorId) : null
        if (initialAnchor) {
          initialAnchor.scrollIntoView({ behavior: 'instant', block: 'start' })
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
      })
      return
    }

    const savedScrollY = window.sessionStorage.getItem('tripReturnScrollY')
    if (savedScrollY !== null) {
      window.requestAnimationFrame(() => window.scrollTo(0, Number(savedScrollY)))
      window.sessionStorage.removeItem('tripReturnScrollY')
      return
    }

    const anchorId = (location.hash || location.state?.scrollToHash || '').replace(/^#/, '')
    if (anchorId) window.requestAnimationFrame(() => document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' }))
  }, [location.hash, location.key, location.pathname, location.state])

  return null
}

function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="site-shell trip-page">
      <main className="trip-not-found">
        <header className="trip-topbar">
          <Link className="wordmark" to="/#top" aria-label={t.homeLinkDetail}>
            <span className="wordmark-symbol" aria-hidden="true">d.</span>
            <span>Dấu Chân<small>{t.brandSubtitle}</small></span>
          </Link>
          <LanguageToggle />
        </header>
        <p className="eyebrow">{t.notFoundEyebrow}</p>
        <h1>{t.notFoundTitle}</h1>
        <Link className="hero-link" to="/">{t.homeButton} <span aria-hidden="true">←</span></Link>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </LanguageProvider>
  )
}
