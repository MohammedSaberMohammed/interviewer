import type { Difficulty, PhaseLevel } from '@/types'

/* ─── .NET brand color ────────────────────────────────────────────────────── */
export const DOTNET_PURPLE = '#512BD4'

/* ─── Difficulty config ───────────────────────────────────────────────────── */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bgClass: string; textClass: string }
> = {
  foundation: {
    label: 'Foundation',
    color: '#16a34a',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950',
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  intermediate: {
    label: 'Intermediate',
    color: '#2563eb',
    bgClass: 'bg-blue-100 dark:bg-blue-950',
    textClass: 'text-blue-700 dark:text-blue-400',
  },
  advanced: {
    label: 'Advanced',
    color: '#7c3aed',
    bgClass: 'bg-violet-100 dark:bg-violet-950',
    textClass: 'text-violet-700 dark:text-violet-400',
  },
  expert: {
    label: 'Expert',
    color: '#dc2626',
    bgClass: 'bg-red-100 dark:bg-red-950',
    textClass: 'text-red-700 dark:text-red-400',
  },
}

/* ─── Phase level config ──────────────────────────────────────────────────── */
export const PHASE_LEVEL_CONFIG: Record<
  PhaseLevel,
  { label: string; bgClass: string; textClass: string }
> = {
  junior: {
    label: 'Junior',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950',
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  mid: {
    label: 'Mid-Level',
    bgClass: 'bg-blue-100 dark:bg-blue-950',
    textClass: 'text-blue-700 dark:text-blue-400',
  },
  senior: {
    label: 'Senior',
    bgClass: 'bg-violet-100 dark:bg-violet-950',
    textClass: 'text-violet-700 dark:text-violet-400',
  },
}

/* ─── Callout config ──────────────────────────────────────────────────────── */
export const CALLOUT_CONFIG = {
  info: {
    icon: 'ℹ️',
    label: 'Note',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-200 dark:border-blue-800',
    titleClass: 'text-blue-800 dark:text-blue-300',
  },
  tip: {
    icon: '💡',
    label: 'Tip',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    titleClass: 'text-emerald-800 dark:text-emerald-300',
  },
  warning: {
    icon: '⚠️',
    label: 'Warning',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    titleClass: 'text-amber-800 dark:text-amber-300',
  },
  critical: {
    icon: '🚨',
    label: 'Critical',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800',
    titleClass: 'text-rose-800 dark:text-rose-300',
  },
  trap: {
    icon: '🪤',
    label: 'Interview Trap',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-200 dark:border-purple-800',
    titleClass: 'text-purple-800 dark:text-purple-300',
  },
  senior: {
    icon: '🎯',
    label: 'Senior-Level Insight',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    titleClass: 'text-indigo-800 dark:text-indigo-300',
  },
} as const

/* ─── Navigation items ────────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { title: 'Phases', href: '/phases', description: 'Browse all 13 learning phases' },
  { title: 'Challenges', href: '/challenges', description: 'Practice with code challenges' },
  { title: 'Cheatsheet', href: '/cheatsheet', description: 'Quick reference for interviews' },
  { title: 'Glossary', href: '/glossary', description: '.NET terms A-Z' },
] as const

/* ─── Storage key ─────────────────────────────────────────────────────────── */
export const PROGRESS_STORAGE_KEY = 'interviewer-app-progress-v1'

/* ─── Default interview mode settings ────────────────────────────────────── */
export const DEFAULT_INTERVIEW_CHALLENGE_COUNT = 10
export const DEFAULT_INTERVIEW_TIME_MINUTES = 15

/* ─── Content paths ───────────────────────────────────────────────────────── */
export const CONTENT_DIR = 'content/phases'
