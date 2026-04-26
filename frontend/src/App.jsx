import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import NameModal from './components/NameModal'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import CalendarPage from './pages/CalendarPage'
import CardGenerator from './pages/CardGenerator'
import SummaryPage from './pages/SummaryPage'
import TimelinePage from './pages/TimelinePage'
import SearchPage from './pages/SearchPage'

const API_URL = 'https://anyone-diary.onrender.com'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('diary-token'))
  const [userId, setUserId] = useState(() => localStorage.getItem('diary-user-id'))
  const [username, setUsername] = useState(() => localStorage.getItem('diary-username'))
  const [diaries, setDiaries] = useState([])
  const [ownerName, setOwnerName] = useState(() => localStorage.getItem('diary-owner-name') || '')
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchDiaries()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchDiaries = async () => {
    try {
      const currentToken = localStorage.getItem('diary-token')
      const res = await fetch(`${API_URL}/api/diaries`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      })
      if (res.ok) {
        const data = await res.json()
        setDiaries(data)
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch (err) {
      console.error('获取日记失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (newToken, newUserId, newUsername) => {
    localStorage.removeItem('diary-owner-name')
    setOwnerName('')
    setToken(newToken)
    setUserId(newUserId)
    setUsername(newUsername)
  }

  const handleLogout = () => {
    localStorage.removeItem('diary-token')
    localStorage.removeItem('diary-user-id')
    localStorage.removeItem('diary-username')
    setToken(null)
    setUserId(null)
    setUsername(null)
    setDiaries([])
  }

  const addDiary = async (diary) => {
    try {
      const res = await fetch(`${API_URL}/api/diaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(diary)
      })
      if (res.ok) {
        const savedDiary = await res.json()
        setDiaries(prev => [savedDiary, ...prev])
        return savedDiary
      } else {
        console.error('保存失败，服务器返回:', res.status)
      }
    } catch (err) {
      console.error('保存日记失败:', err)
    }
    return null
  }

  const deleteDiary = async (diaryId) => {
    try {
      const res = await fetch(`${API_URL}/api/diaries/${diaryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setDiaries(prev => prev.filter(d => d.id !== diaryId))
      }
    } catch (err) {
      console.error('删除日记失败:', err)
    }
  }

  const handleNameSave = (name) => {
    setOwnerName(name)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4E1 100%)'
      }}>
        <span style={{ fontSize: 48 }}>🌸</span>
      </div>
    )
  }

  if (!token) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <div className="diary-app">
        {(showEditNameModal || !ownerName) && (
          <NameModal
            isEdit={showEditNameModal}
            onSave={(name) => {
              handleNameSave(name)
              setShowEditNameModal(false)
            }}
            onClose={() => setShowEditNameModal(false)}
          />
        )}
        <Header
          ownerName={ownerName}
          username={username}
          onEditName={() => setShowEditNameModal(true)}
          onLogout={handleLogout}
        />
        <main className="diary-main">
          <Routes>
            <Route path="/" element={<Home diaries={diaries} />} />
            <Route path="/calendar" element={<CalendarPage diaries={diaries} onDelete={deleteDiary} />} />
            <Route path="/generate" element={<CardGenerator onSave={addDiary} />} />
            <Route path="/summary" element={<SummaryPage diaries={diaries} />} />
            <Route path="/timeline" element={<TimelinePage diaries={diaries} />} />
            <Route path="/search" element={<SearchPage diaries={diaries} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
