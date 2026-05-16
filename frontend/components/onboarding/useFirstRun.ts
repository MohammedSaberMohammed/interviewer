'use client'

import { useState, useEffect } from 'react'

const KEY = 'interviewer-app-onboarded-v1'

export function useFirstRun() {
  const [isFirstRun, setIsFirstRun] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(KEY)
    setIsFirstRun(!done)
    setChecked(true)
  }, [])

  function markComplete() {
    localStorage.setItem(KEY, '1')
    setIsFirstRun(false)
  }

  return { isFirstRun: checked && isFirstRun, markComplete }
}
