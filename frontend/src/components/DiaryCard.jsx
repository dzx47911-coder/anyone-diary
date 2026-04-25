import React from 'react'

function DiaryCard({ diary }) {
  const moodLabels = diary.moodLabels || (diary.moods ? diary.moods.map(m => m) : [])

  return (
    <div className="diary-card">
      <div className="tape tape-tl"></div>
      <div className="tape tape-tr"></div>

      <div className="date-label">
        🌼 {diary.date}
      </div>

      <div style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {moodLabels.map((label, i) => (
          <span key={i} className="tag tag-mood" style={{ background: 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))', color: 'white' }}>
            {label}
          </span>
        ))}
      </div>

      <div className="diary-content" style={{
        fontSize: '1.15rem',
        lineHeight: '2.2',
        color: 'var(--text-dark)',
        whiteSpace: 'pre-wrap'
      }}>
        {diary.content}
      </div>

      <div style={{ marginTop: '25px', textAlign: 'right' }}>
        <div className="post-it" style={{ transform: 'rotate(-2deg)' }}>
          💭 今日记忆
        </div>
      </div>

      <span style={{
        position: 'absolute',
        bottom: '18px',
        left: '25px',
        fontSize: '0.85rem',
        color: 'var(--pink-deep)',
        opacity: 0.6
      }}>
        ✨ 小董日记
      </span>
    </div>
  )
}

export default DiaryCard