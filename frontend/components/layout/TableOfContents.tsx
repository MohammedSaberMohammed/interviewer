'use client'

import { useEffect, useRef, useState } from 'react'
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
    <nav aria-label="On this page" className={cn('rounded-2xl border border-border bg-card/80 dark:bg-[oklch(0.103_0.018_264/0.90)] dark:border-[oklch(0.820_0.155_195/0.10)] p-4 mb-4', className)}
      style={{ boxShadow: '0 0 0 1px oklch(0.820 0.155 195 / 0.06), 0 8px 32px oklch(0 0 0 / 0.45)' }}>
      <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground dark:text-[oklch(0.58_0.012_264)]">
        On This Page
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block border-l-2 py-1.5 text-xs leading-relaxed transition-all duration-200',
                item.level === 2 && 'pl-3',
                item.level === 3 && 'pl-5',
                item.level === 4 && 'pl-7',
                activeId === item.id
                  ? 'border-[oklch(0.44_0.18_230)] text-[oklch(0.44_0.18_230)] dark:border-[oklch(0.820_0.155_195)] dark:text-[oklch(0.88_0.155_195)] font-medium'
                  : 'border-border text-foreground/55 dark:text-[oklch(0.65_0.010_264)] hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground dark:hover:border-[oklch(0.820_0.155_195/0.40)]'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
