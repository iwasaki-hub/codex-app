import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faHouse, faRightFromBracket, faTableColumns, faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../features/auth/useAuth.js'
import './Navbar.css'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="site-header">
      <nav className="site-navbar" aria-label="メインナビゲーション">
        <Link className="site-brand" to="/">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>codex-app</span>
        </Link>

        <div className="navbar-links">
          <NavLink
            className={({ isActive }) => `navbar-link navbar-home-link${isActive ? ' is-active' : ''}`}
            to="/"
          >
            <FontAwesomeIcon icon={faHouse} aria-hidden="true" />ホーム
          </NavLink>
          {user ? (
            <>
              <NavLink
                className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}
                to="/dashboard"
              >
                <FontAwesomeIcon icon={faTableColumns} aria-hidden="true" />ダッシュボード
              </NavLink>
              <NavLink
                className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}
                to="/posts"
              >
                <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />ブログ
              </NavLink>
              <span className="navbar-user" title={user.email}><FontAwesomeIcon icon={faUser} aria-hidden="true" />{user.name}</span>
              <button className="navbar-logout" onClick={handleLogout} type="button">
                <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />ログアウト
              </button>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}
                to="/posts"
              >
                <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />ブログ
              </NavLink>
              <NavLink
                className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}
                to="/login"
              >
                <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />ログイン
              </NavLink>
              <NavLink
                className={({ isActive }) => `navbar-link navbar-register${isActive ? ' is-active' : ''}`}
                to="/register"
              >
                <FontAwesomeIcon icon={faUserPlus} aria-hidden="true" />新規登録
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
