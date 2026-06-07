'use client'

interface StarterChipsProps {
  starters: string[]
  onSelect: (text: string) => void
  disabled?: boolean
}

export function StarterChips({ starters, onSelect, disabled = false }: StarterChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
      {starters.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="text-xs px-3 py-1 rounded-full border border-zinc-900/18 bg-paper text-ink-muted
            hover:border-red-500 hover:text-red-600 transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
