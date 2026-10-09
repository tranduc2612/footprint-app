import { Link } from 'react-router-dom'

type SiteFooterProps = {
  detail?: boolean
}

export default function SiteFooter({ detail = false }: SiteFooterProps) {
  return (
    <footer className={`footer${detail ? ' trip-footer' : ''}`}>
      <Link className="footer-brand" to="/#top"><span>d.</span> DẤU CHÂN</Link>
      <p>Đi qua rồi, vẫn còn ở đây.</p>
      <Link to={detail ? '/#album' : '/#top'} className="back-top">
        {detail ? 'Tất cả chuyến đi ↑' : 'Về đầu trang ↑'}
      </Link>
    </footer>
  )
}
