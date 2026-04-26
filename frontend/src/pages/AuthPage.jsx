import React, { useState } from 'react'

const API_URL = 'https://anyone-diary.onrender.com'

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '请求失败')
      }

      localStorage.setItem('diary-token', data.token)
      localStorage.setItem('diary-user-id', data.userId)
      localStorage.setItem('diary-username', username)
      onLogin(data.token, data.userId, username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4E1 100%)',
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 8px 32px rgba(255, 182, 193, 0.3)',
        maxWidth: 400,
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 48 }}>🌸</span>
          <h2 style={{
            color: '#FFB6C1',
            margin: '16px 0 8px',
            fontFamily: 'ZCOOL KuaiLe'
          }}>
            {isLogin ? '欢迎回来' : '加入日记本'}
          </h2>
          <p style={{ color: '#999', fontSize: 14 }}>
            {isLogin ? '登录你的账号' : '创建账号来同步日记'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FFE4E1',
            color: '#D4706A',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#666', fontSize: 14 }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #FFE4E1',
                borderRadius: 12,
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFB6C1'}
              onBlur={(e) => e.target.style.borderColor = '#FFE4E1'}
            />
          </div>

          <div style={{ marginBottom: 24, position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#666', fontSize: 14 }}>
              密码
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 50px 14px 16px',
                border: '2px solid #FFE4E1',
                borderRadius: 12,
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFB6C1'}
              onBlur={(e) => e.target.style.borderColor = '#FFE4E1'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 14,
                top: 38,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
                opacity: 0.5
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '处理中...' : (isLogin ? '登录 ✨' : '注册 ✨')}
          </button>
        </form>

        {isLogin && (
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => setShowPasswordReset(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: 13,
                textDecoration: 'underline'
              }}
            >
              忘记密码？
            </button>
          </p>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, color: '#999', fontSize: 14 }}>
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFB6C1',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginLeft: 8
            }}
          >
            {isLogin ? '注册' : '登录'}
          </button>
        </p>
      </div>

      {showPasswordReset && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 100
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.3)',
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowPasswordReset(false)}
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: '#FFB6C1'
              }}
            >
              ←
            </button>
            <span style={{ fontSize: 48 }}>🔑</span>
            <h2 style={{
              color: '#FFB6C1',
              margin: '16px 0 8px',
              fontFamily: 'ZCOOL KuaiLe'
            }}>
              忘记密码
            </h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
              忘记密码功能需要邮箱验证<br />
              请联系管理员重置密码
            </p>
            <button
              onClick={() => setShowPasswordReset(false)}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              返回登录
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthPage