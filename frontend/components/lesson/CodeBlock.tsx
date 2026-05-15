'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGE_LABELS: Record<string, string> = {
  csharp:     'C#',
  typescript: 'TypeScript',
  tsx:        'TSX',
  javascript: 'JavaScript',
  jsx:        'JSX',
  json:       'JSON',
  bash:       'Bash / Shell',
  xml:        'XML',
  sql:        'SQL',
  html:       'HTML',
  css:        'CSS',
  yaml:       'YAML',
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  'data-language'?: string
  'data-filename'?: string
  'data-title'?: string
}

export function CodeBlock({
  children,
  'data-language': language,
  'data-filename': filename,
  'data-title': title,
  style,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  function copy() {
    const text = preRef.current?.textContent ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const fileLabel = filename ?? title
  const langLabel = language ? (LANGUAGE_LABELS[language] ?? language.toUpperCase()) : null

  return (
    <div
      className={cn(
        'not-prose group/code relative my-6 overflow-hidden rounded-2xl border border-border transition-all duration-300',
        'bg-[oklch(0.96_0.006_265)] dark:bg-[oklch(0.10_0.015_270)]',
        'hover:border-primary/30 dark:hover:border-[oklch(0.72_0.18_195/0.3)]',
        'dark:hover:shadow-[0_0_0_1px_oklch(0.72_0.18_195/0.08),0_20px_40px_oklch(0_0_0/0.4)]',
      )}
    >
      {/* Top inset highlight — subtle in light, brighter in dark */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50 dark:opacity-100"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0 0 0 / 0.10), transparent)' }}
        aria-hidden
      />

      {/* ── Header ── */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-border px-4 py-2.5',
          'bg-[oklch(0.92_0.008_265)] dark:bg-[oklch(0.12_0.016_270)]',
          'dark:border-[oklch(1_0_0/0.07)]',
        )}
      >
        {/* macOS dots */}
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="block size-2.5 rounded-full" style={{ background: 'oklch(0.5 0.15 25 / 0.45)' }} />
          <span className="block size-2.5 rounded-full" style={{ background: 'oklch(0.65 0.12 75 / 0.45)' }} />
          <span className="block size-2.5 rounded-full" style={{ background: 'oklch(0.65 0.14 145 / 0.45)' }} />
        </div>

        {/* Filename / language label — centred */}
        <div className="flex flex-1 items-center justify-center gap-2 min-w-0">
          {fileLabel ? (
            <span className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground truncate">
              {fileLabel}
            </span>
          ) : langLabel ? (
            <span className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground/70">
              {langLabel}
            </span>
          ) : null}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
          className="relative flex shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 font-mono text-[11px] text-muted-foreground transition-all hover:border-border hover:text-foreground dark:hover:border-[oklch(1_0_0/0.1)] dark:hover:text-[oklch(0.82_0.18_195)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 text-[oklch(0.8_0.20_145)]"
              >
                <Check className="size-3" aria-hidden />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="size-3" aria-hidden />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Code ── */}
      <pre
        ref={preRef}
        style={{ ...style, background: 'transparent' }}
        className={cn(
          className,
          'code-block overflow-x-auto px-5 py-5 text-[13px] leading-[1.65] !m-0 !rounded-none',
        )}
      >
        {children}
      </pre>
    </div>
  )
}
