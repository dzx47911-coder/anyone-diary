import React, { useState } from 'react'

function Calendar({ diaries = [], onDateClick, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const hasDiary = (day) => {
    const dateStr = formatDate(day)
    return diaries.some(d => d.date === dateStr)
  }

  const isToday = (day) => {
    const today = new Date()
    return today.getFullYear() === year &&
           today.getMonth() === month &&
           today.getDate() === day
  }

  const isSelected = (day) => {
    return selectedDate === formatDate(day)
  }

  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

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

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月']

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{year}年 {monthNames[month]}</h2>
        <div className="calendar-nav">
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
        {days.map((d, i) => (
          <div
            key={i}
            className={`calendar-day ${!d.isCurrentMonth ? 'other-month' : ''} ${isToday(d.day) ? 'today' : ''} ${isSelected(d.day) ? 'selected' : ''} ${hasDiary(d.day) ? 'has-diary' : ''}`}
            onClick={() => d.isCurrentMonth && onDateClick?.(formatDate(d.day))}
          >
            {d.day}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--pink-deep)' }}>
        <span style={{ marginRight: '20px' }}>● 有日记</span>
        <span style={{ background: 'var(--pink-main)', color: 'white', padding: '2px 8px', borderRadius: '10px', marginRight: '10px' }}>今天</span>
      </div>
    </div>
  )
}

export default Calendar