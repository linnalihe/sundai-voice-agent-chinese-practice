// Standard TTS endpoint (non-streaming) — simpler CORS behavior than /stream
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech'
const MODEL_ID = 'eleven_flash_v2_5'
const VOICE_SETTINGS = { stability: 0.55, similarity_boost: 0.75, style: 0.25 }

export class ElevenLabsError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'ElevenLabsError'
  }
}

let currentAudio: HTMLAudioElement | null = null

export async function speakText(
  text: string,
  apiKey: string,
  voiceId: string = 'pNInz6obpgDQGcFmaJgB'
): Promise<void> {
  if (!text.trim()) return

  stopCurrentAudio()

  let res: Response
  try {
    res = await fetch(`${ELEVENLABS_API}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: VOICE_SETTINGS,
      }),
    })
  } catch {
    throw new ElevenLabsError(
      'Could not reach ElevenLabs. Check your network connection (or try http://localhost:3000 if on https).'
    )
  }

  if (!res.ok) {
    // Read the body so we can surface what ElevenLabs actually said
    let detail = ''
    try {
      const body = await res.json() as { detail?: { message?: string } | string }
      if (typeof body.detail === 'string') detail = body.detail
      else if (body.detail?.message) detail = body.detail.message
    } catch { /* response wasn't JSON */ }

    if (res.status === 401) {
      throw new ElevenLabsError(
        detail
          ? `ElevenLabs auth failed: ${detail}`
          : 'Invalid ElevenLabs API key — double-check it in Settings.',
        401
      )
    }
    if (res.status === 422) {
      throw new ElevenLabsError(
        detail ? `ElevenLabs rejected the request: ${detail}` : 'ElevenLabs could not process this text.',
        422
      )
    }
    if (res.status === 429) {
      throw new ElevenLabsError('ElevenLabs credits exhausted or rate limited.', 429)
    }
    throw new ElevenLabsError(
      `ElevenLabs error ${res.status}${detail ? ': ' + detail : ''}.`,
      res.status
    )
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  currentAudio = new Audio(url)
  currentAudio.onended = () => {
    URL.revokeObjectURL(url)
    currentAudio = null
  }
  currentAudio.onerror = () => {
    URL.revokeObjectURL(url)
    currentAudio = null
  }
  await currentAudio.play()
}

export function stopCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused
}

// Curated voice options for Chinese TTS
export const VOICE_OPTIONS = [
  { id: 'pNInz6obpgDQGcFmaJgB', label: 'Adam (Default)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
  { id: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
  { id: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
]
