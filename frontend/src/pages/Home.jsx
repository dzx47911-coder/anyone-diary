import React from 'react'
import { Link } from 'react-router-dom'
import FloatingDecorations from '../components/FloatingDecorations'

function Home({ diaries, ownerName }) {
  return (
    <div className="page-container">
      <FloatingDecorations />
      <div className="home-greeting">
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-flower"></use>
          </svg>
          {ownerName ? `${ownerName}的日记` : '我的日记'}
        </h1>
        <p className="date">记录生活中的每一个小确幸</p>
      </div>

      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <Link
          to="/generate"
          className="diary-btn"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '20px 50px',
            fontSize: '1.2rem'
          }}
        >
          <svg style={{ width: 24, height: 24 }}>
            <use xlinkHref="#icon-edit"></use>
          </svg>
          写下你的小小确幸
        </Link>
      </div>

      {diaries.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            to="/timeline"
            style={{
              color: 'var(--pink-deep)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg style={{ width: 18, height: 18 }}>
              <use xlinkHref="#icon-notebook"></use>
            </svg>
            查看 {diaries.length} 篇日记
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home