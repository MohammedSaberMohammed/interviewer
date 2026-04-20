'use client'

import { createContext, useContext } from 'react'

export interface QuestContextValue {
  questMode: boolean
  stepIds: string[]
  activeStepId: string
  totalSteps: number
  currentStepIndex: number
  advanceStep: () => void
  setActiveStep: (id: string) => void
}

export const QuestContext = createContext<QuestContextValue | null>(null)

export function useQuestContext() {
  return useContext(QuestContext)
}
