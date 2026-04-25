import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-md shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 4h10M2 7h6M2 10h8"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Interviewer App</p>
              <p className="text-xs text-muted-foreground">Progress saved locally in your browser.</p>
            </div>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/progress"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Progress
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
