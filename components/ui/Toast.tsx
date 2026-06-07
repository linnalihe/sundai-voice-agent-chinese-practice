'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string | null
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) { setVisible(false); return }
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 3000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 toast-in' : 'opacity-0 translate-y-3'
      }`}
    >
      <div className="bg-zinc-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg whitespace-nowrap">
        {message}
      </div>
    </div>
  )
}
