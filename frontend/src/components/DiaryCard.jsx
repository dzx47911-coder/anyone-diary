import React from 'react'

const cardColors = [
  { name: '樱花粉', color: '#FFB6C1', light: '#FFF0F3' },
  { name: '薄荷绿', color: '#A8D8B9', light: '#F0FDF4' },
  { name: '奶油黄', color: '#FFE5A0', light: '#FFFDF0' },
  { name: '薰衣草紫', color: '#D4B8E0', light: '#F8F0FF' },
  { name: '天空蓝', color: '#A8D4E6', light: '#F0F8FF' },
  { name: '蜜桃橙', color: '#FFCBA4', light: '#FFF8F0' },
  { name: '抹茶绿', color: '#C5E1A5', light: '#F5FBF0' },
  { name: '云朵白', color: '#E8E0D8', light: '#F5F0EB' },
]

function getColorPair(cardColor) {
  const found = cardColors.find(c => c.color === cardColor)
  if (found) return found
  return cardColors[0]
}

function DiaryCard({ diary, cardRef }) {
  const moodLabels = diary.moodLabels || (diary.moods ? diary.moods.map(m => m) : [])
  const colorPair = getColorPair(diary.cardColor || '#FFB6C1')

  return (
    <div
      className="diary-card"
      ref={cardRef}
      style={{
        background: `linear-gradient(145deg, ${colorPair.light}, white)`,
        borderTop: `4px solid ${colorPair.color}`,
      }}
    >
      <div className="tape tape-tl" style={{ background: `${colorPair.color}88` }}></div>
      <div className="tape tape-tr" style={{ background: `${colorPair.color}88` }}></div>

      <div className="date-label" style={{ color: colorPair.color }}>
        🌼 {diary.date}
      </div>

      <div style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {moodLabels.map((label, i) => (
          <span key={i} className="tag tag-mood" style={{
            background: `linear-gradient(145deg, ${colorPair.color}, ${colorPair.color}cc)`,
            color: 'white'
          }}>
            {label}
          </span>
        ))}
      </div>

      <div className="diary-content" style={{
        fontSize: '1.15rem',
        lineHeight: '2.2',
        color: '#4a4a4a',
        whiteSpace: 'pre-wrap'
      }}>
        {diary.content}
      </div>

      <div style={{ marginTop: '25px', textAlign: 'right' }}>
        <div className="post-it" style={{
          transform: 'rotate(-2deg)',
          background: `${colorPair.color}33`,
          color: colorPair.color
        }}>
          💭 今日记忆
        </div>
      </div>

      <span style={{
        position: 'absolute',
        bottom: '18px',
        left: '25px',
        fontSize: '0.85rem',
        color: colorPair.color,
        opacity: 0.6
      }}>
        ✨ Anyone diary
      </span>
    </div>
  )
}

export { cardColors }
export default DiaryCard
