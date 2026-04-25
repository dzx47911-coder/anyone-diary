import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Icon = ({ name, size = 20 }) => (
  <svg style={{ width: size, height: size, verticalAlign: 'middle', marginRight: 6 }}>
    <use xlinkHref={`#icon-${name}`}></use>
  </svg>
)

function Header() {
  const location = useLocation()

  return (
    <header className="diary-header">
      <h1>
        <svg style={{ width: 28, height: 28, verticalAlign: 'middle', marginRight: 8 }}>
          <use xlinkHref="#icon-edit"></use>
        </svg>
        小董日记
      </h1>
      <nav className="header-nav">
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
      </nav>
    </header>
  )
}

export default Header