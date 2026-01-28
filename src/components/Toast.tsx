// src/components/Toast.tsx
import { useState, useEffect } from 'react'

interface ToastProps {
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  className?: string
}

export default function Toast({
  title,
  message,
  duration = 6000,
  onClose,
  className = '',
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        w-full max-w-lg mx-4
        bg-gradient-to-r from-amber-600/90 to-amber-700/90
        backdrop-blur-md text-white rounded-2xl shadow-2xl
        border border-amber-500/40 overflow-hidden
        ${className}
      `}
    >
      {/* Plain X close button */}
      <button
        onClick={() => {
          setVisible(false)
          onClose?.()
        }}
        className="
          absolute top-3 right-4 text-white/80 hover:text-white
          text-xl font-bold leading-none
          transition-colors duration-200
        "
        aria-label="Close"
      >
        X
      </button>

      {/* Content */}
      <div className="p-5 pr-12">
        {title && (
          <h4 className="text-lg font-bold mb-1 tracking-wide">{title}</h4>
        )}
        <p className="text-sm leading-relaxed opacity-95">{message}</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/30">
        <div
          className="h-full bg-white animate-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  )
}