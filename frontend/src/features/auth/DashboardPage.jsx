import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { authApi } from './authApi.js'
import { useAuth } from './useAuth.js'
import './DashboardPage.css'

export function DashboardPage() {
  const { token, user, logout } = useAuth()
  const [verifiedUser, setVerifiedUser] = useState(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationError, setVerificationError] = useState('')
  useEffect(() => {
    let isActive = true

    authApi.currentUser(token)
      .then(({ user: currentUser }) => {
        if (isActive) setVerifiedUser(currentUser)
      })
      .catch((error) => {
        if (!isActive) return
        if (error.status === 401) {
          logout()
        } else {
          setVerificationError('認証状態を確認できません。バックエンドとモック API が起動しているか確認してください。')
        }
      })
      .finally(() => {
        if (isActive) setIsVerifying(false)
      })

    return () => {
      isActive = false
    }
  }, [token, logout])

  if (isVerifying) {
    return <main className="dashboard-loading" role="status">認証状態を確認しています…</main>
  }

  const displayUser = verifiedUser || user
  const verifiedInitial = displayUser.name.trim().charAt(0).toUpperCase() || 'U'

  return (
    <main className="dashboard-layout">
      <section className="dashboard-content">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>{displayUser.name} さん、おかえりなさい。</h1>
        {verificationError && <p className="form-error" role="alert">{verificationError}</p>}
        <div className="dashboard-card">
          <div className="avatar" aria-hidden="true">{verifiedInitial}</div>
          <div>
            <h2>{displayUser.name}</h2>
            <p>{displayUser.email}</p>
          </div>
          <span className="session-badge"><FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />認証済み</span>
        </div>
        <Link className="dashboard-posts-link" to="/posts">ブログ記事を書く <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
      </section>
    </main>
  )
}
