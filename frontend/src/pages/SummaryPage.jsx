import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function SummaryPage({ diaries }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)

  const years = [...new Set(diaries.map(d => parseInt(d.date.split('-')[0])))].sort((a, b) => b - a)

  const monthlyData = {}
  for (let m = 1; m <= 12; m++) {
    const monthStr = `${selectedYear}-${String(m).padStart(2, '0')}`
    monthlyData[m] = diaries.filter(d => d.date.startsWith(monthStr))
  }

  const getTotalCount = (diariesList) => diariesList.length

  const getWordStats = (diariesList) => {
    return diariesList.reduce((sum, d) => sum + (d.content?.length || 0), 0)
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月']

  const monthIcons = ['🌸', '🌷', '🌺', '🌻', '🌼', '🌿', '🍀', '🍃', '🍁', '🍂', '❄️', '🗓️']

  return (
    <div className="page-container">
      <div className="home-greeting">
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-summary"></use>
          </svg>
          日记总结
        </h1>
        <p className="date">
          <svg style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 4 }}>
            <use xlinkHref="#icon-notebook"></use>
          </svg>
          {diaries.length} 篇日记记录
        </p>
      </div>

      {/* Year selector */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {years.length > 0 ? years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className="diary-btn"
              style={{
                padding: '10px 25px',
                fontSize: '1rem',
                background: y === selectedYear ? 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))' : 'white',
                color: y === selectedYear ? 'white' : 'var(--pink-main)',
                border: y === selectedYear ? 'none' : '2px solid var(--pink-main)'
              }}
            >
              {y}年
            </button>
          )) : (
            <span style={{ color: 'var(--pink-deep)' }}>还没有日记数据</span>
          )}
        </div>
      </div>

      {/* Year overview */}
      <div className="diary-card" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'ZCOOL XiaoWei, serif', color: 'var(--text-dark)', marginBottom: '20px' }}>
          <svg style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 8 }}>
            <use xlinkHref="#icon-star"></use>
          </svg>
          {selectedYear}年度概览
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--pink-main)', fontFamily: 'ZCOOL XiaoWei, serif' }}>
              {getTotalCount(diaries.filter(d => d.date.startsWith(String(selectedYear))))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', opacity: 0.7 }}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-notebook"></use>
              </svg>
              篇日记
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--accent-green)', fontFamily: 'ZCOOL XiaoWei, serif' }}>
              {Object.keys(monthlyData).filter(m => monthlyData[m].length > 0).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', opacity: 0.7 }}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-calendar"></use>
              </svg>
              记录月份
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--accent-purple)', fontFamily: 'ZCOOL XiaoWei, serif' }}>
              {getWordStats(diaries.filter(d => d.date.startsWith(String(selectedYear))))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', opacity: 0.7 }}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-edit"></use>
              </svg>
              累计文字
            </div>
          </div>
        </div>
      </div>

      {/* Monthly grid */}
      <h3 style={{
        fontFamily: 'ZCOOL XiaoWei, serif',
        textAlign: 'center',
        color: 'var(--text-dark)',
        marginBottom: '20px',
        fontSize: '1.3rem'
      }}>
        <svg style={{ width: 22, height: 22, verticalAlign: 'middle', marginRight: 8 }}>
          <use xlinkHref="#icon-calendar"></use>
        </svg>
        月度详情
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {Object.entries(monthlyData).map(([month, monthDiaries]) => {
          const monthNum = parseInt(month)
          const isEmpty = monthDiaries.length === 0

          return (
            <div
              key={month}
              className="diary-card"
              onClick={() => !isEmpty && setSelectedMonth(selectedMonth === monthNum ? null : monthNum)}
              style={{
                textAlign: 'center',
                padding: '20px 15px',
                cursor: isEmpty ? 'default' : 'pointer',
                transform: `rotate(${(monthNum % 2 === 0 ? 1 : -1) * 0.5}deg)`,
                opacity: isEmpty ? 0.5 : 1,
                border: selectedMonth === monthNum ? '3px solid var(--pink-main)' : '3px solid transparent'
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                {monthIcons[monthNum - 1]}
              </div>
              <div style={{
                fontFamily: 'ZCOOL XiaoWei, serif',
                fontSize: '1.1rem',
                color: 'var(--text-dark)',
                marginBottom: '8px'
              }}>
                {monthNames[monthNum - 1]}
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'var(--pink-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <svg style={{ width: 16, height: 16 }}>
                  <use xlinkHref="#icon-notebook"></use>
                </svg>
                {monthDiaries.length} 篇
              </div>

              {isEmpty && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#ccc',
                  marginTop: '8px'
                }}>
                  暂无记录
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected month detail */}
      {selectedMonth && (
        <div className="diary-card" style={{ marginTop: '30px' }}>
          <h3 style={{
            fontFamily: 'ZCOOL XiaoWei, serif',
            textAlign: 'center',
            marginBottom: '20px',
            color: 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{monthIcons[selectedMonth - 1]}</span>
            {selectedYear}年 {monthNames[selectedMonth - 1]}详情
          </h3>

          {(() => {
            const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`
            const monthDiaries = diaries.filter(d => d.date.startsWith(monthStr))

            return (
              <>
                {/* Stats */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'var(--pink-light)',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg style={{ width: 16, height: 16 }}>
                      <use xlinkHref="#icon-notebook"></use>
                    </svg>
                    {monthDiaries.length} 篇
                  </span>
                  <span style={{
                    background: 'var(--accent-yellow)',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg style={{ width: 16, height: 16 }}>
                      <use xlinkHref="#icon-edit"></use>
                    </svg>
                    {getWordStats(monthDiaries)} 字
                  </span>
                </div>

                {/* Diary entries timeline */}
                <div style={{ borderTop: '2px dashed var(--pink-light)', paddingTop: '20px' }}>
                  {monthDiaries.sort((a, b) => new Date(b.date) - new Date(a.date)).map((diary, i) => (
                    <div
                      key={diary.id || i}
                      style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '12px',
                        padding: '15px',
                        background: 'var(--cream)',
                        borderRadius: '12px',
                        transform: `rotate(${(i % 2 === 0 ? 0.3 : -0.3)}deg)`
                      }}
                    >
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--pink-deep)',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <svg style={{ width: 14, height: 14 }}>
                          <use xlinkHref="#icon-calendar"></use>
                        </svg>
                        {diary.date.split('-').slice(1).join('/')}
                      </div>
                      <div>
                        <div style={{ marginBottom: '5px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {diary.moodLabels?.map((label, j) => (
                            <span
                              key={j}
                              style={{
                                background: 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '0.75rem'
                              }}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', opacity: 0.7 }}>
                          {diary.content?.substring(0, 50)}
                          {diary.content?.length > 50 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link
          to="/calendar"
          className="diary-btn"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg style={{ width: 18, height: 18 }}>
            <use xlinkHref="#icon-calendar"></use>
          </svg>
          返回日历
        </Link>
      </div>
    </div>
  )
}

export default SummaryPage