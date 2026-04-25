import { ExternalLink, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocsLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function DocsLink({ href, children, className }: DocsLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border',
        'bg-muted/50 px-3 py-1.5 text-sm text-foreground',
        'hover:bg-accent hover:border-primary/30 hover:text-primary',
        'transition-colors',
        className
      )}
    >
      <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>{children}</span>
      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
    </a>
  )
}

interface DocsLinksProps {
  links: { label: string; url: string }[]
}

export function DocsLinks({ links = [] }: DocsLinksProps) {
  if (links.length === 0) return null
  return (
    <div className="my-6 flex flex-wrap gap-2">
      <span className="text-xs font-medium text-muted-foreground self-center">Microsoft Docs:</span>
      {links.map((link) => (
        <DocsLink key={link.url} href={link.url}>
          {link.label}
        </DocsLink>
      ))}
    </div>
  )
}
