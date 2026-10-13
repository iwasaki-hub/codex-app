import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faInstagram, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import './Footer.css'

const socialLinks = [
  { label: 'X', href: 'https://x.com/', icon: faXTwitter },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: faInstagram },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: faYoutube },
  { label: 'GitHub', href: 'https://github.com/iwasaki-hub/codex-app', icon: faGithub },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main">
          <Link className="footer-brand" to="/">
            <span className="brand-mark" aria-hidden="true">C</span>
            <span>codex-app</span>
          </Link>
          <p className="footer-description">書くこと、つくることを、ひとつの場所から。</p>
          <nav className="footer-nav" aria-label="フッターナビゲーション">
            <Link to="/">ホーム</Link>
            <Link to="/posts">ブログ</Link>
            <Link to="/login">ログイン</Link>
          </nav>
        </div>

        <div className="footer-social">
          <p>SOCIAL</p>
          <div className="footer-social-links">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                aria-label={label}
                className="footer-social-link"
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
                title={label}
              >
                <FontAwesomeIcon icon={icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} codex-app</span>
          <span>Made for your ideas.</span>
        </div>
      </div>
    </footer>
  )
}
