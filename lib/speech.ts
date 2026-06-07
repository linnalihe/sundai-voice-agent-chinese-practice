'use client'

export type SpeechStatus = 'idle' | 'listening' | 'error' | 'unsupported'

function getSR(): (new () => SpeechRecognition) | undefined {
  if (typeof window === 'undefined') return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => SpeechRecognition) | undefined
}

export function isSpeechSupported(): boolean {
  return !!getSR()
}

type SpeechCallbacks = {
  onInterimResult: (text: string) => void
  onFinalResult: (text: string) => void
  onStatusChange: (status: SpeechStatus) => void
  onError: (msg: string) => void
}

export function createSpeechRecognizer(callbacks: SpeechCallbacks) {
  const SR = getSR()

  if (!SR) {
    return {
      start: () => callbacks.onError('Speech recognition is not supported in this browser. Try Chrome or Edge.'),
      stop: () => {},
    }
  }

  const rec = new SR()
  rec.lang = 'zh-CN'
  rec.continuous = false
  rec.interimResults = true

  let transcript = ''

  rec.onstart = () => {
    transcript = ''
    callbacks.onStatusChange('listening')
  }

  rec.onresult = (e: SpeechRecognitionEvent) => {
    transcript = Array.from(e.results)
      .map((r) => r[0].transcript)
      .join('')
    callbacks.onInterimResult(transcript)
  }

  rec.onend = () => {
    callbacks.onStatusChange('idle')
    if (transcript.trim()) {
      callbacks.onFinalResult(transcript.trim())
    }
  }

  rec.onerror = (e: SpeechRecognitionErrorEvent) => {
    callbacks.onStatusChange('error')
    const msg =
      e.error === 'not-allowed'
        ? 'Microphone access denied. Allow mic permissions and try again.'
        : e.error === 'no-speech'
        ? 'No speech detected. Try speaking closer to the mic.'
        : 'Microphone error — try typing instead.'
    callbacks.onError(msg)
  }

  return {
    start: () => {
      try { rec.start() } catch {
        callbacks.onError('Could not start mic. Try again.')
      }
    },
    stop: () => {
      try { rec.stop() } catch { /* ignore */ }
    },
  }
}
