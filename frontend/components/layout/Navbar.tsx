'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, Trophy, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { MobileDrawer } from './MobileDrawer'
import { NAV_ITEMS, getTechNavItems } from '@/lib/constants'
import { useSearch } from '@/components/search/SearchProvider'

interface NavbarProps {
  techSlug?: string
}

export function Navbar({ techSlug }: NavbarProps) {
  const pathname = usePathname()
  const { openSearch } = useSearch()

  const navItems = techSlug ? getTechNavItems(techSlug) : NAV_ITEMS

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        {/* Mobile drawer */}
        <MobileDrawer />

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="Interviewer App home"
        >
          {/* Gradient logo mark */}
          <div
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4h10M2 7h6M2 10h8"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="hidden sm:block text-sm font-semibold text-foreground">
            Interviewer App
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5 ml-2">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                  active
                    ? 'text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                style={active ? { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' } : undefined}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          {/* Search — wide pill on desktop */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search lessons"
            className="hidden sm:flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground w-44"
          >
            <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center rounded border border-border bg-background px-1 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Progress */}
          <Link href="/progress">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Progress"
            >
              <Trophy className="h-4 w-4" />
            </Button>
          </Link>

          {/* Templates */}
          <Link href="/interview-templates" className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              Templates
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
