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
    <header className="sticky top-0 z-40 w-full">
      {/* Glass border bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="backdrop-blur-xl bg-background/85 supports-[backdrop-filter]:bg-background/75 h-14 flex items-center">
        <div className="container mx-auto flex h-full items-center gap-4 px-4 max-w-7xl">

          {/* Mobile drawer */}
          <MobileDrawer />

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="DevPrep home"
          >
            {/* Gradient logo mark */}
            <div
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0 shadow-sm transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #A78BFA 100%)' }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 3.5h10M2 7h7M2 10.5h9"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-foreground tracking-tight">
              DevPrep
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5 ml-2">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150',
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
                  )}
                >
                  {active && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'linear-gradient(135deg, oklch(0.585 0.22 264 / 0.12), oklch(0.65 0.24 290 / 0.08))' }}
                    />
                  )}
                  <span className="relative">{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search pill (desktop) */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search lessons"
              className="hidden sm:flex items-center gap-2.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground w-44 group"
            >
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">Search…</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center rounded border border-border bg-background px-1 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            {/* Search icon (mobile) */}
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
      </div>
    </header>
  )
}
