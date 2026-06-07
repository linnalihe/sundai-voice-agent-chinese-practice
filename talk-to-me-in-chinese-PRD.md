# Product Requirements Document
## Talk To Me In Chinese

**Version:** 1.0  
**Last updated:** June 2026  
**Status:** Ready for development  
**Intended reader:** Claude Code (AI coding agent)

---

## 1. Overview

### 1.1 Problem statement

Most Mandarin learning apps (Duolingo, Rosetta Stone, Pimsleur) teach vocabulary and grammar in isolation — matching words to pictures, repeating phrases after a recording, filling in blanks. They don't teach you to actually *have a conversation*. When a casual learner meets a native speaker, they freeze because they've never practiced the real thing: unpredictable back-and-forth dialogue, natural follow-up questions, and the social pressure of being understood.

### 1.2 How the app solves it

**Talk To Me In Chinese** puts the user inside a real conversation from the first session. An AI tutor plays a native Mandarin speaker — a teacher, a local guide, a waiter — and responds naturally to whatever the user says, in the same way a patient human conversation partner would. It speaks its responses aloud using ElevenLabs voice synthesis so learners hear authentic-sounding Mandarin, and it gently corrects grammar and word choice after each exchange without interrupting the flow of conversation.

The curriculum is structured as a series of guided scenarios that a beginner would realistically encounter. Progress is tracked with streaks and XP so users feel momentum. A vocabulary review system captures every new word encountered so nothing is lost.

### 1.3 Why we're building it

To give friends, students, and the broader learning community a tool that actually bridges the gap between "studying Chinese" and "speaking Chinese" — something that feels like having a patient native-speaking friend available 24/7, not like doing homework.

---

## 2. Target user

**Primary:** Casual adult learner. Knows a handful of words or phrases (maybe took a semester of Mandarin, or has Chinese-speaking family/colleagues). Motivated but inconsistent. Doesn't want flashcard grind — wants to *talk*.

**What they care about:**
- Feeling like they're making real progress, not just accumulating points
- Not being embarrassed when they make mistakes
- Hearing how the language actually sounds
- Knowing what to practice next — they don't want to figure that out themselves

**What they don't want:**
- Another app that feels like a quiz
- To think too hard about the UI
- To feel lost about what to do next

---

## 3. Emotional design brief

The user should feel two things simultaneously:

1. **Immersed** — like they've stepped into a real conversation with someone in China. The tutor personas feel like actual people, not a chatbot. The voice is warm and natural. The UI fades into the background.

2. **Accomplished** — like every session moves them forward. Streaks, XP, vocabulary counts, and lesson completion markers make progress tangible and satisfying without being overwhelming or gamified to the point of feeling childish.

The tone is **warm, encouraging, and cultural** — never clinical, never patronizing. Making mistakes should feel safe. Completing a lesson should feel like a small celebration.

---

## 4. Visual design direction

### 4.1 Aesthetic

**Warm & cultural.** Chinese design influences: ink brushwork sensibility, red and gold as primary accent colors, generous white space, elegant serif typography for Chinese characters. Think of the aesthetic of a beautifully designed Chinese tea house menu — refined, warm, distinctly cultural, not generic language-app blue.

**Not:** Duolingo's cartoonish green. Not sterile SaaS. Not dark mode.

### 4.2 Color palette

| Role | Color | Notes |
|---|---|---|
| Primary accent | `#dc2626` (Chinese red) | Buttons, active states, progress |
| Secondary accent | `#d97706` (gold) | XP, streaks, achievements |
| Teal | `#0d9488` | Lesson 2 theming |
| Background | `#fafaf9` (warm off-white) | Never pure white |
| Card surface | `#ffffff` | Slight elevation over bg |
| Text primary | `#18181b` | Near-black, not pure black |
| Text secondary | `#52525b` | Muted labels |
| Text tertiary | `#a1a1aa` | Hints, placeholders |

### 4.3 Typography

- **Display / Chinese characters:** `Noto Serif SC` — weight 700 for headings, 600 for in-conversation Chinese text
- **UI body:** `Outfit` — weight 400 regular, 500 medium, 600 for emphasis
- **Pinyin / technical:** `DM Mono` — used for pinyin romanization, never for UI chrome

### 4.4 Design inspirations

- **HelloTalk** — the conversational chat interface; messages feel like texting a friend, not doing an exercise
- **Duolingo** — streak counters, XP bars, lesson card grid; progress feels visible and motivating
- **Headspace** — calm onboarding, clear hierarchy, the UI never competes with the content

### 4.5 Reference visual style

The prototype built in this conversation serves as the direct visual reference. Claude Code should treat the HTML file (`chinese_voice_tutor.html`) as the design source of truth for:
- Chat bubble styles (AI vs user, avatar treatment)
- Lesson card grid (color-coded per lesson, active/done states)
- Stats bar layout
- Input zone (textarea + send button + mic button arrangement)
- ElevenLabs connection badge in top bar

---

## 5. Application screens

### Screen 1 — API Key Setup (first launch only)

Shown once when the user first opens the app. Clean, welcoming, not intimidating.

**Elements:**
- App name and tagline ("Your Chinese conversation partner")
- Two input fields: Anthropic API key, ElevenLabs API key
- Helper text: what each key is for and where to get it (with links)
- "Start learning" CTA button — disabled until both keys are entered
- Keys stored in `localStorage` so user never sees this screen again on the same device
- Small "Why do I need these?" accordion for less technical users

**UX note:** Do not show this screen on every visit. Check localStorage on load and skip directly to the Dashboard if keys exist.

---

### Screen 2 — Dashboard (home)

The main hub. User lands here every session.

**Elements:**

**Top bar:**
- App name/logo left
- Current streak (flame icon + day count) right
- Total XP earned right

**Lesson curriculum section:**
- Section label: "Your lessons"
- 3 lesson cards in a horizontal grid (or stacked on mobile):
  - Lesson 1: 自我介绍 / Introductions & hobbies (red theme)
  - Lesson 2: 旅行问路 / Travel & directions (teal theme)
  - Lesson 3: 美食点餐 / Food & ordering (gold theme)
- Each card shows: lesson number, Chinese title, English subtitle, 3 topic tags, completion checkmark when done
- Active/selected lesson has a colored border; completed lessons show a check badge
- Clicking a card navigates to the Conversation screen for that lesson

**Progress stats row (below lessons):**
- Turns taken (total across all lessons)
- Corrections received
- Vocabulary words collected
- Current lesson indicator (e.g. "1 / 3")

**Vocabulary preview (below stats):**
- A horizontal scrollable strip of the last 5–8 vocabulary words collected
- Each word shows: Chinese character, pinyin below it
- "Review all →" link navigating to Vocabulary screen

**Daily streak prompt:**
- If the user hasn't practiced today, show a warm nudge: "Keep your streak alive — practice for just 5 minutes"

---

### Screen 3 — Conversation (per lesson)

The core experience. This is where the user spends most of their time.

**Layout: two-column on desktop, single column on mobile**

Left/top: lesson context panel  
Right/bottom: live conversation

**Lesson context panel:**
- Lesson title (Chinese + English)
- Tutor persona card: avatar (illustrated, not photographic), name, role description (e.g. "林老师 · Language teacher")
- "Lesson goals" — 3 bullet points of what this conversation will cover
- Starter phrases — 4 tappable chips that pre-fill the input and send (e.g. "你好！我叫…")
- Session stats: turns this session, words learned this session

**Conversation panel:**
- Chat message thread (scrollable, newest at bottom)
- AI messages show:
  - Chinese characters (large, Noto Serif SC)
  - Pinyin below in DM Mono
  - English translation below in italic
  - Green feedback chip when correction/encouragement is present
  - "Listen again" button — replays ElevenLabs audio for that message
- User messages show in purple bubbles (right-aligned)
- Typing indicator (three animated dots) while AI is responding
- ElevenLabs auto-plays each AI response when voice is connected

**Input zone (bottom):**
- Textarea for typed input (Chinese, pinyin, or English all accepted)
- Send button
- Mic button — triggers browser SpeechRecognition with `lang='zh-CN'`
- Mic status label ("Tap to speak" / "Listening…")

**Top bar of conversation panel:**
- Lesson title
- Volume toggle (mute/unmute ElevenLabs auto-play)
- Refresh button (start a new conversation, same lesson)
- Back button → Dashboard

**XP award:**
- At 6 turns, show a subtle toast: "+50 XP · Lesson complete 🎉"
- Lesson card on Dashboard gains a checkmark

---

### Screen 4 — Vocabulary Review

A flashcard-style review of all words collected across all conversations.

**Elements:**
- Header: "Your vocabulary" + total word count badge
- Filter row: "All" / "Lesson 1" / "Lesson 2" / "Lesson 3" tabs
- Card grid (2 columns desktop, 1 column mobile):
  - Each card: Chinese character large, pinyin below, English below that, lesson tag chip
- Flashcard mode toggle: hides English translation until user taps the card (flip to reveal)
- "Practice with tutor →" button per lesson group — navigates to that lesson's conversation

**Data source:** All `vocab` words returned by the AI JSON response across sessions, stored in localStorage.

---

### Screen 5 — Settings (accessible from top bar)

Simple drawer or page.

**Sections:**
- **API Keys** — show masked current keys, ability to update each one
- **Voice settings** — ElevenLabs voice selector (dropdown of 3–4 curated voices that work well for Chinese), auto-play toggle
- **Learning preferences** — HSK level selector (1 / 2 / 3 / 4+), affects all AI system prompts
- **Reset progress** — clear localStorage (with confirmation dialog)

---

## 6. AI conversation system

### 6.1 Tutor personas

Each lesson has a dedicated persona defined in the system prompt:

| Lesson | Persona | Role |
|---|---|---|
| 1 | 林老师 (Lín Lǎoshī) | Warm language teacher meeting a new student |
| 2 | 王导游 (Wáng Dǎoyóu) | Friendly Beijing local guide |
| 3 | 小李 (Xiǎo Lǐ) | Enthusiastic restaurant waiter |

### 6.2 AI response format

Every AI response must be returned as a JSON object — no markdown, no extra text:

```json
{
  "zh": "Mandarin response in Chinese characters",
  "pinyin": "Full pinyin with tone marks",
  "en": "Natural English translation",
  "feedback": "1-2 sentences of kind feedback on the user's Chinese. Empty string if not needed.",
  "vocab": ["new word 1", "new word 2"],
  "corrected": false
}
```

### 6.3 Model

Use `claude-sonnet-4-20250514` via the Anthropic Messages API (`https://api.anthropic.com/v1/messages`). API key is provided by the user and stored in localStorage. Pass it in the `x-api-key` header client-side.

### 6.4 Conversation history

Maintain a rolling `messages` array in component state. Pass the full history on each API call so the AI has context. Reset history on "New conversation" but not on page navigation.

---

## 7. Voice (ElevenLabs)

### 7.1 Integration

- Endpoint: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream`
- Header: `xi-api-key: {user_key}`
- Model: `eleven_flash_v2_5` (lowest latency, good quality)
- Voice settings: `{ stability: 0.55, similarity_boost: 0.75, style: 0.25 }`
- Response: audio stream → create Blob URL → play via `new Audio()`

### 7.2 Default voice

Default `voice_id`: `pNInz6obpgDQGcFmaJgB` (Adam). User can change in Settings from a curated list.

### 7.3 Behavior

- Auto-play every AI response if ElevenLabs is connected and auto-play is on
- "Listen again" button on every AI message re-calls the API with that message's `zh` text
- Volume toggle mutes/unmutes without disconnecting
- If ElevenLabs key is not set, the app still works fully — voice is optional

---

## 8. Speech recognition (input)

- Use browser-native `SpeechRecognition` / `webkitSpeechRecognition`
- Language: `zh-CN` (Mandarin)
- On result: populate textarea with transcript
- On end: auto-send if transcript is non-empty
- Graceful fallback: if browser doesn't support, hide mic button and show text-only hint
- Note: requires `https://` or `localhost` — warn user if on `file://`

---

## 9. Data persistence (localStorage)

All persistence is client-side via `localStorage`. No backend, no database, no auth.

| Key | Value |
|---|---|
| `ttmic_anthropic_key` | Anthropic API key string |
| `ttmic_elevenlabs_key` | ElevenLabs API key string |
| `ttmic_elevenlabs_voice` | Selected voice ID |
| `ttmic_hsk_level` | Integer 1–4 |
| `ttmic_vocab` | JSON array of all collected vocab objects |
| `ttmic_lesson_progress` | JSON object `{ lesson_0: { done: bool, xp: int, turns: int }, ... }` |
| `ttmic_streak` | JSON object `{ count: int, last_date: "YYYY-MM-DD" }` |
| `ttmic_total_xp` | Integer |

Streak logic: on app load, check `last_date`. If it's today, streak is current. If yesterday, streak is current. If 2+ days ago, streak resets to 0.

---

## 10. XP & streak system

| Action | XP awarded |
|---|---|
| Complete a lesson (6+ turns) | +50 XP |
| Receive a correction | +5 XP (learning moment) |
| New vocabulary word added | +2 XP per word |
| Daily practice (any session) | +10 XP |

Streak increments once per calendar day when user completes at least one conversation turn.

Display: flame icon + number in top bar. Toast notification when streak increases.

---

## 11. Technical stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, easy Vercel deploy, React ecosystem |
| Language | TypeScript | Type safety for API response shapes |
| Styling | Tailwind CSS | Fast iteration, consistent spacing, responsive by default |
| Fonts | Google Fonts (Noto Serif SC, Outfit, DM Mono) | Already validated in prototype |
| Icons | Tabler Icons (React package) | Already used in prototype, 5800+ icons |
| State | React `useState` / `useContext` | No backend = no need for Redux/Zustand yet |
| Persistence | `localStorage` via custom hooks | Simple, no auth required |
| Deployment | Vercel | Free tier, Next.js native, shareable URL |
| AI API | Anthropic Messages API (client-side) | User provides key |
| Voice API | ElevenLabs TTS stream endpoint (client-side) | User provides key |
| Speech input | Browser Web Speech API | No cost, no key needed |

### Project structure (suggested)

```
/app
  /page.tsx                  → redirects to /dashboard or /setup
  /setup/page.tsx            → API key onboarding screen
  /dashboard/page.tsx        → home screen with lesson cards
  /lesson/[id]/page.tsx      → conversation screen
  /vocabulary/page.tsx       → vocabulary review screen
  /settings/page.tsx         → settings screen
/components
  /ui/                       → reusable: Button, Card, Badge, Toast
  /chat/                     → MessageBubble, TypingIndicator, InputZone
  /lesson/                   → LessonCard, LessonHeader, StarterChips
  /vocabulary/               → VocabCard, FlashcardMode
  /layout/                   → TopBar, StreakBadge, XPCounter
/lib
  /anthropic.ts              → API call helper, message history manager
  /elevenlabs.ts             → TTS fetch + audio playback helper
  /speech.ts                 → SpeechRecognition wrapper with fallback
  /storage.ts                → localStorage read/write helpers
  /lessons.ts                → lesson definitions (personas, system prompts, starters)
  /xp.ts                     → XP calculation and streak logic
/types
  /index.ts                  → shared TypeScript types (Message, VocabWord, LessonProgress, etc.)
```

---

## 12. V1 scope (what to build now)

### In scope
- API key setup screen with localStorage persistence
- Dashboard with 3 lesson cards, streak display, XP display, vocab preview strip
- Conversation screen for all 3 lessons with full AI chat, ElevenLabs voice, speech input
- Vocabulary screen (grid view + flashcard mode)
- Settings screen (key management, voice selector, HSK level, reset)
- XP and streak system
- Lesson completion detection (6 turns) with toast

### Out of scope for V1
- User accounts / cloud sync
- Pronunciation scoring
- More than 3 lessons
- Social / leaderboard features
- Native mobile app

---

## 13. Key constraints & notes for Claude Code

1. **API keys are client-side.** Both Anthropic and ElevenLabs keys are stored in localStorage and passed directly from the browser. There is no server-side proxy. This is intentional — users own their keys.

2. **CORS requirement.** The app must be served over `https://` or `localhost` for both the ElevenLabs API (CORS) and the Web Speech API (mic permission) to work. Vercel deployment satisfies this automatically.

3. **AI response parsing.** The Anthropic API is prompted to return strict JSON. Always wrap `JSON.parse()` in try/catch and fall back gracefully if the model returns non-JSON.

4. **No authentication.** There is no login, no user accounts, no server. Everything is local to the device.

5. **Responsive design.** The app must work well on desktop (primary) and mobile (secondary). Conversation screen collapses to single column on mobile.

6. **Accessibility.** All interactive elements need keyboard navigation and ARIA labels. Mic button must have `aria-label`. Screen reader users should be able to read conversation content.

7. **Empty states.** Every screen needs a thoughtful empty state (no vocab collected yet, no turns taken yet, etc.).

8. **Error states.** Handle: API key invalid, network failure, ElevenLabs credit exhausted, speech recognition denied. Show friendly inline notices — never crash or show raw error objects.

---

## 14. Success metrics (for the builder)

The V1 is considered successful when:
- A user with zero setup knowledge can go from landing on the URL to having their first conversation in under 3 minutes
- All 3 lessons are fully functional with voice playback and speech input
- Vocabulary and progress persist across browser sessions
- The app can be shared as a Vercel URL and works for anyone who pastes their own API keys
