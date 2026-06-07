'use client'

import { IconBulb, IconPlayerPlay } from '@tabler/icons-react'
import type { DisplayMessage } from '@/types'

interface MessageBubbleProps {
  msg: DisplayMessage
  onReplay?: (text: string) => void
}

export function MessageBubble({ msg, onReplay }: MessageBubbleProps) {
  if (msg.type === 'user') {
    return (
      <div className="flex gap-2.5 items-start flex-row-reverse msg-in">
        <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm flex-shrink-0 font-serif font-bold bg-violet-50 text-violet-700">
          我
        </div>
        <div className="max-w-[78%] flex flex-col items-end gap-1">
          <div className="px-3 py-2 text-sm leading-relaxed text-white bg-violet-600 bubble-user">
            {msg.text}
          </div>
        </div>
      </div>
    )
  }

  const { data } = msg
  return (
    <div className="flex gap-2.5 items-start msg-in">
      <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm flex-shrink-0 font-serif font-bold bg-red-50 text-red-600">
        师
      </div>
      <div className="max-w-[78%] flex flex-col gap-1.5">
        <div className="px-3 py-2 text-sm leading-relaxed bg-zinc-100 bubble-ai">
          <span className="font-serif text-base font-semibold text-ink block mb-0.5">
            {data.zh}
          </span>
          {data.pinyin && (
            <span className="font-mono text-[11px] text-ink-faint block mb-0.5">
              {data.pinyin}
            </span>
          )}
          {data.en && (
            <span className="text-[12px] text-ink-muted italic block">{data.en}</span>
          )}
        </div>

        {data.feedback && (
          <div className="flex items-start gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5 text-xs text-green-800 leading-snug">
            <IconBulb size={13} className="mt-px flex-shrink-0" aria-hidden />
            <span>{data.feedback}</span>
          </div>
        )}

        {onReplay && data.zh && (
          <button
            onClick={() => onReplay(data.zh)}
            className="self-start flex items-center gap-1 text-[11px] text-ink-faint px-2 py-0.5 rounded border border-zinc-900/10 bg-transparent
              hover:text-red-600 hover:border-red-300 transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
            aria-label={`Listen again: ${data.zh}`}
          >
            <IconPlayerPlay size={12} aria-hidden />
            Listen again
          </button>
        )}
      </div>
    </div>
  )
}
