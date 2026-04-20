'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { cn } from '@/lib/utils'
import type { SearchEntry } from '@/types'

interface SearchPaletteProps {
  open: boolean
  onClose: () => void
  entries: SearchEntry[]
}

export function SearchPalette({ open, onClose, entries }: SearchPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchEntry[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const fuse = useRef(
    new Fuse(entries, {
      keys: ['title', 'summary', 'tags', 'phaseTitle'],
      threshold: 0.3,
      includeScore: true,
    })
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults(entries.slice(0, 8))
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, entries])

  useEffect(() => {
    if (query.trim() === '') {
      setResults(entries.slice(0, 8))
    } else {
      setResults(fuse.current.search(query).map((r) => r.item).slice(0, 8))
    }
    setActiveIndex(0)
  }, [query, entries])

  const handleSelect = (entry: SearchEntry) => {
    router.push(entry.url)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      handleSelect(results[activeIndex]!)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden" aria-label="Search lessons">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search query"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Results */}
        <ul id="search-results" className="max-h-80 overflow-y-auto p-2" role="listbox">
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              No lessons match &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((entry, i) => (
              <li key={entry.id} role="option" aria-selected={i === activeIndex}>
                <button
                  onClick={() => handleSelect(entry)}
                  className={cn(
                    'w-full flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors',
                    i === activeIndex ? 'bg-accent' : 'hover:bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{entry.title}</span>
                    <DifficultyBadge level={entry.difficulty} className="shrink-0" />
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{entry.phaseTitle}</span>
                  {entry.summary && (
                    <span className="text-xs text-muted-foreground/70 line-clamp-1">{entry.summary}</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex gap-4 text-[10px] text-muted-foreground">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> select</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
