import React, { useEffect, useState } from 'react'

const floatingItems = [
  '🌸', '✨', '💫', '🌷', '🦋',
  '🌻', '🍀', '⭐', '🎀', '🌺'
]

function FloatingDecorations() {
  const [isMobile, setIsMobile] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      const count = 6
      const items = Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: floatingItems[i % floatingItems.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 20 + Math.random() * 15,
        delay: Math.random() * -10,
        size: 25 + Math.random() * 15,
        opacity: 0.1 + Math.random() * 0.08,
      }))
      setParticles(items)
    } else {
      const count = 10
      const items = Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: floatingItems[i % floatingItems.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * -20,
        size: 30 + Math.random() * 15,
        opacity: 0.15 + Math.random() * 0.1,
      }))
      setParticles(items)
    }
  }, [isMobile])

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: p.size,
              opacity: p.opacity,
              animation: `float-${p.id % 3} ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: p.size,
            opacity: p.opacity,
            filter: 'blur(0.5px)',
            animation: `float-${p.id % 5} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

export default FloatingDecorations