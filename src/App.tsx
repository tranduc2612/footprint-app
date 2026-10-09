import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import TripDetailPage from './pages/TripDetailPage'

function RouteScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/trips/')) {
      window.scrollTo(0, 0)
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
  return (
    <div className="site-shell trip-page">
      <main className="trip-not-found">
        <p className="eyebrow">404 · KHÔNG TÌM THẤY TRANG</p>
        <h1>Trang này chưa có ở đây.</h1>
        <a className="hero-link" href="/">Về trang chủ <span aria-hidden="true">←</span></a>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
