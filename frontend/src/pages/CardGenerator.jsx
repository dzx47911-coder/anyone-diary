import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DiaryInput from '../components/DiaryInput'
import DiaryCard, { cardColors } from '../components/DiaryCard'
import { exportDiaryAsImage } from '../utils/exportDiary'

function CardGenerator({ onSave }) {
  const navigate = useNavigate()
  const [previewDiary, setPreviewDiary] = useState(null)
  const [lastFormData, setLastFormData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [showExportConfirm, setShowExportConfirm] = useState(false)
  const cardRef = useRef(null)

  const handlePreview = async (data) => {
    setLastFormData(data)
    setPreviewDiary({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    })
  }

  const handleSave = async () => {
    if (!previewDiary) return
    setSaving(true)
    setSaveError('')
    try {
      const result = await onSave(previewDiary)
      if (result) {
        navigate('/calendar')
      } else {
        setSaveError('保存失败，请重试')
      }
    } catch (err) {
      setSaveError('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleColorChange = (color) => {
    if (previewDiary) {
      setPreviewDiary({ ...previewDiary, cardColor: color })
    }
  }

  const handleExport = async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      await exportDiaryAsImage(cardRef.current, `diary-${previewDiary.date}`, previewDiary.cardColor)
    } catch (err) {
      console.error('导出失败:', err)
    } finally {
      setExporting(false)
    }
  }

  const handleBackToEdit = () => {
    setPreviewDiary(null)
    setSaveError('')
  }

  return (
    <div className="page-container">
      <div className="home-greeting" style={{ padding: '30px 20px' }}>
        <h1>
          <svg style={{ width: 36, height: 36, verticalAlign: 'middle', marginRight: 10 }}>
            <use xlinkHref="#icon-edit"></use>
          </svg>
          写日记
        </h1>
        <p className="date">记录今天的美好瞬间</p>
      </div>

      {!previewDiary ? (
        <div style={{
          background: 'linear-gradient(145deg, #ffffff, #fff8f5)',
          padding: 35,
          borderRadius: 25,
          boxShadow: '10px 10px 30px rgba(232, 160, 176, 0.15), -8px -8px 20px rgba(255, 255, 255, 0.9)',
          maxWidth: 750,
          margin: '0 auto'
        }}>
          {saveError && (
            <div style={{
              background: '#FFE4E1', color: '#D4706A',
              padding: '12px 16px', borderRadius: 12,
              marginBottom: 20, fontSize: 14
            }}>
              {saveError}
            </div>
          )}
          <DiaryInput
            onSubmit={handlePreview}
            submitText="生成卡片"
            initialData={lastFormData}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'ZCOOL XiaoWei, serif', color: 'var(--pink-deep)', marginBottom: '20px' }}>
            预览卡片
          </h2>

          <DiaryCard diary={previewDiary} cardRef={cardRef} />

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {cardColors.map(c => (
              <div
                key={c.color}
                onClick={() => handleColorChange(c.color)}
                style={{
                  width: previewDiary.cardColor === c.color ? 22 : 14,
                  height: previewDiary.cardColor === c.color ? 22 : 14,
                  borderRadius: '50%',
                  background: c.color,
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: previewDiary.cardColor === c.color
                    ? `0 0 0 2px ${c.color}88, 0 3px 10px ${c.color}66`
                    : 'none',
                  transition: 'all 0.25s ease',
                  opacity: previewDiary.cardColor === c.color ? 1 : 0.6,
                }}
              />
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="diary-btn diary-btn-secondary" onClick={handleBackToEdit}>
              返回编辑
            </button>
            <button className="diary-btn diary-btn-secondary" onClick={() => setShowExportConfirm(true)} disabled={exporting}>
              <svg style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 4 }}>
                <use xlinkHref="#icon-camera"></use>
              </svg>
              {exporting ? '导出中...' : '导出图片'}
            </button>
            <button className="diary-btn" onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      )}

      {showExportConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowExportConfirm(false)}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 30,
            maxWidth: 300, textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 24 }}>是否导出为图片？</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowExportConfirm(false)}
                style={{
                  padding: '10px 24px', border: '2px solid #FFE4E1',
                  borderRadius: 12, background: '#fff', cursor: 'pointer', fontSize: 14
                }}
              >取消</button>
              <button
                onClick={async () => {
                  setShowExportConfirm(false)
                  await handleExport()
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

export default CardGenerator
