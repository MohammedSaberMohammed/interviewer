'use client'

import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { TableOfContents } from '@/components/layout/TableOfContents'

interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
}

interface LessonTOCProps {
  summary?: string
}

export function LessonTOC({ summary }: LessonTOCProps) {
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

  return (
    <div className="space-y-6">
      {items.length > 0 && <TableOfContents items={items} />}

      {/* Key Takeaway card */}
      {summary && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            <p className="text-xs font-semibold text-foreground">Key Takeaway</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{summary}</p>
        </div>
      )}
    </div>
  )
}
