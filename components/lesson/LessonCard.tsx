'use client'

import { useRouter } from 'next/navigation'
import { IconCheck } from '@tabler/icons-react'
import type { LessonDef } from '@/types'
import type { LessonProgress } from '@/types'

interface LessonCardProps {
  lesson: LessonDef
  progress: LessonProgress
  isActive: boolean
}

const COLOR_CONFIG = {
  red: {
    border: 'border-red-600',
    bg: 'bg-red-50',
    num: 'text-red-600',
    tag: 'bg-red-100 text-red-800',
    check: 'bg-red-600',
  },
  teal: {
    border: 'border-teal-600',
    bg: 'bg-teal-50',
    num: 'text-teal-600',
    tag: 'bg-teal-100 text-teal-800',
    check: 'bg-teal-600',
  },
  gold: {
    border: 'border-amber-500',
    bg: 'bg-amber-50',
    num: 'text-amber-600',
    tag: 'bg-amber-100 text-amber-800',
    check: 'bg-amber-500',
  },
}

export function LessonCard({ lesson, progress, isActive }: LessonCardProps) {
  const router = useRouter()
  const c = COLOR_CONFIG[lesson.color]

  return (
    <button
      onClick={() => router.push(`/lesson/${lesson.id}`)}
      className={`relative text-left w-full rounded-[13px] p-3.5 bg-white border transition-all duration-150 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
        ${isActive ? `border-[1.5px] ${c.border} ${c.bg}` : 'border-zinc-900/10 hover:border-zinc-900/20'}`}
      aria-label={`${lesson.zh} — ${lesson.en}`}
    >
      {/* Done checkmark */}
      {progress.done && (
        <span
          className={`absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-white ${c.check}`}
          aria-label="Completed"
        >
          <IconCheck size={11} strokeWidth={3} />
        </span>
      )}

      <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${c.num}`}>
        Lesson {lesson.id + 1}
      </div>
      <div className="font-serif text-[19px] font-bold text-ink mb-0.5">{lesson.zh}</div>
      <div className="text-xs text-ink-muted leading-snug mb-2.5">{lesson.en}</div>
      <div className="flex flex-wrap gap-1">
        {lesson.tags.map((tag) => (
          <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.tag}`}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
