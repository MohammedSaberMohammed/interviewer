'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Clock, Sparkles, Trophy, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFirstRun } from './useFirstRun'

const STEPS = [
  {
    tag: 'Step 01 · Welcome',
    headline: ['Welcome to your', 'interview quest.'],
    italicWord: 1,
    body: "This isn't another tutorial site. It's a guided, gamified journey from fundamentals to senior-level interview traps — built for engineers who want to actually pass.",
    cta: 'Begin',
  },
  {
    tag: 'Step 02 · The Path',
    headline: ['13 phases.', 'Each one unlocks', 'the next.'],
    italicWord: 0,
    body: "Every concept builds on the last. You'll go from CLR internals to distributed system design — in the order an interviewer actually expects you to know it.",
    cta: 'Got it',
  },
  {
    tag: 'Step 03 · Quest Pact',
    headline: ['Sign the', 'quest pact.'],
    italicWord: 1,
    body: 'Three commitments power the path:',
    pact: [
      { icon: Clock, color: 'text-[oklch(0.72_0.18_195)]', text: '10 minutes a day, minimum. Daily beats marathon.', bold: '10 minutes a day,' },
      { icon: Sparkles, color: 'text-[oklch(0.85_0.20_320)]', text: 'Phases unlock in order. Foundations first, always.', bold: 'Phases unlock in order.' },
      { icon: Trophy, color: 'text-[oklch(0.88_0.18_85)]', text: "Challenges aren't optional. Read + solve = remember.", bold: "Challenges aren't optional." },
    ],
    cta: "I'm in",
  },
  {
    tag: 'Step 04 · Choose Stack',
    headline: ['Pick your', 'technology.'],
    italicWord: 1,
    body: "Each stack has its own 13-phase curriculum. Start with what your next interview demands. You can add stacks anytime.",
    cta: 'Choose my stack',
    isFinal: true,
  },
]

interface OnboardingDialogProps {
  className?: string
}

export function OnboardingDialog({ className }: OnboardingDialogProps) {
  const { isFirstRun, markComplete } = useFirstRun()
  const [step, setStep] = useState(0)
  const router = useRouter()

  if (!isFirstRun) return null

  const current = STEPS[step]!
  if (!current) return null

  function advance() {
    if (current.isFinal) {
      markComplete()
      router.push('/technologies')
    } else {
      setStep((s) => s + 1)
    }
  }

  function dismiss() {
    markComplete()
  }

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={dismiss}
      />

      {/* Modal */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
        className="relative z-10 w-full max-w-[520px] rounded-3xl border border-border bg-gradient-to-b from-card to-background p-10 shadow-[0_40px_100px_rgba(0,0,0,.6)]"
      >
        {/* Conic glow behind card */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-20 blur-2xl -z-10"
          style={{ background: 'conic-gradient(from 0deg, #22d3ee, #d946ef, #fbbf24, #22d3ee)' }}
          aria-hidden
        />

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Skip onboarding"
        >
          <X className="size-4" />
        </button>

        {/* Step tag */}
        <p className="mb-5 font-mono text-[11px] tracking-[0.18em] uppercase text-[oklch(0.85_0.20_320)]">
          {current.tag}
        </p>

        {/* Headline */}
        <h2 className="mb-4 font-display text-4xl font-medium leading-[1.05] tracking-tight">
          {current.headline.map((line, i) =>
            i === current.italicWord ? (
              <span key={i} className="block italic font-light text-gradient-brand">{line}</span>
            ) : (
              <span key={i} className="block">{line}</span>
            )
          )}
        </h2>

        <p className="mb-6 text-[15px] leading-relaxed text-muted-foreground">{current.body}</p>

        {/* Pact items */}
        {current.pact && (
          <div className="mb-7 space-y-3 rounded-xl border border-dashed border-border p-4 bg-black/20">
            {current.pact.map(({ icon: Icon, color, text, bold }) => (
              <div key={bold} className="flex gap-3 items-start text-sm">
                <Icon className={cn('mt-0.5 size-4 shrink-0', color)} />
                <span className="text-foreground/80">
                  <strong className="text-foreground font-semibold">{bold}</strong>{' '}
                  {text.replace(bold, '').trim()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Progress dots */}
        <div className="mb-7 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                i < step ? 'w-6 bg-[oklch(0.72_0.18_195/0.5)]' : i === step ? 'w-6 bg-[oklch(0.72_0.18_195)] shadow-[0_0_10px_oklch(0.72_0.18_195)]' : 'w-6 bg-border'
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={dismiss}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
          <Button onClick={advance} size="lg" className="gap-2">
            {current.cta}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
