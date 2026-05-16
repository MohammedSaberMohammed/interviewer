'use client'

import { useEffect, useState } from 'react'
import { TableOfContents } from '@/components/layout/TableOfContents'
import { LessonXPCard } from '@/components/lesson/LessonXPCard'

interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
}

interface LessonTOCProps {
  techSlug: string
}

export function LessonTOC({ techSlug }: LessonTOCProps) {
  const [items, setItems] = useState<TocItem[]>([])

  useEffect(() => {
    const contentEl = document.getElementById('lesson-content')
    if (!contentEl) return

    const headings = contentEl.querySelectorAll('h2, h3, h4')
    const extracted: TocItem[] = []

    headings.forEach((el) => {
      const level = parseInt(el.tagName[1] ?? '2', 10) as 2 | 3 | 4
      const text = el.textContent?.trim() ?? ''

      if (!el.id && text) {
        el.id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 64)
      }

      if (el.id && text) {
        extracted.push({ id: el.id, text, level })
      }
    })

    setItems(extracted)
  }, [])

  return (
    <div>
      {items.length > 0 && <TableOfContents items={items} />}
      <LessonXPCard techSlug={techSlug} />
    </div>
  )
}
