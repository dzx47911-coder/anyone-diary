import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FloatingDecorations from '../components/FloatingDecorations'
import DiaryCard from '../components/DiaryCard'

function TimelinePage({ diaries }) {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [hoveredDate, setHoveredDate] = useState(null)
  const [selectedDiary, setSelectedDiary] = useState(null)
  const itemRefs = useRef([])

  const groupedByDate = useMemo(() => {
    const groups = {}
    diaries.forEach(d => {
      if (!groups[d.date]) groups[d.date] = []
      groups[d.date].push(d)
    })
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  }, [diaries])

  useEffect(() => {
    const observers = []
    itemRefs.current.forEach((el, index) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]))
            }, index * 100)
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(obs => obs.disconnect())
  }, [groupedByDate])

  const decorations = ['🌸', '✨', '💫', '🌷', '🦋', '🌻', '🍀', '⭐', '🎀', '🌺']
  const tapeRotations = [-15, -8, 5, 12, -5, 10, -12, 8, 3, -8]

  if (diaries.length === 0) {
    return (
      <div className="page-container">
        <div className="home-greeting">
          <h1>
            <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
              <use xlinkHref="#icon-notebook"></use>
            </svg>
            时间轴
          </h1>
          <p className="date">还没有日记记录</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/generate" className="diary-btn">写下第一篇日记</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="home-greeting" style={{ padding: '30px 20px' }}>
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-notebook"></use>
          </svg>
          时间轴
        </h1>
        <p className="date">顺着时光隧道漫步</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line" />

        {groupedByDate.map(([date, entries], index) => (
          <div
            key={date}
            ref={el => itemRefs.current[index] = el}
            className={`timeline-item ${visibleItems.has(index) ? 'visible' : ''}`}
            style={{ '--index': index }}
          >
            <div className="timeline-dot">
              <div className="timeline-dot-inner" />
            </div>

            <div
              className="timeline-card-wrapper"
              onMouseEnter={() => entries.length > 1 && setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              style={{ position: 'relative' }}
            >
              <div
                className="timeline-tape"
                style={{
                  right: `${20 + (index % 3) * 15}px`,
                  transform: `rotate(${tapeRotations[index % tapeRotations.length]}deg)`
                }}
              >
                {decorations[index % decorations.length]}
              </div>

              {(hoveredDate === date ? entries : [entries[0]]).map((entry, ei) => (
                <div
                  key={entry.id}
                  className="timeline-card"
                  onClick={() => setSelectedDiary(entry)}
                  style={{ marginBottom: ei < entries.length - 1 && hoveredDate === date ? 15 : 0, cursor: 'pointer' }}
                >
                  <div className="timeline-date">
                    <svg style={{ width: 16, height: 16, marginRight: 6 }}>
                      <use xlinkHref="#icon-calendar"></use>
                    </svg>
                    {date}
                    {ei === 0 && entries.length > 1 && hoveredDate !== date && (
                      <span style={{
                        marginLeft: 8, fontSize: '0.75rem',
                        background: 'var(--pink-main)', color: '#fff',
                        padding: '2px 8px', borderRadius: 10,
                      }}>
                        {entries.length}篇
                      </span>
                    )}
                  </div>

                  <div className="timeline-moods">
                    {entry.moodLabels?.slice(0, 3).map((label, i) => (
                      <span key={i} className="tag tag-mood" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="diary-content timeline-content">
                    {entry.content}
                  </div>

                  <div className="timeline-footer">
                    <span className="timeline-author">📔 Anyone diary</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link to="/calendar" className="diary-btn diary-btn-secondary">返回日历</Link>
      </div>
      <FloatingDecorations />

      {selectedDiary && (
        <div
          className="timeline-modal-overlay"
          onClick={() => setSelectedDiary(null)}
        >
          <div
            className="timeline-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '85vh', overflowY: 'auto' }}
          >
            <button onClick={() => setSelectedDiary(null)} className="timeline-modal-close">✕</button>
            <DiaryCard diary={selectedDiary} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TimelinePage
