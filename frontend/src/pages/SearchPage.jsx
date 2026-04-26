import React, { useState, useMemo } from 'react'
import DiaryCard from '../components/DiaryCard'

function SearchPage({ diaries }) {
  const [keyword, setKeyword] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searched, setSearched] = useState(false)
  const [selectedDiary, setSelectedDiary] = useState(null)

  const allMoodLabels = useMemo(() => {
    const labels = new Set()
    diaries.forEach(d => {
      if (d.moodLabels) d.moodLabels.forEach(l => labels.add(l))
    })
    return Array.from(labels)
  }, [diaries])

  const filtered = useMemo(() => {
    if (!searched) return []
    return diaries.filter(d => {
      if (keyword && !d.content?.toLowerCase().includes(keyword.toLowerCase())) return false
      if (selectedMood && !(d.moodLabels || []).includes(selectedMood)) return false
      if (dateFrom && d.date < dateFrom) return false
      if (dateTo && d.date > dateTo) return false
      return true
    })
  }, [diaries, keyword, selectedMood, dateFrom, dateTo, searched])

  const handleSearch = () => setSearched(true)

  const clearFilters = () => {
    setKeyword('')
    setSelectedMood('')
    setDateFrom('')
    setDateTo('')
    setSearched(false)
  }

  return (
    <div className="page-container">
      <div className="home-greeting" style={{ padding: '25px 20px' }}>
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-search"></use>
          </svg>
          搜索日记
        </h1>
        <p className="date">找到你的每一段记忆</p>
      </div>

      <div style={{
        background: 'linear-gradient(145deg, #ffffff, #fff8f5)',
        borderRadius: 25, padding: 25, marginBottom: 20,
        boxShadow: '10px 10px 30px rgba(232, 160, 176, 0.15), -8px -8px 20px rgba(255, 255, 255, 0.9)'
      }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input
            type="text"
            className="diary-input"
            placeholder="输入关键词搜索..."
            value={keyword}
            onChange={e => { setKeyword(e.target.value); setSearched(false) }}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <button className="diary-btn" onClick={handleSearch} style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
            <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
              <use xlinkHref="#icon-search"></use>
            </svg>
            搜索
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <span
            className={`tag ${!selectedMood ? 'selected' : ''}`}
            onClick={() => { setSelectedMood(''); setSearched(false) }}
            style={!selectedMood ? { background: 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))', color: 'white' } : {}}
          >
            全部心情
          </span>
          {allMoodLabels.map(label => (
            <span
              key={label}
              className={`tag tag-mood ${selectedMood === label ? 'selected' : ''}`}
              onClick={() => { setSelectedMood(selectedMood === label ? '' : label); setSearched(false) }}
              style={selectedMood === label ? { background: 'linear-gradient(145deg, var(--pink-main), var(--pink-deep))', color: 'white' } : {}}
            >
              {label}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>从</span>
            <input type="date" className="diary-input" style={{ width: 'auto', padding: '10px 14px' }} value={dateFrom} onChange={e => { setDateFrom(e.target.value); setSearched(false) }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>到</span>
            <input type="date" className="diary-input" style={{ width: 'auto', padding: '10px 14px' }} value={dateTo} onChange={e => { setDateTo(e.target.value); setSearched(false) }} />
          </div>
          {(keyword || selectedMood || dateFrom || dateTo) && (
            <button className="diary-btn diary-btn-secondary" onClick={clearFilters} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              清除
            </button>
          )}
        </div>
      </div>

      {searched && (
        <div style={{ marginBottom: 15, fontSize: '0.9rem', color: 'var(--pink-deep)' }}>
          找到 {filtered.length} 篇日记
        </div>
      )}

      {searched && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 50, color: '#ccc' }}>
          <p>没有找到匹配的日记</p>
        </div>
      )}

      {searched && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(diary => (
            <div
              key={diary.id}
              onClick={() => setSelectedDiary(diary)}
              style={{
                background: 'linear-gradient(145deg, #ffffff, #fff8f5)',
                borderRadius: 16, padding: '14px 18px',
                cursor: 'pointer',
                boxShadow: '4px 4px 12px rgba(232,160,176,0.1), -3px -3px 8px rgba(255,255,255,0.9)',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${diary.cardColor || '#FFB6C1'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--pink-deep)' }}>{diary.date}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {diary.moodLabels?.slice(0, 2).map((label, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--pink-main)' }}>{label}</span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {diary.content?.substring(0, 60)}{diary.content?.length > 60 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDiary && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,248,240,0.6)', backdropFilter: 'blur(15px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20
        }} onClick={() => setSelectedDiary(null)}>
          <div style={{
            position: 'relative', maxWidth: 500, width: '100%',
            maxHeight: '85vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedDiary(null)}
              style={{
                position: 'absolute', top: 10, right: 10, zIndex: 10,
                background: 'rgba(0,0,0,0.2)', border: 'none',
                width: 28, height: 28, borderRadius: '50%',
                color: '#fff', cursor: 'pointer', fontSize: '0.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >✕</button>
            <DiaryCard diary={selectedDiary} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
