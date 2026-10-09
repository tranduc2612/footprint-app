import { Link } from 'react-router-dom'
import { useLanguage } from '../content/language'

type SiteFooterProps = {
  detail?: boolean
}

export default function SiteFooter({ detail = false }: SiteFooterProps) {
  const { t } = useLanguage()

  return (
    <footer className={`footer${detail ? ' trip-footer' : ''}`}>
      <Link className="footer-brand" to="/#top"><span>d.</span> DẤU CHÂN</Link>
      <p>{t.footerLine}</p>
      <Link to={detail ? '/#album' : '/#top'} className="back-top">
        {detail ? t.allTrips : t.backToTop} ↑
      </Link>
    </footer>
  )
}
