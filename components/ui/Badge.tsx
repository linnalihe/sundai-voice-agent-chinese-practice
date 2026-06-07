import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'red' | 'teal' | 'gold' | 'zinc' | 'green' | 'violet'
  size?: 'sm' | 'xs'
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  red: 'bg-red-50 text-red-800 border-red-200',
  teal: 'bg-teal-50 text-teal-800 border-teal-200',
  gold: 'bg-amber-50 text-amber-800 border-amber-200',
  zinc: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  green: 'bg-green-50 text-green-800 border-green-200',
  violet: 'bg-violet-50 text-violet-800 border-violet-200',
}

export function Badge({ children, variant = 'zinc', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  )
}
