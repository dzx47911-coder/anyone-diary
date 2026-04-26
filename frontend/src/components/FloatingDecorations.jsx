import React, { useEffect, useState, useRef } from 'react'

const floatingItems = [
  '🌸', '✨', '💫', '🌷', '🦋',
  '🌻', '🍀', '⭐', '🎀', '🌺'
]

function FloatingDecorations() {
  const [isMobile, setIsMobile] = useState(false)
  const [particles, setParticles] = useState([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const offsetsRef = useRef({})
  const wrappersRef = useRef({})
  const rafRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const count = isMobile ? 6 : 10
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: floatingItems[i % floatingItems.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: isMobile ? 6 + Math.random() * 6 : 5 + Math.random() * 7,
      delay: Math.random() * -10,
      size: isMobile ? 25 + Math.random() * 15 : 30 + Math.random() * 15,
      opacity: isMobile ? 0.1 + Math.random() * 0.08 : 0.15 + Math.random() * 0.1,
    }))
    setParticles(items)
  }, [isMobile])

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (particles.length === 0) return

    const fleeRadius = 130
    const fleeStrength = 90

    const tick = () => {
      const mouse = mouseRef.current

      particles.forEach(p => {
        const wrapper = wrappersRef.current[p.id]
        if (!wrapper) return

        const inner = wrapper.firstChild
        if (!inner) return

        const rect = inner.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = cx - mouse.x
        const dy = cy - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        let off = offsetsRef.current[p.id] || { x: 0, y: 0 }

        if (dist < fleeRadius && dist > 0) {
          const force = (1 - dist / fleeRadius) * fleeStrength
          off = { x: (dx / dist) * force, y: (dy / dist) * force }
        } else {
          off = { x: off.x * 0.93, y: off.y * 0.93 }
          if (Math.abs(off.x) < 0.3 && Math.abs(off.y) < 0.3) off = { x: 0, y: 0 }
        }

        offsetsRef.current[p.id] = off
        wrapper.style.transform = `translate(${off.x}px, ${off.y}px)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [particles])

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      {particles.map((p) => (
        <div
          key={p.id}
          ref={el => wrappersRef.current[p.id] = el}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            willChange: 'transform',
          }}
        >
          <div style={{
            fontSize: p.size,
            opacity: p.opacity,
            filter: isMobile ? 'none' : 'blur(0.5px)',
            animation: `float-${p.id % (isMobile ? 3 : 5)} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}>
            {p.emoji}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FloatingDecorations
