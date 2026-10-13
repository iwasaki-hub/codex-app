import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../auth/useAuth.js'
import './HomePage.css'

const features = [
  {
    number: '01',
    title: 'すぐに始められる',
    description: 'アカウントを作成して、あなたのワークスペースへ。',
  },
  {
    number: '02',
    title: '必要な場所へ迷わず移動',
    description: 'ホーム、ログイン、ダッシュボードをナビゲーションから移動できます。',
  },
  {
    number: '03',
    title: '安心できる認証設計',
    description: 'パスワードはハッシュ化して保存し、認証済みのページを保護します。',
  },
]

export function HomePage() {
  const { user } = useAuth()

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="eyebrow">YOUR WORKSPACE, IN ONE PLACE</p>
          <h1 id="home-title">毎日の作業に、<br /><span>ひとつの場所を。</span></h1>
          <p className="home-lead">
            シンプルな認証から始まる、あなたのワークスペース。必要なページへ、すぐにアクセスできます。
          </p>
          <div className="home-actions">
            <Link className="home-primary-action" to={user ? '/dashboard' : '/register'}>
              {user ? 'ダッシュボードを開く' : '無料で始める'}
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
            {!user && <Link className="home-secondary-action" to="/login">ログイン</Link>}
          </div>
          <p className="home-note">登録は数分で完了します</p>
        </div>

        <div className="home-preview" aria-label="ワークスペースのプレビュー">
          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-dots" aria-hidden="true"><i /><i /><i /></div>
              <span>codex-app / workspace</span>
              <span className="preview-status"><i /> READY</span>
            </div>
            <div className="preview-body">
              <div className="preview-sidebar" aria-hidden="true">
                <span className="preview-sidebar-mark">C</span>
                <i className="preview-side-line is-selected" />
                <i className="preview-side-line" />
                <i className="preview-side-line short" />
              </div>
              <div className="preview-content">
                <p className="preview-kicker">YOUR WORKSPACE</p>
                <h2>おかえりなさい。</h2>
                <p className="preview-subtitle">今日もここから始めましょう。</p>
                <div className="preview-task-list">
                  <div className="preview-task"><span className="preview-check"><FontAwesomeIcon icon={faCheck} /></span><i /><b /></div>
                  <div className="preview-task"><span className="preview-check"><FontAwesomeIcon icon={faCheck} /></span><i /><b /></div>
                  <div className="preview-task"><span className="preview-check pending" /><i /><b /></div>
                </div>
                <div className="preview-bottom-card">
                  <span className="preview-avatar">C</span>
                  <span><b>My workspace</b><small>安全にサインイン済み</small></span>
                  <span className="preview-arrow">↗</span>
                </div>
              </div>
            </div>
          </div>
          <div className="preview-orbit orbit-one" aria-hidden="true" />
          <div className="preview-orbit orbit-two" aria-hidden="true" />
        </div>
      </section>

      <section className="home-features" aria-labelledby="features-title">
        <div className="features-heading">
          <p className="eyebrow">MADE TO FEEL SIMPLE</p>
          <h2 id="features-title">迷わず使える、シンプルな設計。</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
