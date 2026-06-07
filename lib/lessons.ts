import type { LessonDef } from '@/types'

const JSON_SCHEMA = `{"zh":"your Mandarin reply — always end with a natural follow-up question to keep the conversation going","pinyin":"full pinyin with tone marks for zh","en":"natural English translation of zh","feedback":"1-2 sentences of kind encouraging feedback on the student's Chinese grammar or word choice. If they wrote in English, gently encourage them to try Chinese. Empty string if no feedback needed.","nativeSay":{"zh":"if the student wrote in Chinese or pinyin, rewrite their message the way a fluent native speaker would naturally say it. Empty string if they wrote in English, or if their Chinese was already perfectly natural.","pinyin":"pinyin for nativeSay zh, or empty string","en":"English translation of nativeSay zh, or empty string"},"vocab":[{"zh":"new word","pinyin":"pīnyīn","en":"meaning"}],"corrected":false}`

function buildSystemPrompt(persona: string, scenario: string, hskLevel: number): string {
  const levelDesc =
    hskLevel <= 2 ? 'HSK 2 (elementary) — simple short sentences, common vocabulary only'
    : hskLevel === 3 ? 'HSK 3 (intermediate) — moderate complexity, varied sentence structures'
    : 'HSK 4+ (upper-intermediate) — natural conversational pace, richer vocabulary'

  return `${persona}

${scenario}

Student level: ${levelDesc}. Match your language complexity to their level.

Two rules to follow on every turn:
1. Always end your reply ("zh") with a natural follow-up question — this keeps the conversation flowing.
2. In "nativeSay", give a fluent native-speaker version of what the STUDENT just said (not your own reply). Leave it empty if they wrote in English or used perfectly natural Chinese already.

IMPORTANT: Respond ONLY with valid JSON — no markdown fences, no extra text before or after:
${JSON_SCHEMA}`
}

export const LESSONS: LessonDef[] = [
  {
    id: 0,
    zh: '自我介绍',
    en: 'Introductions & hobbies',
    color: 'red',
    tags: ['名字', '爱好', '家庭'],
    persona: '林老师 (Lín Lǎoshī)',
    personaRole: 'Warm language teacher',
    goals: [
      'Introduce yourself — name, where you\'re from',
      'Talk about your hobbies and interests',
      'Ask and answer questions about family',
    ],
    starters: ['你好！我叫…', '我来自美国', '我喜欢打篮球', '我有一个姐姐'],
    systemPrompt: (hskLevel) =>
      buildSystemPrompt(
        'You are 林老师 (Lín Lǎoshī), a warm and encouraging native Mandarin speaker meeting a beginner student for the first time.',
        'Have a genuinely natural conversation about names, where the student is from, their hobbies and interests, and their family. React genuinely to what the student says. Ask natural follow-up questions like a real person would. Be patient and encouraging — celebrate when they try Chinese.',
        hskLevel
      ),
  },
  {
    id: 1,
    zh: '旅行问路',
    en: 'Travel & directions',
    color: 'teal',
    tags: ['地点', '方向', '推荐'],
    persona: '王导游 (Wáng Dǎoyóu)',
    personaRole: 'Friendly Beijing local guide',
    goals: [
      'Ask for and give directions around the city',
      'Discuss famous sights and places to visit',
      'Talk about transport options and tips',
    ],
    starters: ['请问，天安门怎么走？', '地铁站在哪里？', '你推荐去哪里玩？', '打车要多少钱？'],
    systemPrompt: (hskLevel) =>
      buildSystemPrompt(
        'You are 王导游 (Wáng Dǎoyóu), a friendly and enthusiastic local guide in Beijing who loves helping visitors explore the city.',
        'Have a natural conversation about getting around Beijing: asking and giving directions, recommending famous sights, discussing transport options (subway, taxi, bus), and sharing local tips. Be warm and enthusiastic about your city — share genuine "favourites" and help them feel at ease.',
        hskLevel
      ),
  },
  {
    id: 2,
    zh: '美食点餐',
    en: 'Food & ordering',
    color: 'gold',
    tags: ['菜单', '口味', '餐厅'],
    persona: '小李 (Xiǎo Lǐ)',
    personaRole: 'Enthusiastic restaurant waiter',
    goals: [
      'Order food from a menu and ask about dishes',
      'Describe taste preferences (spicy, sweet, etc.)',
      'Talk about favourite Chinese foods and cuisine',
    ],
    starters: ['我想要一碗面', '你们有什么推荐？', '我不吃辣的', '我最喜欢饺子'],
    systemPrompt: (hskLevel) =>
      buildSystemPrompt(
        'You are 小李 (Xiǎo Lǐ), a cheerful and enthusiastic waiter at a popular Beijing restaurant.',
        'Have a natural conversation: take their order, recommend dishes enthusiastically, talk about taste preferences (spicy, sweet, sour, etc.), discuss favourite Chinese foods and cuisine. Be warm, excited about food, and make them feel welcome. Share your own "favourites" to make the conversation feel real.',
        hskLevel
      ),
  },
]

export function getLessonById(id: number): LessonDef | undefined {
  return LESSONS.find((l) => l.id === id)
}
