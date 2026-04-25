import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DiaryInput from '../components/DiaryInput'
import DiaryCard from '../components/DiaryCard'

function CardGenerator({ onSave }) {
  const navigate = useNavigate()
  const [previewDiary, setPreviewDiary] = useState(null)

  const handleSubmit = async (data) => {
    const newDiary = {
      ...data,
      id: Date.now(), // Generate unique ID
      createdAt: new Date().toISOString()
    }
    onSave(newDiary)
    setPreviewDiary(newDiary)
  }

  const handleContinue = () => {
    setPreviewDiary(null)
  }

  return (
    <div className="page-container">
      <div className="home-greeting">
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-edit"></use>
          </svg>
          写日记
        </h1>
        <p className="date">记录今天的美好瞬间</p>
      </div>

      {!previewDiary ? (
        <div className="generator-layout">
          <div className="generator-form">
            <DiaryInput onSubmit={handleSubmit} submitText="生成卡片" />
          </div>
          <div className="generator-preview">
            <h3 style={{ fontFamily: 'ZCOOL XiaoWei, serif', color: 'var(--pink-deep)', marginBottom: '20px' }}>
              <svg style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 8 }}>
                <use xlinkHref="#icon-star"></use>
              </svg>
              卡片预览
            </h3>
            <div className="diary-card" style={{ maxWidth: '400px', opacity: 0.7 }}>
              <div className="date-label">🌼 选择日期</div>
              <div style={{ margin: '20px 0' }}>
                <span className="tag tag-mood">😊 幸福</span>
                <span className="tag tag-mood">😌 平静</span>
              </div>
              <div style={{ color: '#ccc', fontStyle: 'italic' }}>
                在这里输入日记内容...
              </div>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--pink-deep)' }}>
              填写左侧表单后点击"生成卡片"
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'ZCOOL XiaoWei, serif', color: 'var(--pink-deep)', marginBottom: '20px' }}>
            <svg style={{ width: 28, height: 28, verticalAlign: 'middle', marginRight: 8 }}>
              <use xlinkHref="#icon-star"></use>
            </svg>
            日记卡片已生成！
          </h2>
          <DiaryCard diary={previewDiary} />
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="diary-btn diary-btn-secondary" onClick={handleContinue}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-plus"></use>
              </svg>
              继续写日记
            </button>
            <button
              className="diary-btn"
              onClick={() => navigate('/calendar')}
            >
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-calendar"></use>
              </svg>
              查看日历 →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardGenerator