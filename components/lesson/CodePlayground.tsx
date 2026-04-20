'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CodePlaygroundProps {
  code: string
  language?: string
  title?: string
  expectedOutput?: string
  fiddleLink?: boolean
  className?: string
}

export function CodePlayground({
  code,
  language = 'csharp',
  title,
  expectedOutput,
  fiddleLink = true,
  className,
}: CodePlaygroundProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fiddleUrl = fiddleLink
    ? `https://dotnetfiddle.net/?code=${encodeURIComponent(code)}`
    : null

  return (
    <div className={cn('my-6 overflow-hidden rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
          {title && <span className="ml-2 text-xs text-muted-foreground font-mono">{title}</span>}
          {!title && (
            <span className="ml-2 text-xs text-muted-foreground font-mono">{language}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {fiddleUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              render={
                <a
                  href={fiddleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in .NET Fiddle"
                  title="Open in .NET Fiddle"
                />
              }
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Code — rendered by Shiki via MDX pipeline, or raw pre */}
      <div className="overflow-x-auto bg-[#f6f8fa] dark:bg-[#0d1117]">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>

      {/* Expected output */}
      {expectedOutput && (
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Output:</p>
          <pre className="text-xs font-mono text-foreground">{expectedOutput}</pre>
        </div>
      )}
    </div>
  )
}
