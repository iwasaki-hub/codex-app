import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEye, faEyeSlash, faGlobe, faLock, faPaperPlane, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { postsApi } from './postsApi.js'
import { useAuth } from '../auth/useAuth.js'
import './PostsPage.css'

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '日付未設定'

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function PostsPage() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [visibilityError, setVisibilityError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingPostId, setUpdatingPostId] = useState(null)

  useEffect(() => {
    let isActive = true

    postsApi.list(token)
      .then(({ posts: nextPosts }) => {
        if (isActive) setPosts(nextPosts)
      })
      .catch((error) => {
        if (!isActive) return
        if (error.status === 401) {
          logout()
          navigate('/login', { replace: true })
        } else {
          setLoadError(error.message)
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [token, logout, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const { post } = await postsApi.create(token, {
        title: title.trim(),
        content: content.trim(),
        isPublished,
      })
      setPosts((currentPosts) => [post, ...currentPosts])
      setTitle('')
      setContent('')
      setIsPublished(true)
    } catch (error) {
      if (error.status === 401) {
        logout()
        navigate('/login', { replace: true })
      } else {
        setSubmitError(error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVisibilityToggle(post) {
    const nextIsPublished = post.isPublished === false
    setVisibilityError('')
    setUpdatingPostId(post.id)

    try {
      const { post: updatedPost } = await postsApi.updateVisibility(
        token,
        post.id,
        nextIsPublished,
      )
      setPosts((currentPosts) => currentPosts.map((currentPost) => (
        currentPost.id === updatedPost.id ? updatedPost : currentPost
      )))
    } catch (error) {
      if (error.status === 401) {
        logout()
        navigate('/login', { replace: true })
      } else {
        setVisibilityError(error.message)
      }
    } finally {
      setUpdatingPostId(null)
    }
  }

  return (
    <main className="posts-page">
      <div className="posts-container">
        <header className="posts-heading">
          <div>
            <p className="eyebrow">YOUR WRITING SPACE</p>
            <h1>ブログ記事</h1>
            <p>アイデアや日々の記録を、記事として共有しましょう。</p>
          </div>
          <span className="posts-count">{posts.length} 記事</span>
        </header>

        {user ? (
          <section className="post-composer" aria-labelledby="composer-title">
            <div className="composer-heading">
              <span className="composer-icon" aria-hidden="true"><FontAwesomeIcon icon={faPenToSquare} /></span>
              <div>
                <h2 id="composer-title">新しい記事を書く</h2>
                <p>記事のタイトルと本文を入力してください。</p>
              </div>
            </div>
            <form className="post-form" onSubmit={handleSubmit}>
              <label className="post-field">
                タイトル
                <input
                  maxLength={120}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="記事のタイトル"
                  required
                  value={title}
                />
              </label>
              <label className="post-field">
                本文
                <textarea
                  maxLength={20000}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="記事の内容を書いてください…"
                  required
                  rows={6}
                  value={content}
                />
              </label>
              <label className="post-field post-visibility-field">
                公開範囲
                <select
                  onChange={(event) => setIsPublished(event.target.value === 'public')}
                  value={isPublished ? 'public' : 'private'}
                >
                  <option value="public">公開 — 誰でも閲覧できます</option>
                  <option value="private">非公開 — 自分だけが閲覧できます</option>
                </select>
              </label>
              {submitError && <p className="post-error" role="alert">{submitError}</p>}
              <div className="post-form-footer">
                <span>{content.length.toLocaleString('ja-JP')} / 20,000文字</span>
                <button className="post-submit" disabled={isSubmitting} type="submit">
                  {!isSubmitting && <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />}
                  {isSubmitting ? '投稿中…' : '記事を投稿する'}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="post-guest-prompt">
            <div>
              <h2>記事を投稿しませんか？</h2>
              <p>ログインすると、記事の投稿や非公開設定を利用できます。</p>
            </div>
            <Link className="post-guest-link" to="/login">ログインして投稿する <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
          </section>
        )}

        <section className="post-list-section" aria-labelledby="post-list-title">
          <div className="post-list-heading">
            <div>
              <p className="eyebrow">LATEST STORIES</p>
              <h2 id="post-list-title">{user ? '記事一覧' : '公開記事'}</h2>
            </div>
            <span>{posts.length} 件</span>
          </div>

          {isLoading && <p className="posts-feedback" role="status">記事を読み込んでいます…</p>}
          {!isLoading && loadError && <p className="post-error" role="alert">{loadError}</p>}
          {!isLoading && visibilityError && <p className="post-error" role="alert">{visibilityError}</p>}
          {!isLoading && !loadError && posts.length === 0 && (
            <p className="posts-empty">まだ記事がありません。最初の記事を投稿してみましょう。</p>
          )}
          {!isLoading && !loadError && posts.length > 0 && (
            <div className="post-list">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-card-meta">
                    <span className="post-author-avatar" aria-hidden="true">
                      {(post.authorName || post.author || 'U').trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="post-author">{post.authorName || post.author || 'ユーザー'}</span>
                    <time dateTime={post.createdAt || undefined}>{formatDate(post.createdAt)}</time>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="post-content">{post.content || '本文はまだありません。'}</p>
                  <div className="post-card-footer">
                    <span className={`post-visibility-badge${post.isPublished === false ? ' is-private' : ''}`}>
                      <FontAwesomeIcon icon={post.isPublished === false ? faLock : faGlobe} aria-hidden="true" />
                      {post.isPublished === false ? '非公開' : '公開中'}
                    </span>
                    {user && String(post.authorId) === String(user.id) && (
                      <button
                        className="post-visibility-toggle"
                        disabled={updatingPostId === post.id}
                        onClick={() => handleVisibilityToggle(post)}
                        type="button"
                      >
                        {updatingPostId === post.id
                          ? '更新中…'
                          : <><FontAwesomeIcon icon={post.isPublished === false ? faEye : faEyeSlash} aria-hidden="true" />{post.isPublished === false ? '公開する' : '非公開にする'}</>}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
