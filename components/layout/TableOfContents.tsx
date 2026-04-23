'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
}

interface TableOfContentsProps {
  items: TocItem[]
  className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0 && visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className={cn('', className)}>
      <div className="mb-3 flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          On This Page
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'flex items-start gap-2 rounded-md py-1 text-xs leading-relaxed transition-colors',
                item.level === 3 && 'pl-2',
                item.level === 4 && 'pl-4',
                activeId === item.id
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-1.5 h-1 w-1 shrink-0 rounded-full',
                  activeId === item.id ? 'bg-primary' : 'bg-muted-foreground/40'
                )}
              />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
