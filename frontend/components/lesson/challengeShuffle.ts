export interface ShuffledOption {
  opt: string
  isCorrect: boolean
}

function hashChallengeSeed(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededRandom(seed: number) {
  let state = seed || 1
  return () => {
    state = Math.imul(1664525, state) + 1013904223
    return (state >>> 0) / 4294967296
  }
}

export function shuffleChallengeOptions(id: string, options: string[], correctAnswer: number) {
  const indexed: ShuffledOption[] = options.map((opt, i) => ({ opt, isCorrect: i === correctAnswer }))
  const random = seededRandom(hashChallengeSeed(`${id}:${options.join('|')}:${correctAnswer}`))

  for (let i = indexed.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[indexed[i], indexed[j]] = [indexed[j]!, indexed[i]!]
  }

  return {
    options: indexed.map(({ opt }) => opt),
    correctAnswer: indexed.findIndex(({ isCorrect }) => isCorrect),
  }
}
