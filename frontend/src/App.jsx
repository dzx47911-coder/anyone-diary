import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import NameModal from './components/NameModal'
import Home from './pages/Home'
import CalendarPage from './pages/CalendarPage'
import CardGenerator from './pages/CardGenerator'
import SummaryPage from './pages/SummaryPage'
import TimelinePage from './pages/TimelinePage'

function App() {
  const [diaries, setDiaries] = useState([])
  const [ownerName, setOwnerName] = useState('')
  const [showEditNameModal, setShowEditNameModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('xiaodong-diaries')
    if (saved) {
      setDiaries(JSON.parse(saved))
    }
    const savedName = localStorage.getItem('diary-owner-name')
    if (savedName) {
      setOwnerName(savedName)
    }
  }, [])

  const saveDiaries = (newDiaries) => {
    localStorage.setItem('xiaodong-diaries', JSON.stringify(newDiaries))
    setDiaries(newDiaries)
  }

  const addDiary = (diary) => {
    const newDiaries = [diary, ...diaries]
    saveDiaries(newDiaries)
    return diary
  }

  const deleteDiary = (diaryId) => {
    const newDiaries = diaries.filter(d => d.id !== diaryId)
    saveDiaries(newDiaries)
  }

  const handleNameSave = (name) => {
    setOwnerName(name)
  }

  return (
    <BrowserRouter>
      <div className="diary-app">
        <NameModal onSave={handleNameSave} />
        <NameModal isEdit={showEditNameModal} onSave={(name) => {
          handleNameSave(name)
          setShowEditNameModal(false)
        }} />
        <Header ownerName={ownerName} onEditName={() => setShowEditNameModal(true)} />
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