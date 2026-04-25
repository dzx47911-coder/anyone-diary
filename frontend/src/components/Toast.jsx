import React, { useEffect } from 'react'

function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  )
}

export default Toast