'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconCards, IconLayoutGrid } from '@tabler/icons-react'
import { TopBar } from '@/components/layout/TopBar'
import { VocabCard } from '@/components/vocabulary/VocabCard'
import { getSettings, getVocab, getStreak, getTotalXp } from '@/lib/storage'
import type { VocabWord } from '@/types'

type Filter = 'all' | '0' | '1' | '2'

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  '0': 'Lesson 1',
  '1': 'Lesson 2',
  '2': 'Lesson 3',
}

export default function VocabularyPage() {
  const router = useRouter()
  const [vocab, setVocab] = useState<VocabWord[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [flashcardMode, setFlashcardMode] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const { anthropicKey } = getSettings()
    if (!anthropicKey) { router.replace('/setup'); return }
    setVocab(getVocab())
    setStreakCount(getStreak().count)
    setTotalXp(getTotalXp())
    setLoaded(true)
  }, [router])

  const filtered = filter === 'all' ? vocab : vocab.filter((w) => String(w.lessonId) === filter)

  if (!loaded) return null

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <TopBar
        streakCount={streakCount}
        totalXp={totalXp}
        showBack
        backHref="/dashboard"
        backLabel="Dashboard"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Your vocabulary</h1>
          <p className="text-sm text-ink-muted">{vocab.length} word{vocab.length !== 1 ? 's' : ''} collected</p>
        </div>
        <button
          onClick={() => setFlashcardMode((v) => !v)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
            ${flashcardMode
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-ink-muted border-zinc-900/10 hover:border-zinc-900/20'
            }`}
          aria-pressed={flashcardMode}
        >
          {flashcardMode ? <IconCards size={15} /> : <IconLayoutGrid size={15} />}
          {flashcardMode ? 'Flashcard mode' : 'Grid mode'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
              ${filter === f
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-ink-muted border-zinc-900/10 hover:border-zinc-900/20'
              }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-ink-faint">
          <div className="font-serif text-5xl text-red-100 mb-3">词汇</div>
          <p className="text-sm mb-4">
            {filter === 'all'
              ? 'No vocabulary yet — start a conversation to collect words'
              : `No words from ${FILTER_LABELS[filter]} yet`}
          </p>
          <Link
            href={`/lesson/${filter === 'all' ? 0 : filter}`}
            className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
          >
            Practice {filter === 'all' ? 'Lesson 1' : FILTER_LABELS[filter]} →
          </Link>
        </div>
      )}

      {/* Vocab grid */}
      {filtered.length > 0 && (
        <>
          {flashcardMode && (
            <p className="text-xs text-ink-faint mb-3 text-center">
              Tap any card to reveal the translation
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((word) => (
              <VocabCard key={word.zh + word.addedAt} word={word} flashcardMode={flashcardMode} />
            ))}
          </div>

          {/* Practice CTA per lesson group */}
          <div className="mt-8 space-y-2">
            {[0, 1, 2].map((id) => {
              const count = vocab.filter((w) => w.lessonId === id).length
              if (count === 0) return null
              return (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">{count} words from Lesson {id + 1}</span>
                  <Link
                    href={`/lesson/${id}`}
                    className="text-red-600 hover:underline"
                  >
                    Practice with tutor →
                  </Link>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
