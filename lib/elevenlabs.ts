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

  // Stop any currently playing audio
  stopCurrentAudio()

  let res: Response
  try {
    res = await fetch(`${ELEVENLABS_API}/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: VOICE_SETTINGS,
      }),
    })
  } catch {
    throw new ElevenLabsError('Could not reach ElevenLabs. Check your network connection.')
  }

  if (!res.ok) {
    if (res.status === 401) throw new ElevenLabsError('Invalid ElevenLabs API key.', 401)
    if (res.status === 429) throw new ElevenLabsError('ElevenLabs credits exhausted or rate limited.', 429)
    throw new ElevenLabsError(`ElevenLabs error (${res.status}).`, res.status)
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
