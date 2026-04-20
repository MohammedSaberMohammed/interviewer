'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { MobileDrawer } from './MobileDrawer'
import { NAV_ITEMS } from '@/lib/constants'
import { useSearch } from '@/components/search/SearchProvider'

export function Navbar() {
  const pathname = usePathname()
  const { openSearch } = useSearch()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        {/* Mobile drawer */}
        <MobileDrawer />

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-primary shrink-0"
          aria-label="Interviewer App home"
        >
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:block">Interviewer App</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground w-48 justify-between"
            onClick={openSearch}
            aria-label="Search lessons"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Search lessons…</span>
            </span>
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Progress link */}
          <Link href="/progress">
            <Button variant="ghost" size="sm" className="hidden md:flex text-xs text-muted-foreground">
              Progress
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
