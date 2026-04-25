'use client'

import { useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGE_LABELS: Record<string, string> = {
  csharp:     'C#',
  typescript: 'TypeScript',
  tsx:        'TSX',
  javascript: 'JavaScript',
  jsx:        'JSX',
  json:       'JSON',
  bash:       'Bash',
  xml:        'XML',
  sql:        'SQL',
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  'data-language'?: string
}

export function CodeBlock({ children, 'data-language': language, style, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  function copy() {
    const text = preRef.current?.textContent ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const langLabel = language ? (LANGUAGE_LABELS[language] ?? language) : 'code'

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border shadow-sm">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-border bg-slate-50 px-4 py-2.5 dark:bg-white/[0.04]">

        {/* macOS window dots */}
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="block h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="block h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Language — centred */}
        <span className="flex-1 select-none text-center text-[11px] font-mono font-medium tracking-wider text-muted-foreground/60">
          {langLabel}
        </span>

        {/* Copy button */}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground/60 transition-all hover:border-border hover:bg-background hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* ── Code ───────────────────────────────────────────────────────────── */}
      <pre
        ref={preRef}
        style={style}
        className={cn(
          className,
          'code-block overflow-x-auto px-5 py-5 text-sm leading-relaxed !m-0 !rounded-none',
        )}
      >
        {children}
      </pre>
    </div>
  )
}
