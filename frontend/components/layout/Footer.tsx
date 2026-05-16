import Link from 'next/link'
import { NAV_ITEMS, getTechNavItems } from '@/lib/constants'

const FOOTER_LINKS = {
  Product: [
    { title: 'Technologies', href: '/technologies' },
    { title: 'About', href: '/about' },
    { title: 'Interview Templates', href: '/interview-templates' },
    { title: 'Progress', href: '/progress' },
  ],
  'dotnet Track': getTechNavItems('dotnet'),
  'Angular Track': getTechNavItems('angular'),
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl py-14">

        {/* Top: brand + columns */}
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0 shadow-sm transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #A78BFA 100%)' }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 3.5h10M2 7h7M2 10.5h9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground tracking-tight">DevPrep</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Structured, deep-dive interview prep for engineers targeting senior and staff-level roles.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Progress saved locally in your browser — no account needed.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_LINKS).map(([group, items]) => (
            <nav key={group} aria-label={`${group} links`}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group}
              </p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom: copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 pt-6">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} DevPrep. Built for engineers by engineers.
          </p>
          <div className="flex items-center gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
