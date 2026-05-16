import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SearchProvider } from '@/components/search/SearchProvider'
import { GamificationProviders } from '@/components/quest/GamificationProviders'
import { BasketDialogProvider } from '@/components/basket/BasketContext'
import { BasketGlobalUI } from '@/components/basket/BasketProviders'
import { buildSearchIndex } from '@/lib/content'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DevPrep — Senior-Level Interview Preparation',
    template: '%s | DevPrep',
  },
  description:
    'Structured, deep-dive interview prep for engineers targeting senior and staff-level roles. Phase-based learning, interactive challenges, and gamified progress.',
  keywords: ['interview prep', 'technical interviews', 'senior engineer', 'coding interview', '.NET', 'Angular', 'TypeScript', 'system design'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchEntries = buildSearchIndex()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            <BasketDialogProvider>
              <SearchProvider entries={searchEntries}>
                <a href="#main-content" className="skip-to-content">
                  Skip to content
                </a>
                {children}
                <GamificationProviders />
                <BasketGlobalUI />
              </SearchProvider>
            </BasketDialogProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
