'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from './ThemeToggle'
import { NAV_ITEMS } from '@/lib/constants'

export function MobileDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu" />}
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={() => setOpen(false)} className="text-primary font-bold">
              Interviewer App
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
                >
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/progress"
                onClick={() => setOpen(false)}
                className="flex flex-col rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
              >
                <span className="font-medium text-sm">Progress</span>
                <span className="text-xs text-muted-foreground">Your learning dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/interview"
                onClick={() => setOpen(false)}
                className="flex flex-col rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
              >
                <span className="font-medium text-sm">Interview Mode</span>
                <span className="text-xs text-muted-foreground">Timed mock quiz</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
