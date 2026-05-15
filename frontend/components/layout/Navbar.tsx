'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { MobileDrawer } from './MobileDrawer'
import { NavXPChip } from './NavXPChip'
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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur-md"
      style={{ background: 'oklch(0.095 0.025 270 / 0.85)' }}
    >
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        {/* Mobile drawer */}
        <MobileDrawer />

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="Interviewer App home"
        >
          <div
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 195), oklch(0.68 0.25 320))' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M2 7h6M2 10h8" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <span className="hidden sm:block font-display text-sm font-semibold text-foreground group-hover:text-gradient-brand transition-colors">
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
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'text-[oklch(0.82_0.18_195)] bg-[oklch(0.72_0.18_195/0.1)] shadow-[0_0_0_1px_oklch(0.72_0.18_195/0.2)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-[oklch(1_0_0/0.05)]'
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* XP + Streak chip */}
          <NavXPChip />

          {/* Search */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search lessons"
            className="hidden sm:flex items-center gap-2.5 rounded-lg border border-border bg-[oklch(1_0_0/0.03)] px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-[oklch(1_0_0/0.12)] hover:text-foreground w-40"
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

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
