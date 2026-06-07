import type { VocabWord, LessonProgress, StreakData, AppSettings } from '@/types'

const KEYS = {
  anthropicKey: 'ttmic_anthropic_key',
  elevenLabsKey: 'ttmic_elevenlabs_key',
  elevenLabsVoice: 'ttmic_elevenlabs_voice',
  hskLevel: 'ttmic_hsk_level',
  autoPlay: 'ttmic_auto_play',
  vocab: 'ttmic_vocab',
  lessonProgress: 'ttmic_lesson_progress',
  streak: 'ttmic_streak',
  totalXp: 'ttmic_total_xp',
} as const

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    if (v === null) return fallback
    return JSON.parse(v) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage may be unavailable in some environments
  }
}

function remove(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

// Settings
export function getSettings(): AppSettings {
  return {
    anthropicKey: read<string>(KEYS.anthropicKey, ''),
    elevenLabsKey: read<string>(KEYS.elevenLabsKey, ''),
    elevenLabsVoice: read<string>(KEYS.elevenLabsVoice, 'pNInz6obpgDQGcFmaJgB'),
    hskLevel: read<1 | 2 | 3 | 4>(KEYS.hskLevel, 2),
    autoPlay: read<boolean>(KEYS.autoPlay, true),
  }
}

export function saveAnthropicKey(key: string): void {
  write(KEYS.anthropicKey, key)
}

export function saveElevenLabsKey(key: string): void {
  write(KEYS.elevenLabsKey, key)
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (settings.anthropicKey !== undefined) write(KEYS.anthropicKey, settings.anthropicKey)
  if (settings.elevenLabsKey !== undefined) write(KEYS.elevenLabsKey, settings.elevenLabsKey)
  if (settings.elevenLabsVoice !== undefined) write(KEYS.elevenLabsVoice, settings.elevenLabsVoice)
  if (settings.hskLevel !== undefined) write(KEYS.hskLevel, settings.hskLevel)
  if (settings.autoPlay !== undefined) write(KEYS.autoPlay, settings.autoPlay)
}

// Vocab
const DEFAULT_PROGRESS: Record<number, LessonProgress> = {
  0: { done: false, xp: 0, turns: 0 },
  1: { done: false, xp: 0, turns: 0 },
  2: { done: false, xp: 0, turns: 0 },
}

export function getVocab(): VocabWord[] {
  return read<VocabWord[]>(KEYS.vocab, [])
}

export function addVocabWords(words: VocabWord[]): void {
  if (words.length === 0) return
  const existing = getVocab()
  const existingZh = new Set(existing.map((w) => w.zh))
  const newWords = words.filter((w) => !existingZh.has(w.zh))
  if (newWords.length > 0) write(KEYS.vocab, [...existing, ...newWords])
}

// Lesson progress
export function getLessonProgress(): Record<number, LessonProgress> {
  return read<Record<number, LessonProgress>>(KEYS.lessonProgress, DEFAULT_PROGRESS)
}

export function saveLessonProgress(lessonId: number, progress: Partial<LessonProgress>): void {
  const all = getLessonProgress()
  all[lessonId] = { ...all[lessonId], ...progress }
  write(KEYS.lessonProgress, all)
}

// Streak
export function getStreak(): StreakData {
  return read<StreakData>(KEYS.streak, { count: 0, lastDate: '' })
}

export function updateStreak(): { count: number; increased: boolean } {
  const today = new Date().toISOString().split('T')[0]
  const streak = getStreak()

  if (streak.lastDate === today) {
    return { count: streak.count, increased: false }
  }

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
  const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1
  write(KEYS.streak, { count: newCount, lastDate: today })
  return { count: newCount, increased: true }
}

export function checkedTodayStreak(): boolean {
  const today = new Date().toISOString().split('T')[0]
  return getStreak().lastDate === today
}

// XP
export function getTotalXp(): number {
  return read<number>(KEYS.totalXp, 0)
}

export function addXp(amount: number): number {
  const next = getTotalXp() + amount
  write(KEYS.totalXp, next)
  return next
}

// Reset everything
export function resetAllProgress(): void {
  remove(KEYS.vocab)
  remove(KEYS.lessonProgress)
  remove(KEYS.streak)
  remove(KEYS.totalXp)
}
