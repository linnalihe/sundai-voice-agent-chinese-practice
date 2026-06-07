'use client'

import Link from 'next/link'
import { IconFlame, IconSettings, IconStar } from '@tabler/icons-react'

interface TopBarProps {
  streakCount?: number
  totalXp?: number
  showBack?: boolean
  backHref?: string
  backLabel?: string
  rightExtra?: React.ReactNode
}

export function TopBar({
  streakCount = 0,
  totalXp = 0,
  showBack = false,
  backHref = '/dashboard',
  backLabel = 'Back',
  rightExtra,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900/10">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link
            href={backHref}
            className="text-sm text-ink-muted hover:text-ink transition-colors mr-1"
          >
            ← {backLabel}
          </Link>
        )}
        {!showBack && (
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <span className="font-serif text-xl font-bold text-red-600">普通话练习</span>
            <span className="text-sm text-ink-muted font-sans hidden sm:inline">
              Talk To Me In Chinese
            </span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {rightExtra}

        {streakCount > 0 && (
          <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
            <span className="flame-icon">🔥</span>
            <span>{streakCount}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-sm font-medium text-ink-muted">
          <IconStar size={14} className="text-amber-500" />
          <span>{totalXp.toLocaleString()} XP</span>
        </div>

        <Link
          href="/settings"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-900/10 text-ink-muted hover:text-ink hover:border-zinc-900/20 transition-colors"
          aria-label="Settings"
        >
          <IconSettings size={16} />
        </Link>
      </div>
    </header>
  )
}
