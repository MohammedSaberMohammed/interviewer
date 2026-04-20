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

/**
 * Custom <pre> MDX component — wraps Shiki-highlighted code blocks with:
 * - a language label header
 * - a copy-to-clipboard button
 */
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
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border">
      {/* Header: language label + copy button */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="text-xs font-mono font-medium text-muted-foreground">{langLabel}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
          className="rounded p-1 text-muted-foreground/50 transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied
            ? <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            : <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Shiki-rendered code — preserve inline style for dual-theme colours */}
      <pre
        ref={preRef}
        style={style}
        className={cn(className, 'overflow-x-auto p-4 text-sm !m-0 !rounded-none')}
      >
        {children}
      </pre>
    </div>
  )
}
