import { codeToHtml } from 'shiki'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

interface PreProps {
  children?: React.ReactElement<CodeBlockProps> | React.ReactNode
  className?: string
  [key: string]: unknown
}

// Extracts raw text from React children
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children !== null && typeof children === 'object' && 'props' in children) {
    const el = children as { props: { children?: React.ReactNode } }
    return extractText(el.props.children)
  }
  return ''
}

// MDX renders fenced code blocks as <pre><code className="language-X">...</code></pre>
// This async server component intercepts <pre> and applies Shiki highlighting.
export async function MdxPre({ children, ...props }: PreProps) {
  // Check if the child is a <code> element with a language class
  const codeEl = children as React.ReactElement<CodeBlockProps> | undefined
  const codeClassName = codeEl?.props?.className ?? ''
  const lang = typeof codeClassName === 'string'
    ? codeClassName.replace('language-', '') || 'csharp'
    : 'csharp'

  const code = extractText(codeEl?.props?.children ?? children)

  const supportedLangs = ['csharp', 'typescript', 'tsx', 'json', 'bash', 'xml', 'sql', 'yaml']
  const safeLang = supportedLangs.includes(lang) ? lang : 'csharp'

  try {
    const html = await codeToHtml(code, {
      lang: safeLang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })

    return (
      <div
        className={cn(
          'my-4 overflow-x-auto rounded-lg border border-border text-sm',
          '[&_.shiki]:p-4 [&_.shiki]:m-0 [&_.shiki]:bg-transparent',
          // Dual-theme: show light in light mode, dark in dark mode
          '[&_.shiki.github-dark]:hidden dark:[&_.shiki.github-dark]:block',
          '[&_.shiki.github-light]:block dark:[&_.shiki.github-light]:hidden',
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  } catch {
    // Fallback to plain pre if Shiki fails
    return (
      <pre
        {...props}
        className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm font-mono"
      >
        {children}
      </pre>
    )
  }
}
