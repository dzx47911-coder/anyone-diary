import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingDecorations from '../components/FloatingDecorations'

function TimelinePage({ diaries }) {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [selectedDiary, setSelectedDiary] = useState(null)
  const [hoveredDiaryId, setHoveredDiaryId] = useState(null)
  const itemRefs = useRef([])

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

    return () => {
      observers.forEach(obs => obs.disconnect())
    }
  }, [diaries])

  const sortedDiaries = [...diaries].sort((a, b) => new Date(b.date) - new Date(a.date))

  const decorations = ['🌸', '✨', '💫', '🌷', '🦋', '🌻', '🍀', '⭐', '🎀', '🌺']
  const tapeRotations = [-15, -8, 5, 12, -5, 10, -12, 8, 3, -8]

  const handleCardClick = (diary) => {
    setSelectedDiary(diary)
  }

  const closeModal = () => {
    setSelectedDiary(null)
    setHoveredDiaryId(null)
  }

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
          <Link to="/generate" className="diary-btn">
            <svg style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }}>
              <use xlinkHref="#icon-edit"></use>
            </svg>
            写下第一篇日记
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="home-greeting">
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

        {sortedDiaries.map((diary, index) => (
          <div
            key={diary.id || index}
            ref={el => itemRefs.current[index] = el}
            className={`timeline-item ${visibleItems.has(index) ? 'visible' : ''}`}
            style={{ '--index': index }}
          >
            <div className="timeline-dot">
              <div className="timeline-dot-inner" />
            </div>

            <div
                className="timeline-card-wrapper"
                onClick={() => handleCardClick(diary)}
                style={{ cursor: 'pointer' }}
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

                <div className="timeline-card">
                <div className="timeline-date">
                  <svg style={{ width: 16, height: 16, marginRight: 6 }}>
                    <use xlinkHref="#icon-calendar"></use>
                  </svg>
                  {diary.date}
                </div>

                <div className="timeline-moods">
                  {diary.moodLabels?.slice(0, 3).map((label, i) => (
                    <span key={i} className="tag tag-mood" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      {label}
                    </span>
                  ))}
                </div>

                <div className="diary-content timeline-content">
                  {diary.content}
                </div>

                <div className="timeline-footer">
                  <span className="timeline-author">📔 小董日记</span>
                  <span className="timeline-index">#{sortedDiaries.length - index}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link to="/calendar" className="diary-btn diary-btn-secondary">
          <svg style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }}>
            <use xlinkHref="#icon-calendar"></use>
          </svg>
          返回日历
        </Link>
      </div>
      <FloatingDecorations />

      {selectedDiary && (
        <div
          className="timeline-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="timeline-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="timeline-modal-close"
            >
              ✕
            </button>

            <div
              className="timeline-modal-tape"
              style={{ transform: `rotate(${tapeRotations[0]}deg)` }}
            >
              {decorations[0]}
            </div>

            <div className="timeline-modal-date">
              <svg style={{ width: 18, height: 18, marginRight: 8 }}>
                <use xlinkHref="#icon-calendar"></use>
              </svg>
              {selectedDiary.date}
            </div>

            <div className="timeline-modal-moods">
              {selectedDiary.moodLabels?.map((label, i) => (
                <span
                  key={i}
                  className="tag tag-mood"
                  style={{
                    background: 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))',
                    color: 'white'
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="diary-content timeline-modal-content">
              {selectedDiary.content}
            </div>

            <div className="timeline-modal-footer">
              <span>📔 小董日记</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimelinePage