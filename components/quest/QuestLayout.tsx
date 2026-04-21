'use client'

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { QuestContext, type QuestContextValue } from './QuestContext'
import { QuestHUD } from './QuestHUD'
import { QuestCompletionScreen } from './QuestCompletionScreen'
import { useProgressStore } from '@/stores/progressStore'
import { XP_AWARDS } from '@/lib/constants'
import { analytics } from '@/lib/analytics'
import { LessonContext, type LessonContextValue } from '@/components/lesson/LessonContext'

interface QuestLayoutProps {
  phaseSlug: string
  lessonSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
  stepIds: string[]         // ordered list of QuestStep IDs extracted from MDX frontmatter
  questMode: boolean
  children: ReactNode
  nextLesson?: { slug: string; title: string } | null
}

export function QuestLayout({
  phaseSlug,
  lessonSlug,
  lessonTitle,
  phaseTitle,
  phaseNumber,
  stepIds,
  questMode,
  children,
  nextLesson,
}: QuestLayoutProps) {
  const awardXP = useProgressStore((s) => s.awardXP)
  const recordLessonComplete = useProgressStore((s) => s.recordLessonComplete)

  const [activeStepId, setActiveStepId] = useState(stepIds[0] ?? '')
  const [xpEarnedThisSession, setXpEarnedThisSession] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const stepStartTimeRef = useRef(Date.now())
  const lessonStartTimeRef = useRef(Date.now())

  const isQuestActive = questMode && stepIds.length > 0

  const currentStepIndex = stepIds.indexOf(activeStepId)

  // Listen for badge unlocks while in this lesson
  useEffect(() => {
    const handler = (e: Event) => {
      const { badgeId } = (e as CustomEvent<{ badgeId: string }>).detail
      setNewlyUnlockedBadges((prev) => [...prev, badgeId])
    }
    window.addEventListener('badge:unlocked', handler)
    return () => window.removeEventListener('badge:unlocked', handler)
  }, [])

  // Listen for XP award to track session total
  useEffect(() => {
    const handler = (e: Event) => {
      const { amount } = (e as CustomEvent<{ amount: number }>).detail
      setXpEarnedThisSession((prev) => prev + amount)
    }
    window.addEventListener('xp:award', handler)
    return () => window.removeEventListener('xp:award', handler)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isQuestActive) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        advanceStep()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const advanceStep = useCallback(() => {
    const now = Date.now()
    const timeMs = now - stepStartTimeRef.current
    stepStartTimeRef.current = now

    analytics.questStepCompleted(
      `${phaseSlug}/${lessonSlug}`,
      activeStepId,
      true,
      1,
      timeMs,
    )

    // Award step XP
    awardXP(XP_AWARDS.STEP_COMPLETE, 'Step complete')

    if (currentStepIndex >= stepIds.length - 1) {
      // Last step — complete the lesson
      const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 100
      const totalTime = now - lessonStartTimeRef.current

      recordLessonComplete(phaseSlug, lessonSlug, accuracy)
      analytics.questLessonCompleted(
        `${phaseSlug}/${lessonSlug}`,
        xpEarnedThisSession,
        accuracy,
        totalTime,
      )
      setCompleted(true)
    } else {
      const nextId = stepIds[currentStepIndex + 1] ?? stepIds[0] ?? ''
      setActiveStepId(nextId)
      analytics.questStepStarted(`${phaseSlug}/${lessonSlug}`, nextId, currentStepIndex + 1)
    }
  }, [
    activeStepId,
    currentStepIndex,
    stepIds,
    phaseSlug,
    lessonSlug,
    awardXP,
    recordLessonComplete,
    xpEarnedThisSession,
    correctAnswers,
    totalAnswers,
  ])

  const setActiveStep = useCallback((id: string) => {
    setActiveStepId(id)
    stepStartTimeRef.current = Date.now()
  }, [])

  const contextValue: QuestContextValue = {
    questMode: isQuestActive,
    stepIds,
    activeStepId,
    totalSteps: stepIds.length,
    currentStepIndex,
    advanceStep,
    setActiveStep,
  }

  const lessonContextValue: LessonContextValue = {
    lessonSlug,
    phaseSlug,
    lessonTitle,
    phaseTitle,
    phaseNumber,
  }

  if (completed) {
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 100
    return (
      <QuestCompletionScreen
        phaseSlug={phaseSlug}
        lessonSlug={lessonSlug}
        lessonTitle={lessonTitle}
        xpEarned={xpEarnedThisSession}
        accuracy={accuracy}
        nextLesson={nextLesson}
        newlyUnlockedBadges={newlyUnlockedBadges}
      />
    )
  }

  return (
    <LessonContext.Provider value={lessonContextValue}>
    <QuestContext.Provider value={contextValue}>
      {isQuestActive && (
        <QuestHUD
          phaseSlug={phaseSlug}
          totalSteps={stepIds.length}
          currentStep={currentStepIndex}
          xpEarnedThisSession={xpEarnedThisSession}
        />
      )}
      <div className="relative">
        {children}

        {/* Continue button for non-interactive steps */}
        {isQuestActive && (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={advanceStep}
              className="inline-flex items-center gap-2 rounded-lg bg-[#512BD4] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#512BD4]"
            >
              {currentStepIndex >= stepIds.length - 1 ? 'Complete quest' : 'Continue'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </QuestContext.Provider>
    </LessonContext.Provider>
  )
}
