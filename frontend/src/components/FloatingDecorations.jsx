import React, { useEffect, useRef, useState } from 'react'

const floatingItems = [
  { emoji: '🌸', size: 40 },
  { emoji: '✨', size: 30 },
  { emoji: '💫', size: 35 },
  { emoji: '🌷', size: 38 },
  { emoji: '🦋', size: 32 },
  { emoji: '🌻', size: 36 },
  { emoji: '🍀', size: 28 },
  { emoji: '⭐', size: 25 },
  { emoji: '🎀', size: 34 },
  { emoji: '🎈', size: 30 },
  { emoji: '💭', size: 28 },
  { emoji: '🌺', size: 36 },
]

function FloatingDecorations() {
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      ...floatingItems[i % floatingItems.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
      rotate: Math.random() * 360,
      opacity: 0.2 + Math.random() * 0.1,
    }))
    setParticles(items)

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {particles.map((p) => (
        <FloatingItem key={p.id} particle={p} mouseRef={mouseRef} />
      ))}
    </div>
  )
}

function FloatingItem({ particle, mouseRef }) {
  const itemRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let animationId
    let currentX = particle.x
    let currentY = particle.y
    let velocityX = 0
    let velocityY = 0

    const animate = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect()
        const itemX = rect.left + rect.width / 2
        const itemY = rect.top + rect.height / 2

        const dx = mouseRef.current.x - itemX
        const dy = mouseRef.current.y - itemY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.8
          velocityX -= (dx / distance) * force
          velocityY -= (dy / distance) * force
        }

        velocityX *= 0.95
        velocityY *= 0.95

        currentX += velocityX
        currentY += velocityY

        if (currentX < -10) currentX = 110
        if (currentX > 110) currentX = -10
        if (currentY < -10) currentY = 110
        if (currentY > 110) currentY = -10

        itemRef.current.style.left = `${currentX}%`
        itemRef.current.style.top = `${currentY}%`
        itemRef.current.style.transform = `translate(-50%, -50%) rotate(${particle.rotate + currentX * 3}deg) scale(${isHovered ? 1.3 : 1})`
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [particle, isHovered])

  return (
    <div
      ref={itemRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: particle.size,
        opacity: particle.opacity,
        filter: 'blur(1px)',
        transition: 'opacity 0.3s',
        animation: `float-${particle.id % 5} ${particle.duration}s ease-in-out infinite`,
        animationDelay: `${particle.delay}s`,
      }}
    >
      {particle.emoji}
    </div>
  )
}

export default FloatingDecorations