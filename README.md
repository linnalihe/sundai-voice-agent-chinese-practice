# 普通话练习 · Talk To Me In Chinese

An AI-powered Mandarin conversation partner. Practice real Chinese dialogue with three tutor personas across themed lesson scenarios — introductions, travel, and food. Responses are spoken aloud via ElevenLabs, and you can reply by voice or text.

No backend, no accounts. Your API keys stay in your browser.

---

## Features

- **3 conversation lessons** — 自我介绍 (introductions), 旅行问路 (travel & directions), 美食点餐 (food & ordering)
- **AI tutors** — 林老师, 王导游, and 小李 each have distinct personalities and respond naturally to whatever you say
- **Voice playback** — ElevenLabs TTS speaks every AI response in Mandarin (optional)
- **Speech input** — speak in Chinese via browser mic, auto-sends when you stop talking (Chrome/Edge)
- **Correction & feedback** — gentle grammar tips after each exchange without breaking the conversation
- **Vocabulary collection** — new words are saved automatically; review them in flashcard mode
- **XP & streaks** — earn XP for corrections, new vocab, daily practice, and lesson completion
- **HSK levels** — adjust AI language complexity from HSK 1–4+ in Settings

---

## Running locally

### Prerequisites

- Node.js 18 or later
- An [Anthropic API key](https://console.anthropic.com/settings/keys) (required)
- An [ElevenLabs API key](https://elevenlabs.io/app/settings/api-keys) (optional — enables voice playback)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/linnalihe/sundai-voice-agent-chinese-practice.git
cd sundai-voice-agent-chinese-practice

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

On first launch you'll see a setup screen — paste your Anthropic API key (and optionally your ElevenLabs key) to get started. Keys are saved in `localStorage` so you only do this once.

> **Note:** Speech input (mic button) requires Chrome or Edge. Safari and Firefox will show a text-only input instead.

---

## Project structure

```
app/
  page.tsx                  → redirects to /setup or /dashboard
  setup/page.tsx            → API key onboarding (first launch)
  dashboard/page.tsx        → home — lesson cards, streak, XP, vocab preview
  lesson/[id]/page.tsx      → conversation screen
  vocabulary/page.tsx       → vocab review with flashcard mode
  settings/page.tsx         → key management, voice, HSK level, reset
components/
  chat/                     → MessageBubble, TypingIndicator, InputZone
  layout/                   → TopBar
  lesson/                   → LessonCard, StarterChips
  vocabulary/               → VocabCard
  ui/                       → Toast, Badge
lib/
  anthropic.ts              → Anthropic Messages API helper
  elevenlabs.ts             → ElevenLabs TTS streaming helper
  speech.ts                 → Web Speech API wrapper
  storage.ts                → localStorage read/write helpers
  lessons.ts                → lesson definitions and system prompts
  xp.ts                     → XP calculation logic
types/
  index.ts                  → shared TypeScript interfaces
```

---

## Deploying to Vercel

1. Push to GitHub (already done)
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. No environment variables needed — users supply their own API keys

The app is a static-compatible Next.js app with no server-side routes, so it deploys and loads fast on Vercel's free tier.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic claude-sonnet-4-6 (client-side) |
| Voice output | ElevenLabs TTS stream API |
| Voice input | Browser Web Speech API |
| Persistence | localStorage (no backend) |
| Icons | Tabler Icons |
| Fonts | Noto Serif SC · Outfit · DM Mono |
