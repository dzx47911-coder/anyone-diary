import React, { useState, useEffect } from 'react'

function NameModal({ onSave }) {
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem('diary-owner-name')
    if (!savedName) {
      setIsOpen(true)
    } else {
      onSave(savedName)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      localStorage.setItem('diary-owner-name', name.trim())
      onSave(name.trim())
      setIsOpen(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="name-modal-overlay">
      <div className="name-modal">
        <div className="name-modal-decoration">
          <span>🌸</span>
          <span>✨</span>
          <span>💫</span>
        </div>

        <h2>欢迎来到你的日记本</h2>
        <p>给自己取个名字吧</p>

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
            开始日记 ✨
          </button>
        </form>
      </div>
    </div>
  )
}

export default NameModal