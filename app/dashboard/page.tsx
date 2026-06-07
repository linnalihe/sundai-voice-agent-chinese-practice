'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconBook, IconArrowRight } from '@tabler/icons-react'
import { TopBar } from '@/components/layout/TopBar'
import { LessonCard } from '@/components/lesson/LessonCard'
import { LESSONS } from '@/lib/lessons'
import {
  getSettings,
  getStreak,
  getTotalXp,
  getLessonProgress,
  getVocab,
  checkedTodayStreak,
} from '@/lib/storage'
import type { LessonProgress, VocabWord } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [lessonProgress, setLessonProgress] = useState<Record<number, LessonProgress>>({})
  const [recentVocab, setRecentVocab] = useState<VocabWord[]>([])
  const [activeLesson, setActiveLesson] = useState(0)
  const [practicedToday, setPracticedToday] = useState(false)

  useEffect(() => {
    const { anthropicKey } = getSettings()
    if (!anthropicKey) { router.replace('/setup'); return }

    setStreakCount(getStreak().count)
    setTotalXp(getTotalXp())
    setLessonProgress(getLessonProgress())
    setPracticedToday(checkedTodayStreak())

    const vocab = getVocab()
    setRecentVocab(vocab.slice(-8).reverse())

    // Set active lesson to the first incomplete one
    const progress = getLessonProgress()
    const firstIncomplete = LESSONS.find((l) => !progress[l.id]?.done)
    setActiveLesson(firstIncomplete?.id ?? 0)

    setLoaded(true)
  }, [router])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-serif text-4xl text-red-100 animate-pulse">普通话练习</div>
      </div>
    )
  }

  const totalTurns = Object.values(lessonProgress).reduce((s, p) => s + p.turns, 0)
  const totalCorrections = 0 // tracked per-session, not persisted globally
  const completedLessons = Object.values(lessonProgress).filter((p) => p.done).length

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <TopBar streakCount={streakCount} totalXp={totalXp} />

      {/* Streak nudge */}
      {!practicedToday && streakCount > 0 && (
        <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-2">
          <span className="text-base">🔥</span>
          Keep your streak alive — practice for just 5 minutes
        </div>
      )}

      {/* Lessons */}
      <div className="mb-1.5">
        <p className="text-[11px] font-medium text-ink-faint uppercase tracking-wider mb-2.5">
          Your lessons
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {LESSONS.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progress={lessonProgress[lesson.id] ?? { done: false, xp: 0, turns: 0 }}
              isActive={activeLesson === lesson.id}
            />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Turns', value: totalTurns },
          { label: 'Corrections', value: totalCorrections },
          { label: 'Words', value: getVocab().length },
          { label: 'Lessons', value: `${completedLessons} / 3` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[10px] border border-zinc-900/10 px-3 py-2.5">
            <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-1">{label}</div>
            <div className="text-xl font-semibold font-mono text-ink">{value}</div>
          </div>
        ))}
      </div>

      {/* Vocab preview */}
      {recentVocab.length > 0 ? (
        <div className="bg-white rounded-xl border border-zinc-900/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-medium text-ink-faint uppercase tracking-wider">
              Recent vocabulary
            </p>
            <Link
              href="/vocabulary"
              className="text-xs text-red-600 hover:underline flex items-center gap-0.5"
            >
              Review all <IconArrowRight size={12} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
            {recentVocab.map((word) => (
              <div
                key={word.zh + word.addedAt}
                className="flex-shrink-0 text-center min-w-[52px]"
              >
                <div className="font-serif text-lg font-semibold text-ink">{word.zh}</div>
                {word.pinyin && (
                  <div className="font-mono text-[10px] text-ink-faint">{word.pinyin}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-900/10 p-6 text-center">
          <div className="font-serif text-4xl text-red-100 mb-2">词汇</div>
          <p className="text-sm text-ink-faint">
            Start a conversation — new words you encounter will appear here
          </p>
          <Link
            href={`/lesson/${activeLesson}`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-red-600 font-medium hover:underline"
          >
            <IconBook size={14} />
            Begin lesson {activeLesson + 1}
          </Link>
        </div>
      )}
    </div>
  )
}
