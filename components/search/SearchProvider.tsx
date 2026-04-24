'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { SearchPalette } from './SearchPalette'
import type { SearchEntry } from '@/types/search'

interface SearchContextValue {
  openSearch: () => void
}

const SearchContext = createContext<SearchContextValue>({ openSearch: () => {} })

export function useSearch() {
  return useContext(SearchContext)
}

interface SearchProviderProps {
  entries: SearchEntry[]
  children: React.ReactNode
}

export function SearchProvider({ entries, children }: SearchProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <SearchContext.Provider value={{ openSearch: () => setOpen(true) }}>
      {children}
      <SearchPalette open={open} onClose={() => setOpen(false)} entries={entries} />
    </SearchContext.Provider>
  )
}
