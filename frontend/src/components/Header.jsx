import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Icon = ({ name, size = 20 }) => (
  <svg style={{ width: size, height: size, verticalAlign: 'middle', marginRight: 6 }}>
    <use xlinkHref={`#icon-${name}`}></use>
  </svg>
)

function Header({ ownerName, username, onEditName, onLogout }) {
  const location = useLocation()

  return (
    <header className="diary-header">
      <h1>
        <svg style={{ width: 28, height: 28, verticalAlign: 'middle', marginRight: 8 }}>
          <use xlinkHref="#icon-edit"></use>
        </svg>
        {ownerName ? `${ownerName}的日记` : '日记'}
        <button
          onClick={onEditName}
          style={{
            marginLeft: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            opacity: 0.6,
            padding: '4px 8px',
            borderRadius: 4,
          }}
          title="修改名称"
        >
          ✏️
        </button>
      </h1>
      <nav className="header-nav">
        {username && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginRight: 16,
            padding: '6px 12px',
            background: 'rgba(255,182,193,0.2)',
            borderRadius: 20
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              color: '#fff',
              fontWeight: 'bold'
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 14, color: '#FFB6C1' }}>{username}</span>
          </div>
        )}
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <Icon name="home" />首页
        </Link>
        <Link to="/generate" className={location.pathname === '/generate' ? 'active' : ''}>
          <Icon name="edit" />写日记
        </Link>
        <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>
          <Icon name="calendar" />日历
        </Link>
        <Link to="/summary" className={location.pathname === '/summary' ? 'active' : ''}>
          <Icon name="summary" />总结
        </Link>
        <Link to="/timeline" className={location.pathname === '/timeline' ? 'active' : ''}>
          <Icon name="time" />时间轴
        </Link>
        <button
          onClick={onLogout}
          style={{
            marginLeft: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            opacity: 0.6,
            padding: '4px 8px',
            borderRadius: 4,
          }}
          title="退出登录"
        >
          🚪
        </button>
      </nav>
    </header>
  )
}

export default Header