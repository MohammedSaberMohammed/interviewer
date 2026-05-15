'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const content = document.getElementById('lesson-content')
      if (!content) {
        const el = document.documentElement
        const scrollTop = el.scrollTop || document.body.scrollTop
        const scrollHeight = el.scrollHeight - el.clientHeight
        setProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0)
        return
      }
      const rect = content.getBoundingClientRect()
      const totalHeight = rect.height
      const visible = -rect.top
      setProgress(Math.min(100, Math.max(0, (visible / (totalHeight - window.innerHeight)) * 100)))
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
