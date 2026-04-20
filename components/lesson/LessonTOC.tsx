'use client'

import { useEffect, useState } from 'react'
import { TableOfContents } from '@/components/layout/TableOfContents'

interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
}

export function LessonTOC() {
  const [items, setItems] = useState<TocItem[]>([])

  useEffect(() => {
    const contentEl = document.getElementById('lesson-content')
    if (!contentEl) return

    const headings = contentEl.querySelectorAll('h2, h3, h4')
    const extracted: TocItem[] = []

    headings.forEach((el) => {
      const level = parseInt(el.tagName[1] ?? '2', 10) as 2 | 3 | 4
      const text = el.textContent?.trim() ?? ''

      // Ensure heading has an id for anchor linking
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

  if (items.length === 0) return null

  return <TableOfContents items={items} />
}
