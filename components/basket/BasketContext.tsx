'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { BasketQuestion } from '@/types/basket'

interface BasketDialogState {
  createOpen: boolean
  selectOpen: boolean
  pendingQuestion: BasketQuestion | null
  // After creating a new basket while adding a question, auto-add to it
  postCreateAction: 'add' | null
}

interface BasketContextValue {
  state: BasketDialogState
  openCreate: () => void
  openCreateForQuestion: (question: BasketQuestion) => void
  openSelect: (question: BasketQuestion) => void
  closeAll: () => void
}

const BasketContext = createContext<BasketContextValue | null>(null)

export function useBasketDialog() {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error('useBasketDialog must be used inside BasketDialogProvider')
  return ctx
}

export function BasketDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BasketDialogState>({
    createOpen: false,
    selectOpen: false,
    pendingQuestion: null,
    postCreateAction: null,
  })

  const openCreate = useCallback(() => {
    setState((s) => ({ ...s, createOpen: true, pendingQuestion: null, postCreateAction: null }))
  }, [])

  const openCreateForQuestion = useCallback((question: BasketQuestion) => {
    setState((s) => ({ ...s, createOpen: true, selectOpen: false, pendingQuestion: question, postCreateAction: 'add' }))
  }, [])

  const openSelect = useCallback((question: BasketQuestion) => {
    setState((s) => ({ ...s, selectOpen: true, pendingQuestion: question }))
  }, [])

  const closeAll = useCallback(() => {
    setState({ createOpen: false, selectOpen: false, pendingQuestion: null, postCreateAction: null })
  }, [])

  return (
    <BasketContext.Provider value={{ state, openCreate, openCreateForQuestion, openSelect, closeAll }}>
      {children}
    </BasketContext.Provider>
  )
}
