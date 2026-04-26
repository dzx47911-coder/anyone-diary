import React, { useState } from 'react'
import Toast from './Toast'
import { cardColors } from './DiaryCard'

function DiaryInput({ onSubmit, initialData, submitText = '生成卡片' }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(initialData?.date || today)
  const [selectedMoods, setSelectedMoods] = useState(initialData?.moods || [])
  const [customMoods, setCustomMoods] = useState(initialData?.customMoods || [])
  const [content, setContent] = useState(initialData?.content || '')
  const [cardColor, setCardColor] = useState(initialData?.cardColor || '#FFB6C1')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [showModal, setShowModal] = useState(false)
  const [newMoodText, setNewMoodText] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const defaultMoods = [
    { id: 'happy', label: '😊 幸福', emoji: '😊' },
    { id: 'calm', label: '😌 平静', emoji: '😌' },
    { id: 'excited', label: '🤩 期待', emoji: '🤩' },
    { id: 'sad', label: '😢 忧伤', emoji: '😢' },
    { id: 'anxious', label: '😰 焦虑', emoji: '😰' },
    { id: 'grateful', label: '🥰 感恩', emoji: '🥰' }
  ]

  const allMoods = [
    ...defaultMoods,
    ...customMoods.map((m, i) => ({ id: `custom-${i}`, label: m, emoji: '💝' }))
  ]

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 2000)
  }

  const toggleMood = (moodId, moodLabel) => {
    setSelectedMoods(prev => {
      if (prev.includes(moodId)) {
        return prev.filter(id => id !== moodId)
      } else {
        showToast(`已添加：${moodLabel}`)
        return [...prev, moodId]
      }
    })
  }

  const handleAddCustomMood = () => {
    if (!newMoodText.trim()) return
    const customMood = newMoodText.trim()
    if (!customMoods.includes(customMood)) {
      setCustomMoods([...customMoods, customMood])
      showToast(`已添加自定义标签：${customMood}`)
    }
    setNewMoodText('')
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const selectedMoodLabels = selectedMoods.map(id => {
      const mood = allMoods.find(m => m.id === id)
      return mood ? mood.label : id
    })
    await onSubmit({
      date,
      moods: selectedMoods,
      moodLabels: selectedMoodLabels,
      customMoods,
      cardColor,
      content
    })
    setLoading(false)
  }

  return (
    <>
      <form className="diary-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <svg style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }}>
              <use xlinkHref="#icon-calendar"></use>
            </svg>
            日期
          </label>
          <input
            type="date"
            className="diary-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }}>
              <use xlinkHref="#icon-edit"></use>
            </svg>
            日记内容
            <div style={{ position: 'relative', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.8rem', color: '#bbb' }}>颜色</span>
              <div
                onClick={(e) => { e.stopPropagation(); setShowColorPicker(!showColorPicker) }}
                title="选择卡片颜色"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: cardColor,
                  cursor: 'pointer',
                  boxShadow: `0 2px 8px ${cardColor}66`,
                  transition: 'all 0.2s ease',
                }}
              />
              {showColorPicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 34,
                    right: 0,
                    background: '#fff',
                    borderRadius: 16,
                    padding: 14,
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    width: 200,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    zIndex: 10,
                  }}
                >
                  {cardColors.map(c => (
                    <div
                      key={c.color}
                      onClick={() => { setCardColor(c.color); setShowColorPicker(false) }}
                      title={c.name}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: c.color,
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: cardColor === c.color
                          ? `0 0 0 3px ${c.color}88, 0 4px 12px ${c.color}66`
                          : `0 2px 4px ${c.color}33`,
                        transition: 'all 0.2s ease',
                        transform: cardColor === c.color ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </label>
          <textarea
            className="diary-input diary-textarea"
            placeholder="今天发生了什么让你开心的事吗？"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={() => setShowColorPicker(false)}
          />
        </div>

        <div className="form-group">
          <label>
            <svg style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }}>
              <use xlinkHref="#icon-heart"></use>
            </svg>
            心情标签
          </label>
          <div className="form-group-inline">
            {allMoods.map(mood => (
              <span
                key={mood.id}
                className={`tag tag-mood ${selectedMoods.includes(mood.id) ? 'selected' : ''}`}
                onClick={() => toggleMood(mood.id, mood.label)}
                style={selectedMoods.includes(mood.id) ? { background: `linear-gradient(145deg, var(--pink-main), var(--pink-deep))`, color: 'white' } : {}}
              >
                {mood.label}
              </span>
            ))}
            <span
              className="tag tag-add"
              onClick={() => setShowModal(true)}
            >
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-plus"></use>
              </svg>
              添加标签
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="diary-btn"
          disabled={loading || !content.trim()}
        >
          {loading ? '保存中...' : submitText}
        </button>
      </form>

      {/* Tag input modal */}
      <div className={`tag-input-modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
        <div className="tag-input-content" onClick={e => e.stopPropagation()}>
          <h3>
            <svg style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 8 }}>
              <use xlinkHref="#icon-plus"></use>
            </svg>
            添加自定义心情
          </h3>
          <input
            type="text"
            className="diary-input"
            placeholder="输入心情标签..."
            value={newMoodText}
            onChange={(e) => setNewMoodText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomMood()}
            autoFocus
          />
          <div className="tag-input-actions" style={{ marginTop: 20 }}>
            <button className="diary-btn" onClick={handleAddCustomMood}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-check"></use>
              </svg>
              添加
            </button>
            <button className="diary-btn diary-btn-secondary" onClick={() => setShowModal(false)}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-close"></use>
              </svg>
              取消
            </button>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  )
}

export default DiaryInput