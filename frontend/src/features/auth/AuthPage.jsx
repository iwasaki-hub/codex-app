import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from './useAuth.js'
import './AuthPage.css'

export function AuthPage({ mode }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isRegistering = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const credentials = { email: email.trim().toLowerCase(), password }
      if (isRegistering) {
        await register({ ...credentials, name: name.trim() })
      } else {
        await login(credentials)
      }
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-aside" aria-label="サービス紹介">
        <div className="aside-copy">
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>毎日の作業に、<br />ひとつの場所を。</h1>
          <p>アカウントにログインして、あなたのワークスペースを開きましょう。</p>
        </div>
        <p className="aside-footer">シンプルに始める、あなたのワークスペース。</p>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <p className="eyebrow">ACCOUNT</p>
          <h2>{isRegistering ? 'アカウントを作成' : 'おかえりなさい'}</h2>
          <p className="form-intro">
            {isRegistering
              ? '必要な情報を入力して、利用を開始してください。'
              : '登録したメールアドレスでログインしてください。'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegistering && (
              <label className="field">
                名前
                <input
                  autoComplete="name"
                  maxLength={80}
                  name="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="山田 花子"
                  required
                  value={name}
                />
              </label>
            )}

            <label className="field">
              メールアドレス
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="field">
              パスワード
              <input
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                minLength={isRegistering ? 8 : undefined}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isRegistering ? '8文字以上' : 'パスワード'}
                required
                type="password"
                value={password}
              />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="submit-button" disabled={isSubmitting} type="submit">
              {!isSubmitting && <FontAwesomeIcon icon={isRegistering ? faUserPlus : faArrowRightToBracket} aria-hidden="true" />}
              {isSubmitting ? '処理中…' : isRegistering ? 'アカウントを作成' : 'ログイン'}
            </button>
          </form>

          <Link className="mode-toggle" to={isRegistering ? '/login' : '/register'}>
            {isRegistering ? 'すでにアカウントをお持ちの方はこちら' : '初めてご利用の方はこちら'}
          </Link>
        </div>
      </section>
    </main>
  )
}
