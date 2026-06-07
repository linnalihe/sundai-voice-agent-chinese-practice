'use client'

import { useRef, useCallback } from 'react'
import { IconSend, IconMicrophone } from '@tabler/icons-react'

interface InputZoneProps {
  value: string
  onChange: (v: string) => void
  onSend: (text: string) => void
  onMicToggle: () => void
  isRecording: boolean
  isSpeechSupported: boolean
  isLoading: boolean
  micHint: string
}

export function InputZone({
  value,
  onChange,
  onSend,
  onMicToggle,
  isRecording,
  isSpeechSupported,
  isLoading,
  micHint,
}: InputZoneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text || isLoading) return
    onSend(text)
    onChange('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, isLoading, onSend, onChange])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 90) + 'px'
  }

  return (
    <div className="px-4 pt-3 pb-4 border-t border-zinc-900/10 flex flex-col gap-2">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type in Chinese, pinyin, or English…"
          rows={1}
          className="flex-1 font-sans text-sm px-3 py-2.5 border border-zinc-900/18 rounded-[10px] bg-paper text-ink
            resize-none outline-none leading-relaxed min-h-[40px] max-h-[90px]
            placeholder:text-ink-faint focus:border-red-500 transition-colors"
          aria-label="Message input"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="w-10 h-10 rounded-[10px] bg-red-600 text-white flex items-center justify-center flex-shrink-0
            hover:bg-red-700 disabled:opacity-35 disabled:cursor-not-allowed transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Send message"
        >
          <IconSend size={16} />
        </button>
      </div>

      {isSpeechSupported && (
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMicToggle}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
              ${isRecording
                ? 'bg-red-600 border-red-600 border-[1.5px] text-white mic-recording'
                : 'border-[1.5px] border-zinc-900/18 bg-white text-ink-muted hover:border-red-400 hover:text-red-600'
              }`}
            aria-label={isRecording ? 'Stop recording' : 'Start speaking in Mandarin'}
          >
            <IconMicrophone size={20} />
          </button>
          <span className={`text-xs transition-colors ${isRecording ? 'text-red-600 font-medium' : 'text-ink-faint'}`}>
            {micHint}
          </span>
        </div>
      )}
    </div>
  )
}
