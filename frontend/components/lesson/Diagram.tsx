'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DiagramProps {
  chart: string
  title?: string
  className?: string
}

export function Diagram({ chart, title, className }: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-inter, system-ui)',
        })
        const id = `diagram-${Math.random().toString(36).slice(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        if (!cancelled) setSvg(renderedSvg)
      } catch (err) {
        if (!cancelled) setError(String(err))
      }
    }

    void render()
    return () => { cancelled = true }
  }, [chart])

  return (
    <figure className={cn('my-6 overflow-hidden rounded-xl border border-border', className)}>
      {title && (
        <figcaption className="border-b border-border bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
          {title}
        </figcaption>
      )}
      <div className="bg-background p-4 overflow-x-auto" ref={containerRef}>
        {error ? (
          <p className="text-sm text-destructive font-mono">{error}</p>
        ) : svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} className="flex justify-center" />
        ) : (
          <div className="h-24 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </figure>
  )
}
