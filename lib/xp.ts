export const XP = {
  lessonComplete: 50,
  correction: 5,
  vocabWord: 2,
  dailyPractice: 10,
} as const

// Returns total XP earned for a completed turn
export function calcTurnXp(opts: {
  corrected: boolean
  newVocabCount: number
  isFirstTurnToday: boolean
  isLessonJustComplete: boolean
}): number {
  let xp = 0
  if (opts.corrected) xp += XP.correction
  xp += opts.newVocabCount * XP.vocabWord
  if (opts.isFirstTurnToday) xp += XP.dailyPractice
  if (opts.isLessonJustComplete) xp += XP.lessonComplete
  return xp
}
