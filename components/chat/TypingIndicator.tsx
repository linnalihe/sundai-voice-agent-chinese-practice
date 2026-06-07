export function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-start msg-in" aria-label="AI is typing">
      <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm flex-shrink-0 font-serif font-bold bg-red-50 text-red-600">
        师
      </div>
      <div className="flex items-center gap-1.5 py-2 px-3 bg-zinc-100 rounded-[3px_13px_13px_13px]">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-3" />
      </div>
    </div>
  )
}
