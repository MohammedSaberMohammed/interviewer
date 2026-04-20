import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Basket, BasketQuestion } from '@/types'

const BASKET_STORAGE_KEY = 'interviewer-app-baskets-v1'

// Validates a stored BasketQuestion has all required display fields
function isValidStoredQuestion(q: BasketQuestion): boolean {
  if (q.type === 'lesson') return true
  // challenge/quiz require options + question to render
  return !!(q.options?.length && q.question !== undefined)
}

interface BasketState {
  baskets: Basket[]
  questions: Record<string, BasketQuestion> // keyed by question id

  createBasket: (name: string) => Basket
  deleteBasket: (basketId: string) => void
  addQuestionToBasket: (basketId: string, question: BasketQuestion) => void
  removeQuestionFromBasket: (basketId: string, questionId: string) => void
  reorderQuestions: (basketId: string, newOrder: string[]) => void
  isInBasket: (basketId: string, questionId: string) => boolean
  isInAnyBasket: (questionId: string) => boolean
  getBasket: (basketId: string) => Basket | undefined
  getQuestion: (questionId: string) => BasketQuestion | undefined
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      baskets: [],
      questions: {},

      createBasket: (name) => {
        const basket: Basket = {
          id: `basket-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: name.trim(),
          createdAt: Date.now(),
          questionIds: [],
        }
        set((s) => ({ baskets: [...s.baskets, basket] }))
        return basket
      },

      deleteBasket: (basketId) =>
        set((s) => ({ baskets: s.baskets.filter((b) => b.id !== basketId) })),

      addQuestionToBasket: (basketId, question) => {
        const { baskets, questions, isInBasket } = get()
        if (isInBasket(basketId, question.id)) return
        set({
          baskets: baskets.map((b) =>
            b.id === basketId
              ? { ...b, questionIds: [...b.questionIds, question.id] }
              : b
          ),
          questions: { ...questions, [question.id]: { ...question, addedAt: Date.now() } },
        })
      },

      removeQuestionFromBasket: (basketId, questionId) =>
        set((s) => ({
          baskets: s.baskets.map((b) =>
            b.id === basketId
              ? { ...b, questionIds: b.questionIds.filter((id) => id !== questionId) }
              : b
          ),
        })),

      reorderQuestions: (basketId, newOrder) =>
        set((s) => ({
          baskets: s.baskets.map((b) =>
            b.id === basketId ? { ...b, questionIds: newOrder } : b
          ),
        })),

      isInBasket: (basketId, questionId) => {
        const basket = get().baskets.find((b) => b.id === basketId)
        return basket?.questionIds.includes(questionId) ?? false
      },

      isInAnyBasket: (questionId) =>
        get().baskets.some((b) => b.questionIds.includes(questionId)),

      getBasket: (basketId) => get().baskets.find((b) => b.id === basketId),

      getQuestion: (questionId) => get().questions[questionId],
    }),
    {
      name: BASKET_STORAGE_KEY,
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const raw = persistedState as { baskets?: Basket[]; questions?: Record<string, BasketQuestion> }
        if (version < 1) {
          // Remove challenge/quiz items that are missing required display fields
          const questions = raw.questions ?? {}
          const validQuestions: Record<string, BasketQuestion> = {}
          for (const [id, q] of Object.entries(questions)) {
            if (isValidStoredQuestion(q)) validQuestions[id] = q
          }
          const validIds = new Set(Object.keys(validQuestions))
          return {
            ...raw,
            questions: validQuestions,
            baskets: (raw.baskets ?? []).map((b) => ({
              ...b,
              questionIds: b.questionIds.filter((id) => validIds.has(id)),
            })),
          }
        }
        return raw
      },
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return { getItem: () => null, setItem: () => undefined, removeItem: () => undefined }
        }
        return localStorage
      }),
      skipHydration: true,
    }
  )
)
