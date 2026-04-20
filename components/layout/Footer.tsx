import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">Interviewer App</span>
            <span className="text-muted-foreground text-sm">— .NET Senior Interview Prep</span>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
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
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-xs text-muted-foreground">
            Progress saved locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
