import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Icon = ({ name, size = 16 }) => (
  <svg style={{ width: size, height: size, verticalAlign: 'middle', marginRight: 4 }}>
    <use xlinkHref={`#icon-${name}`}></use>
  </svg>
)

function Header({ ownerName, username, onEditName, onLogout }) {
  const location = useLocation()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = () => {
    setShowConfirm(true)
  }

  const confirmLogout = () => {
    setShowConfirm(false)
    onLogout()
  }

  return (
    <>
      <header className="diary-header">
        <h1>
          <svg style={{ width: 28, height: 28, verticalAlign: 'middle', marginRight: 8 }}>
            <use xlinkHref="#icon-edit"></use>
          </svg>
          {ownerName ? `${ownerName}的日记` : '日记'}
          <button
            onClick={onEditName}
            style={{
              marginLeft: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 4,
              opacity: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
            }}
            title="修改名称"
          >
            <svg style={{ width: 18, height: 18 }}>
              <use xlinkHref="#icon-edit"></use>
            </svg>
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
          <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
            <Icon name="search" />搜索
          </Link>
          <button
            onClick={handleLogout}
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
            退出登录
          </button>
        </nav>
      </header>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            maxWidth: 300,
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: 20, fontSize: 16 }}>确定要退出登录吗？</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: '8px 20px',
                  border: '2px solid #FFE4E1',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header