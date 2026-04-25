'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface LessonContextValue {
  techSlug: string
  lessonSlug: string
  phaseSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
}

export const LessonContext = createContext<LessonContextValue | null>(null)

export function useLessonContext() {
  return useContext(LessonContext)
}

export function LessonContextProvider({
  value,
  children,
}: {
  value: LessonContextValue
  children: ReactNode
}) {
  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
}
