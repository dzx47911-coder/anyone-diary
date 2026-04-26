import React, { useState, useEffect } from 'react'

function NameModal({ onSave, isEdit = false }) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isEdit) {
      setName(localStorage.getItem('diary-owner-name') || '')
    }
  }, [isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      localStorage.setItem('diary-owner-name', name.trim())
      onSave(name.trim())
    }
  }

  return (
    <div className="name-modal-overlay">
      <div className="name-modal">
        <div className="name-modal-decoration">
          <span>🌸</span>
          <span>✨</span>
          <span>💫</span>
        </div>

        <h2>{isEdit ? '修改日记本名称' : '欢迎来到你的日记本'}</h2>
        <p>{isEdit ? '给日记本取个新名字吧' : '给自己取个名字吧'}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的名字"
            className="name-input"
            autoFocus
            maxLength={10}
          />
          <button type="submit" className="diary-btn" disabled={!name.trim()}>
            {isEdit ? '保存 ✨' : '开始日记 ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NameModal
