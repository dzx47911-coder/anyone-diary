import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import NameModal from './components/NameModal'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import CalendarPage from './pages/CalendarPage'
import CardGenerator from './pages/CardGenerator'
import SummaryPage from './pages/SummaryPage'
import TimelinePage from './pages/TimelinePage'

const API_URL = 'https://anyone-diary.onrender.com'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('diary-token'))
  const [userId, setUserId] = useState(() => localStorage.getItem('diary-user-id'))
  const [diaries, setDiaries] = useState([])
  const [ownerName, setOwnerName] = useState('')
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchDiaries()
      fetchUserInfo()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchDiaries = async () => {
    try {
      const res = await fetch(`${API_URL}/diaries`, {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const fetchUserInfo = async () => {
    try {
      const savedName = localStorage.getItem('diary-owner-name')
      if (savedName) setOwnerName(savedName)
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  }

  const handleLogin = (newToken, newUserId) => {
    setToken(newToken)
    setUserId(newUserId)
    fetchDiaries()
    fetchUserInfo()
  }

  const handleLogout = () => {
    localStorage.removeItem('diary-token')
    localStorage.removeItem('diary-user-id')
    setToken(null)
    setUserId(null)
    setDiaries([])
  }

  const saveDiaries = async (newDiaries) => {
    setDiaries(newDiaries)
  }

  const addDiary = async (diary) => {
    try {
      const res = await fetch(`${API_URL}/diaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(diary)
      })
      if (res.ok) {
        const savedDiary = await res.json()
        const newDiaries = [savedDiary, ...diaries]
        setDiaries(newDiaries)
        return savedDiary
      }
    } catch (err) {
      console.error('保存日记失败:', err)
    }
    return diary
  }

  const deleteDiary = async (diaryId) => {
    try {
      await fetch(`${API_URL}/diaries/${diaryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const newDiaries = diaries.filter(d => d.id !== diaryId)
      setDiaries(newDiaries)
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
        <NameModal onSave={handleNameSave} />
        <NameModal isEdit={showEditNameModal} onSave={(name) => {
          handleNameSave(name)
          setShowEditNameModal(false)
        }} />
        <Header
          ownerName={ownerName}
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App