'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { IconVolume, IconVolumeOff, IconRefresh, IconArrowLeft } from '@tabler/icons-react'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { InputZone } from '@/components/chat/InputZone'
import { StarterChips } from '@/components/lesson/StarterChips'
import { Toast } from '@/components/ui/Toast'
import { getLessonById } from '@/lib/lessons'
import { sendMessage, AnthropicError } from '@/lib/anthropic'
import { speakText, ElevenLabsError } from '@/lib/elevenlabs'
import { isSpeechSupported, createSpeechRecognizer } from '@/lib/speech'
import {
  getSettings,
  saveSettings,
  getLessonProgress,
  saveLessonProgress,
  addVocabWords,
  addXp,
  updateStreak,
  checkedTodayStreak,
} from '@/lib/storage'
import { calcTurnXp } from '@/lib/xp'
import type { DisplayMessage, Message, VocabWord } from '@/types'
import Link from 'next/link'

const TURNS_FOR_COMPLETION = 6

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = parseInt(String(params.id), 10)

  const lesson = getLessonById(lessonId)

  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([])
  const [apiHistory, setApiHistory] = useState<Message[]>([])
  const [turns, setTurns] = useState(0)
  const [sessionVocabCount, setSessionVocabCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [micHint, setMicHint] = useState('Tap to speak in Mandarin')
  const [speechSupported, setSpeechSupported] = useState(false)

  const msgsRef = useRef<HTMLDivElement>(null)
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null)

  // Load settings and initial state
  useEffect(() => {
    const { anthropicKey } = getSettings()
    if (!anthropicKey) { router.replace('/setup'); return }
    if (!lesson) { router.replace('/dashboard'); return }

    const progress = getLessonProgress()
    setLessonComplete(progress[lessonId]?.done ?? false)
    setAutoPlay(getSettings().autoPlay)
    setSpeechSupported(isSpeechSupported())
  }, [router, lesson, lessonId])

  // Set up speech recognizer
  useEffect(() => {
    if (!speechSupported) return

    recognizerRef.current = createSpeechRecognizer({
      onInterimResult: (text) => setInputText(text),
      onFinalResult: (text) => {
        setInputText(text)
        handleSend(text)
      },
      onStatusChange: (status) => {
        setIsRecording(status === 'listening')
        setMicHint(
          status === 'listening' ? 'Listening… speak in Mandarin' : 'Tap to speak in Mandarin'
        )
      },
      onError: (msg) => {
        setIsRecording(false)
        setMicHint('Tap to speak in Mandarin')
        setNotice(msg)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechSupported])

  // Auto-scroll to bottom
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [displayMessages, isLoading])

  const showToast = (msg: string) => {
    setToast(msg)
  }

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return
      const trimmed = text.trim()

      setInputText('')
      setNotice(null)
      setIsLoading(true)

      const userMsg: DisplayMessage = { type: 'user', text: trimmed }
      const newApiHistory: Message[] = [...apiHistory, { role: 'user', content: trimmed }]

      setDisplayMessages((prev) => [...prev, userMsg])
      setApiHistory(newApiHistory)

      try {
        const settings = getSettings()
        const response = await sendMessage(
          newApiHistory,
          lesson!.systemPrompt(settings.hskLevel),
          settings.anthropicKey
        )

        const aiMsg: DisplayMessage = { type: 'ai', data: response }
        setDisplayMessages((prev) => [...prev, aiMsg])

        // Update API history with assistant's reply
        const assistantContent = response.zh + (response.en ? ` (${response.en})` : '')
        setApiHistory((prev) => [...prev, { role: 'assistant', content: assistantContent }])

        // Track vocab
        const newVocab: VocabWord[] = response.vocab.map((v) => ({
          ...v,
          lessonId,
          addedAt: new Date().toISOString(),
        }))
        if (newVocab.length > 0) addVocabWords(newVocab)
        setSessionVocabCount((n) => n + newVocab.length)

        // Track turns and XP
        const newTurns = turns + 1
        setTurns(newTurns)

        const isFirstTurnToday = !checkedTodayStreak()
        const isJustComplete = newTurns >= TURNS_FOR_COMPLETION && !lessonComplete

        if (isJustComplete) {
          setLessonComplete(true)
          saveLessonProgress(lessonId, { done: true, turns: newTurns })
          const { count, increased } = updateStreak()
          if (increased) showToast(`🔥 ${count}-day streak!`)
          setTimeout(() => showToast('✨ +50 XP · Lesson complete!'), 1500)
        } else {
          saveLessonProgress(lessonId, { turns: newTurns })
        }

        const xpEarned = calcTurnXp({
          corrected: response.corrected,
          newVocabCount: newVocab.length,
          isFirstTurnToday,
          isLessonJustComplete: isJustComplete,
        })
        if (xpEarned > 0) addXp(xpEarned)
        if (isFirstTurnToday && !isJustComplete) updateStreak()

        // Auto-play voice
        if (autoPlay && settings.elevenLabsKey && response.zh) {
          setIsSpeakingAudio(true)
          try {
            await speakText(response.zh, settings.elevenLabsKey, settings.elevenLabsVoice)
          } catch (e) {
            if (e instanceof ElevenLabsError) setNotice(e.message)
          } finally {
            setIsSpeakingAudio(false)
          }
        }
      } catch (e) {
        if (e instanceof AnthropicError) {
          setNotice(e.message)
        } else {
          setNotice('Could not reach the AI. Check your internet connection.')
        }
        // Remove the optimistic user message on hard failure
        setDisplayMessages((prev) => prev.slice(0, -1))
        setApiHistory(apiHistory)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, apiHistory, lesson, lessonId, turns, lessonComplete, autoPlay]
  )

  const handleReplay = async (text: string) => {
    const { elevenLabsKey, elevenLabsVoice } = getSettings()
    if (!elevenLabsKey) { setNotice('Add an ElevenLabs API key in Settings to hear voice playback.'); return }
    setIsSpeakingAudio(true)
    try {
      await speakText(text, elevenLabsKey, elevenLabsVoice)
    } catch (e) {
      if (e instanceof ElevenLabsError) setNotice(e.message)
    } finally {
      setIsSpeakingAudio(false)
    }
  }

  const handleReset = () => {
    setDisplayMessages([])
    setApiHistory([])
    setTurns(0)
    setSessionVocabCount(0)
    setLessonComplete(getLessonProgress()[lessonId]?.done ?? false)
    setNotice(null)
  }

  const handleMicToggle = () => {
    if (!recognizerRef.current) return
    if (isRecording) {
      recognizerRef.current.stop()
    } else {
      recognizerRef.current.start()
    }
  }

  const toggleAutoPlay = () => {
    const next = !autoPlay
    setAutoPlay(next)
    saveSettings({ autoPlay: next })
  }

  if (!lesson) return null

  const COLOR_RING = { red: 'ring-red-200', teal: 'ring-teal-200', gold: 'ring-amber-200' }[lesson.color]
  const COLOR_ACCENT = { red: 'text-red-600', teal: 'text-teal-600', gold: 'text-amber-600' }[lesson.color]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 min-h-screen">
      <Toast message={toast} onDismiss={() => setToast(null)} />

      {/* Top nav */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <IconArrowLeft size={16} />
          Dashboard
        </Link>
        <div className="text-sm text-ink-faint">
          {turns} turn{turns !== 1 ? 's' : ''} · {sessionVocabCount} new word{sessionVocabCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Lesson context panel */}
        <aside className="lg:w-64 xl:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-zinc-900/10 p-4 space-y-4">
            {/* Persona */}
            <div>
              <div className={`w-12 h-12 rounded-full font-serif text-xl font-bold flex items-center justify-center ring-2 ${COLOR_RING} bg-white mb-2.5 ${COLOR_ACCENT}`}>
                {lesson.zh.charAt(0)}
              </div>
              <div className="font-serif text-lg font-bold text-ink">{lesson.zh}</div>
              <div className="text-xs text-ink-muted">{lesson.en}</div>
              <div className="mt-1.5 text-xs text-ink-faint">
                {lesson.persona} · {lesson.personaRole}
              </div>
            </div>

            {/* Goals */}
            <div>
              <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-2">
                Lesson goals
              </p>
              <ul className="space-y-1.5">
                {lesson.goals.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-xs text-ink-muted leading-snug">
                    <span className={`mt-0.5 text-[8px] ${COLOR_ACCENT}`}>●</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Session stats */}
            <div className="border-t border-zinc-900/10 pt-3 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-ink-faint uppercase tracking-wider">Turns</div>
                <div className="text-lg font-semibold font-mono text-ink">{turns}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink-faint uppercase tracking-wider">Words</div>
                <div className="text-lg font-semibold font-mono text-ink">{sessionVocabCount}</div>
              </div>
            </div>

            {lessonComplete && (
              <div className={`text-xs font-medium ${COLOR_ACCENT} flex items-center gap-1`}>
                ✓ Lesson complete
              </div>
            )}
          </div>
        </aside>

        {/* Chat panel */}
        <div className="flex-1 bg-white rounded-2xl border border-zinc-900/10 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900/10">
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-ink">{lesson.zh}</span>
              <span className="text-xs text-ink-faint">{lesson.en}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {notice && (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md max-w-48 truncate">
                  {notice}
                </span>
              )}
              <button
                onClick={toggleAutoPlay}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500
                  ${isSpeakingAudio ? 'speaking border-red-200 text-red-500' : 'border-zinc-900/10 text-ink-muted hover:border-zinc-900/20 hover:text-ink'}`}
                aria-label={autoPlay ? 'Mute voice' : 'Unmute voice'}
                title={autoPlay ? 'Voice on' : 'Voice off'}
              >
                {autoPlay ? <IconVolume size={15} /> : <IconVolumeOff size={15} />}
              </button>
              <button
                onClick={handleReset}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-900/10 text-ink-muted hover:border-zinc-900/20 hover:text-ink transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                aria-label="Start new conversation"
                title="New conversation"
              >
                <IconRefresh size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={msgsRef}
            className="flex-1 p-4 min-h-72 max-h-[440px] overflow-y-auto scrollbar-thin flex flex-col gap-3.5"
            aria-live="polite"
            aria-label="Conversation"
          >
            {displayMessages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-ink-faint py-10">
                <div className="font-serif text-5xl text-red-100 mb-1">开始吧</div>
                <p className="text-sm text-center">
                  Tap a starter phrase below, or speak / type to begin
                </p>
              </div>
            )}

            {displayMessages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} onReplay={handleReplay} />
            ))}

            {isLoading && <TypingIndicator />}
          </div>

          {/* Starters */}
          <StarterChips
            starters={lesson.starters}
            onSelect={handleSend}
            disabled={isLoading}
          />

          {/* Input */}
          <InputZone
            value={inputText}
            onChange={setInputText}
            onSend={handleSend}
            onMicToggle={handleMicToggle}
            isRecording={isRecording}
            isSpeechSupported={speechSupported}
            isLoading={isLoading}
            micHint={micHint}
          />
        </div>
      </div>
    </div>
  )
}
