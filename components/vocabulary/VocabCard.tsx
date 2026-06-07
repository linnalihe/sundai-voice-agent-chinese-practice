'use client'

import { useState } from 'react'
import type { VocabWord } from '@/types'

interface VocabCardProps {
  word: VocabWord
  flashcardMode: boolean
}

const LESSON_COLORS = ['text-red-600 bg-red-50', 'text-teal-600 bg-teal-50', 'text-amber-600 bg-amber-50']
const LESSON_LABELS = ['Lesson 1', 'Lesson 2', 'Lesson 3']

export function VocabCard({ word, flashcardMode }: VocabCardProps) {
  const [revealed, setRevealed] = useState(false)
  const showTranslation = !flashcardMode || revealed
  const colorClass = LESSON_COLORS[word.lessonId] ?? LESSON_COLORS[0]

  return (
    <button
      onClick={() => flashcardMode && setRevealed((r) => !r)}
      className={`w-full text-left rounded-[13px] border border-zinc-900/10 bg-white p-4
        ${flashcardMode ? 'cursor-pointer hover:border-zinc-900/20 hover:shadow-sm' : 'cursor-default'}
        transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
      aria-label={`${word.zh}${showTranslation ? ` — ${word.en}` : ' — tap to reveal'}`}
    >
      <div className="font-serif text-2xl font-bold text-ink mb-1">{word.zh}</div>

      {word.pinyin && (
        <div className="font-mono text-xs text-ink-faint mb-1">{word.pinyin}</div>
      )}

      <div className={`text-sm transition-all duration-200 ${showTranslation ? 'opacity-100' : 'opacity-0 blur-sm select-none'}`}>
        {word.en || '—'}
      </div>

      {flashcardMode && !revealed && (
        <div className="text-[11px] text-ink-faint mt-2">Tap to reveal</div>
      )}

      <div className={`mt-3 inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
        {LESSON_LABELS[word.lessonId] ?? 'Lesson'}
      </div>
    </button>
  )
}
