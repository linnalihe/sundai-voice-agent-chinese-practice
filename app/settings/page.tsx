'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconAlertTriangle } from '@tabler/icons-react'
import { TopBar } from '@/components/layout/TopBar'
import { VOICE_OPTIONS } from '@/lib/elevenlabs'
import {
  getSettings,
  saveSettings,
  getStreak,
  getTotalXp,
  resetAllProgress,
} from '@/lib/storage'
import type { AppSettings } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<AppSettings>({
    anthropicKey: '',
    elevenLabsKey: '',
    elevenLabsVoice: 'pNInz6obpgDQGcFmaJgB',
    hskLevel: 2,
    autoPlay: true,
  })
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)

  useEffect(() => {
    const s = getSettings()
    if (!s.anthropicKey) { router.replace('/setup'); return }
    setSettings(s)
    setStreakCount(getStreak().count)
    setTotalXp(getTotalXp())
  }, [router])

  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetAllProgress()
    setShowResetConfirm(false)
    router.push('/dashboard')
  }

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <TopBar
        streakCount={streakCount}
        totalXp={totalXp}
        showBack
        backHref="/dashboard"
        backLabel="Dashboard"
      />

      <h1 className="font-serif text-2xl font-bold text-ink mb-6">Settings</h1>

      <div className="space-y-5">
        {/* API Keys */}
        <section className="bg-white rounded-xl border border-zinc-900/10 p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">API Keys</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Anthropic API key
              </label>
              <div className="relative">
                <input
                  type={showAnthropicKey ? 'text' : 'password'}
                  value={settings.anthropicKey}
                  onChange={(e) => update('anthropicKey', e.target.value)}
                  className="w-full text-sm px-3 py-2.5 pr-10 border border-zinc-900/18 rounded-lg bg-paper text-ink focus:border-red-500 focus:outline-none transition-colors"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropicKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                  aria-label={showAnthropicKey ? 'Hide key' : 'Show key'}
                >
                  {showAnthropicKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                ElevenLabs API key
                <span className="text-ink-faint font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showElevenLabsKey ? 'text' : 'password'}
                  value={settings.elevenLabsKey}
                  onChange={(e) => update('elevenLabsKey', e.target.value)}
                  placeholder="Leave blank to disable voice"
                  className="w-full text-sm px-3 py-2.5 pr-10 border border-zinc-900/18 rounded-lg bg-paper text-ink placeholder:text-ink-faint focus:border-red-500 focus:outline-none transition-colors"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowElevenLabsKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                  aria-label={showElevenLabsKey ? 'Hide key' : 'Show key'}
                >
                  {showElevenLabsKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Voice settings */}
        <section className="bg-white rounded-xl border border-zinc-900/10 p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Voice</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                ElevenLabs voice
              </label>
              <select
                value={settings.elevenLabsVoice}
                onChange={(e) => update('elevenLabsVoice', e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-zinc-900/18 rounded-lg bg-paper text-ink focus:border-red-500 focus:outline-none transition-colors"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-ink-muted">Auto-play voice</div>
                <div className="text-xs text-ink-faint">Automatically speak AI responses</div>
              </div>
              <button
                role="switch"
                aria-checked={settings.autoPlay}
                onClick={() => update('autoPlay', !settings.autoPlay)}
                className={`w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
                  ${settings.autoPlay ? 'bg-red-600' : 'bg-zinc-200'}`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full shadow-sm transition-transform mx-1
                    ${settings.autoPlay ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Learning preferences */}
        <section className="bg-white rounded-xl border border-zinc-900/10 p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Learning preferences</h2>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">
              HSK level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([1, 2, 3, 4] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => update('hskLevel', level)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                    ${settings.hskLevel === level
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-paper text-ink-muted border-zinc-900/18 hover:border-zinc-900/30'
                    }`}
                >
                  HSK {level}{level === 4 ? '+' : ''}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-faint mt-2">
              Controls vocabulary complexity in AI responses
            </p>
          </div>
        </section>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm
            hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          {saved ? '✓ Saved' : 'Save settings'}
        </button>

        {/* Danger zone */}
        <section className="bg-white rounded-xl border border-red-200 p-5">
          <h2 className="text-sm font-semibold text-red-700 mb-2">Danger zone</h2>
          <p className="text-xs text-ink-faint mb-3">
            This clears all progress, streaks, XP, and vocabulary. Your API keys are preserved.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Reset all progress
            </button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <IconAlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span className="text-xs text-red-700 flex-1">This cannot be undone. Are you sure?</span>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-white bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-xs text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
