import React, { useState, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import DiaryCard from '../components/DiaryCard'
import { exportDiaryAsImage } from '../utils/exportDiary'

function CalendarPage({ diaries, onDelete }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date'))
  const [selectedDiaries, setSelectedDiaries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [hoveredDiaryId, setHoveredDiaryId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportConfirmId, setExportConfirmId] = useState(null)
  const [emptyDatePopup, setEmptyDatePopup] = useState(null)
  const cardRefs = useRef({})

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
      setEmptyDatePopup(null)
      setSelectedDate(date)
      setSelectedDiaries(diariesForDate)
      setShowModal(true)
    } else {
      setEmptyDatePopup(date)
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
                onClick={() => d.isCurrentMonth && handleDateClick(dateStr)}
                style={d.isCurrentMonth ? { cursor: 'pointer' } : {}}
              >
                {d.day}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--pink-deep)', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ border: '2px solid var(--pink-main)', padding: '2px 8px', borderRadius: '5px' }}>今天</span>
          <span>共 {diaries.length} 篇日记</span>
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
            查看总结
          </Link>
        </div>
      </div>

      {emptyDatePopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 100
        }} onClick={() => setEmptyDatePopup(null)}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '30px 40px',
            textAlign: 'center', boxShadow: '0 15px 50px rgba(0,0,0,0.12)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setEmptyDatePopup(null)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 16, color: '#ccc',
              }}
            >✕</button>
            <p style={{ fontSize: 15, color: '#999', marginBottom: 16 }}>{emptyDatePopup} 暂无日记</p>
            <button
              className="diary-btn"
              onClick={() => { setEmptyDatePopup(null); navigate('/generate') }}
              style={{ padding: '10px 24px', fontSize: 14 }}
            >
              立即写一篇
            </button>
          </div>
        </div>
      )}

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
                    boxShadow: '4px 4px 15px rgba(0,0,0,0.12)',
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
                        top: '-6px',
                        right: '-6px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(0,0,0,0.25)',
                        color: 'white',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 20,
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      ✕
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
                    <span>📔 Anyone diary</span>
                    <span>#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedDiaries.map((diary, index) => (
              <div key={diary.id || index} style={{ marginBottom: 20 }}>
                <DiaryCard diary={diary} cardRef={el => cardRefs.current[diary.id] = el} />
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <button
                    className="diary-btn diary-btn-secondary"
                    disabled={exporting}
                    onClick={() => setExportConfirmId(diary.id)}
                    style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                  >
                    <svg style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 4 }}>
                      <use xlinkHref="#icon-camera"></use>
                    </svg>
                    {exporting ? '导出中...' : '导出图片'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {exportConfirmId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }} onClick={() => setExportConfirmId(null)}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 30,
            maxWidth: 300, textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 24 }}>是否导出为图片？</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setExportConfirmId(null)}
                style={{
                  padding: '10px 24px', border: '2px solid #FFE4E1',
                  borderRadius: 12, background: '#fff', cursor: 'pointer', fontSize: 14
                }}
              >取消</button>
              <button
                onClick={async () => {
                  const id = exportConfirmId
                  const diary = selectedDiaries.find(d => d.id === id)
                  setExportConfirmId(null)
                  setExporting(true)
                  try {
                    await exportDiaryAsImage(cardRefs.current[id], `diary-${diary?.date || 'export'}`, diary?.cardColor)
                  } catch (err) { console.error(err) }
                  setExporting(false)
                }}
                style={{
                  padding: '10px 24px', border: 'none', borderRadius: 12,
                  background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                  color: '#fff', cursor: 'pointer', fontSize: 14
                }}
              >确认导出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarPage