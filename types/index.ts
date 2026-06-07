// Core message types for the Anthropic API conversation history
export interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Structured response the AI returns as JSON
export interface AIResponse {
  zh: string
  pinyin: string
  en: string
  feedback: string
  vocab: VocabEntry[]
  corrected: boolean
}

// Single vocab entry returned by the AI
export interface VocabEntry {
  zh: string
  pinyin: string
  en: string
}

// Persisted vocab word with lesson association
export interface VocabWord extends VocabEntry {
  lessonId: number
  addedAt: string // ISO date string
}

// What gets rendered in the chat UI
export type DisplayMessage =
  | { type: 'user'; text: string }
  | { type: 'ai'; data: AIResponse }

export interface LessonProgress {
  done: boolean
  xp: number
  turns: number
}

export interface StreakData {
  count: number
  lastDate: string // YYYY-MM-DD
}

export interface AppSettings {
  anthropicKey: string
  elevenLabsKey: string
  elevenLabsVoice: string
  hskLevel: 1 | 2 | 3 | 4
  autoPlay: boolean
}

export interface LessonDef {
  id: number
  zh: string
  en: string
  color: 'red' | 'teal' | 'gold'
  tags: string[]
  persona: string
  personaRole: string
  goals: string[]
  starters: string[]
  systemPrompt: (hskLevel: number) => string
}
