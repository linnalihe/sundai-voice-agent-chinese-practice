'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { saveSettings } from '@/lib/storage'

export default function SetupPage() {
  const router = useRouter()
  const [anthropicKey, setAnthropicKey] = useState('')
  const [elevenLabsKey, setElevenLabsKey] = useState('')
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false)
  const [showFaq, setShowFaq] = useState(false)

  const canStart = anthropicKey.trim().length > 10

  function handleStart() {
    if (!canStart) return
    saveSettings({
      anthropicKey: anthropicKey.trim(),
      elevenLabsKey: elevenLabsKey.trim(),
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-serif text-5xl font-bold text-red-600 mb-3">普通话练习</div>
          <p className="text-lg text-ink-muted">Your Chinese conversation partner</p>
          <p className="text-sm text-ink-faint mt-1">Have real Mandarin conversations from day one</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-900/10 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-ink mb-4">Set up your API keys</h2>

            {/* Anthropic Key */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-ink mb-1.5">
                Anthropic API key <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showAnthropicKey ? 'text' : 'password'}
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-api03-…"
                  autoComplete="off"
                  className="w-full text-sm px-3 py-2.5 pr-10 border border-zinc-900/18 rounded-lg bg-paper text-ink
                    placeholder:text-ink-faint focus:border-red-500 focus:outline-none transition-colors"
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
              <p className="text-xs text-ink-faint mt-1">
                Powers all AI conversations.{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Get your key →
                </a>
              </p>
            </div>

            {/* ElevenLabs Key */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                ElevenLabs API key{' '}
                <span className="text-xs font-normal text-ink-faint">(optional — for voice playback)</span>
              </label>
              <div className="relative">
                <input
                  type={showElevenLabsKey ? 'text' : 'password'}
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  placeholder="Paste your ElevenLabs key…"
                  autoComplete="off"
                  className="w-full text-sm px-3 py-2.5 pr-10 border border-zinc-900/18 rounded-lg bg-paper text-ink
                    placeholder:text-ink-faint focus:border-red-500 focus:outline-none transition-colors"
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
              <p className="text-xs text-ink-faint mt-1">
                Enables native Mandarin voice playback.{' '}
                <a
                  href="https://elevenlabs.io/app/settings/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Get your key →
                </a>
              </p>
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="border-t border-zinc-900/10 pt-4">
            <button
              onClick={() => setShowFaq((v) => !v)}
              className="flex items-center justify-between w-full text-sm text-ink-muted hover:text-ink transition-colors"
            >
              <span>Why do I need these?</span>
              {showFaq ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </button>
            {showFaq && (
              <div className="mt-3 text-xs text-ink-muted leading-relaxed space-y-2">
                <p>
                  <strong className="text-ink">Anthropic</strong> — powers the AI conversation partner (林老师, 王导游, 小李). Your key is stored only in your browser and never sent anywhere except directly to Anthropic.
                </p>
                <p>
                  <strong className="text-ink">ElevenLabs</strong> — converts the AI&apos;s Chinese responses into natural-sounding speech. Completely optional — the app works fine in text-only mode.
                </p>
                <p>Your keys are stored locally in your browser and never leave your device.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm
              hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Start learning →
          </button>
        </div>

        <p className="text-center text-xs text-ink-faint mt-5">
          You won&apos;t see this screen again — keys are saved locally.
        </p>
      </div>
    </div>
  )
}
