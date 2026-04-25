import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import DiaryCard from '../components/DiaryCard'

function CalendarPage({ diaries, onDelete }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date'))
  const [selectedDiaries, setSelectedDiaries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [hoveredDiaryId, setHoveredDiaryId] = useState(null)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  const formatDate = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const getDiariesForDate = (date) => diaries.filter(d => d.date === date)

  const handleDateClick = (date) => {
    const diariesForDate = getDiariesForDate(date)
    if (diariesForDate.length > 0) {
      setSelectedDate(date)
      setSelectedDiaries(diariesForDate)
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDate(null)
    setSelectedDiaries([])
    setHoveredDiaryId(null)
    setSearchParams({})
  }

  const handleDelete = (diaryId) => {
    if (confirm('确定要删除这篇日记吗？')) {
      onDelete(diaryId)
      const updatedDiaries = selectedDiaries.filter(d => d.id !== diaryId)
      if (updatedDiaries.length === 0) {
        closeModal()
      } else {
        setSelectedDiaries(updatedDiaries)
      }
    }
  }

  const decorations = ['📌', '📎', '🖊️', '🖌️', '✨', '🌟', '💫']
  const tapeRotations = [-12, -6, 3, 8, 15, -8, 10, -3]

  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月']

  const days = []
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(year, month, -startDay + i + 1)
    days.push({ day: prevDate.getDate(), isCurrentMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }

  return (
    <div className="page-container">
      <div className="home-greeting">
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-calendar"></use>
          </svg>
          日历记忆
        </h1>
        <p className="date">点击有日记的日期查看</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <select
              value={year}
              onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), month, 1))}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '2px solid var(--pink-main)',
                background: 'white',
                color: 'var(--pink-deep)',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setCurrentMonth(new Date(year, parseInt(e.target.value), 1))}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '2px solid var(--pink-main)',
                background: 'white',
                color: 'var(--pink-deep)',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          </div>
          <div className="calendar-nav" style={{ marginTop: '10px' }}>
            <button onClick={prevMonth}>◀</button>
            <button onClick={nextMonth}>▶</button>
          </div>
        </div>

        <div className="calendar-weekdays">
          {weekdays.map((day, i) => (
            <div key={i} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((d, i) => {
            const dateStr = formatDate(d.day)
            const hasDiary = diaries.some(diary => diary.date === dateStr)
            const isToday = new Date().toISOString().split('T')[0] === dateStr

            return (
              <div
                key={i}
                className={`calendar-day ${!d.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasDiary ? 'has-diary' : ''}`}
                onClick={() => d.isCurrentMonth && hasDiary && handleDateClick(dateStr)}
                style={d.isCurrentMonth && hasDiary ? { cursor: 'pointer' } : {}}
              >
                {d.day}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--pink-deep)', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <span style={{ border: '2px solid var(--pink-main)', padding: '2px 8px', borderRadius: '5px' }}>今天</span>
          <span>📝 有日记（点击查看）</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to="/summary"
            style={{
              color: 'var(--pink-deep)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '2px dashed var(--pink-main)',
              padding: '8px 15px',
              borderRadius: '8px'
            }}
          >
            <svg style={{ width: 18, height: 18 }}>
              <use xlinkHref="#icon-summary"></use>
            </svg>
            查看月度总结
          </Link>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 248, 240, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />

          <div
            style={{
              position: 'relative',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '30px',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,248,240,0.95))',
              borderRadius: '25px',
              boxShadow: '0 20px 60px rgba(232, 160, 176, 0.3), 0 0 0 1px rgba(255,182,193,0.3)',
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: '2px solid var(--pink-main)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: 'var(--pink-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '3px 3px 0 var(--pink-light)',
                zIndex: 10
              }}
            >
              ✕
            </button>

            <h2 style={{
              fontFamily: 'ZCOOL XiaoWei, serif',
              color: 'var(--text-dark)',
              textAlign: 'center',
              marginBottom: '25px',
              fontSize: '1.8rem'
            }}>
              📸 {selectedDate}
            </h2>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '25px',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              {selectedDiaries.map((diary, index) => (
                <div
                  key={diary.id || index}
                  onMouseEnter={() => setHoveredDiaryId(diary.id)}
                  onMouseLeave={() => setHoveredDiaryId(null)}
                  style={{
                    position: 'relative',
                    background: 'white',
                    padding: '12px 12px 45px 12px',
                    boxShadow: hoveredDiaryId === diary.id ? '8px 8px 25px rgba(0,0,0,0.2)' : '4px 4px 15px rgba(0,0,0,0.12)',
                    transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index + 1)}deg)`,
                    maxWidth: '280px',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {hoveredDiaryId === diary.id && (
                    <button
                      onClick={() => handleDelete(diary.id)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        background: 'linear-gradient(145deg, #ff6b6b, #ee5a5a)',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '3px 3px 8px rgba(0,0,0,0.2)',
                        zIndex: 20,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ×
                    </button>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: `${15 + index * 8}px`,
                    fontSize: '1.8rem',
                    transform: `rotate(${tapeRotations[index % tapeRotations.length]}deg)`
                  }}>
                    {decorations[index % decorations.length]}
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: `${25 + index * 12}px`,
                    width: '70px',
                    height: '22px',
                    background: 'rgba(255, 220, 180, 0.7)',
                    transform: `rotate(${tapeRotations[(index + 2) % tapeRotations.length]}deg)`,
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.1)'
                  }}></div>

                  <div style={{
                    fontSize: '0.7rem',
                    color: '#aaa',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid #eee'
                  }}>
                    {diary.date}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                    {diary.moodLabels?.map((label, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))',
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="diary-content" style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '120px',
                    overflow: 'hidden'
                  }}>
                    {diary.content}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: '#ccc'
                  }}>
                    <span>📔 小董日记</span>
                    <span>#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedDiaries.map((diary, index) => (
              <DiaryCard key={diary.id || index} diary={diary} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarPage