import type { Message, AIResponse, VocabEntry } from '@/types'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

const FALLBACK_RESPONSE: AIResponse = {
  zh: '对不起，我没有听清楚。',
  pinyin: 'Duìbuqǐ, wǒ méiyǒu tīng qīngchǔ.',
  en: "Sorry, I didn't catch that.",
  feedback: '',
  vocab: [],
  corrected: false,
}

export class AnthropicError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'AnthropicError'
  }
}

export async function sendMessage(
  messages: Message[],
  systemPrompt: string,
  apiKey: string
): Promise<AIResponse> {
  let res: Response
  try {
    res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    })
  } catch {
    throw new AnthropicError('Network error — check your internet connection.')
  }

  if (!res.ok) {
    if (res.status === 401) throw new AnthropicError('Invalid Anthropic API key. Check your key in Settings.', 401)
    if (res.status === 429) throw new AnthropicError('Rate limit exceeded. Please wait a moment and try again.', 429)
    throw new AnthropicError(`API error (${res.status}). Please try again.`, res.status)
  }

  const body = await res.json()
  const raw = (body.content as Array<{ type: string; text: string }> || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')

  return parseAIResponse(raw)
}

function parseAIResponse(raw: string): AIResponse {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(cleaned) as Partial<AIResponse>
    return {
      zh: parsed.zh || FALLBACK_RESPONSE.zh,
      pinyin: parsed.pinyin || '',
      en: parsed.en || '',
      feedback: parsed.feedback || '',
      vocab: normalizeVocab(parsed.vocab),
      corrected: parsed.corrected ?? false,
    }
  } catch {
    // If the model returned plain text instead of JSON, display it as-is
    return { ...FALLBACK_RESPONSE, zh: raw, en: '' }
  }
}

function normalizeVocab(vocab: unknown): VocabEntry[] {
  if (!Array.isArray(vocab)) return []
  return vocab
    .map((v) => {
      if (typeof v === 'string') return { zh: v, pinyin: '', en: '' }
      if (typeof v === 'object' && v !== null) {
        const obj = v as Record<string, unknown>
        return {
          zh: String(obj.zh || ''),
          pinyin: String(obj.pinyin || ''),
          en: String(obj.en || ''),
        }
      }
      return null
    })
    .filter((v): v is VocabEntry => v !== null && v.zh.length > 0)
}
