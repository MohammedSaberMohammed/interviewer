import { cn } from '@/lib/utils'

interface ComparisonItem {
  label: string
  detail?: string
}

interface ComparisonSide {
  title: string
  items: (string | ComparisonItem)[]
}

interface ComparisonTableProps {
  // Primary format (used in AI-generated MDX content)
  headers?: string[]
  rows?: string[][]
  // Legacy format
  left?: ComparisonSide
  right?: ComparisonSide
  leftColor?: string
  rightColor?: string
  className?: string
}

function normalizeItem(item: string | ComparisonItem | undefined): ComparisonItem | null {
  if (!item) return null
  return typeof item === 'string' ? { label: item } : item
}

const HEADER_COLORS = [
  'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
  'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300',
  'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
  'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
]

export function ComparisonTable({
  headers,
  rows,
  left,
  right,
  leftColor = 'blue',
  rightColor = 'purple',
  className,
}: ComparisonTableProps) {
  // ── headers/rows format (AI-generated content) ───────────────────────────
  if (headers && headers.length > 0) {
    const colCount = headers.length
    const hasLabelCol = colCount >= 3

    return (
      <div className={cn('my-6 overflow-x-auto rounded-xl border border-border', className)}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={cn(
                    'px-4 py-3 text-left font-semibold border-b border-border',
                    i < colCount - 1 && 'border-r border-border',
                    i === 0 && hasLabelCol
                      ? 'bg-muted/50 text-muted-foreground'
                      : HEADER_COLORS[(i - (hasLabelCol ? 1 : 0)) % HEADER_COLORS.length]
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      'px-4 py-2.5 border-t border-border text-foreground/80',
                      j < row.length - 1 && 'border-r border-border',
                      j === 0 && hasLabelCol && 'font-mono font-semibold text-foreground'
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ── left/right format (original) ─────────────────────────────────────────
  if (!left || !right) return null

  const leftHeaderClass =
    leftColor === 'blue'
      ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
      : 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300'
  const rightHeaderClass =
    rightColor === 'purple'
      ? 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300'
      : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'

  return (
    <div className={cn('my-6 overflow-hidden rounded-xl border border-border', className)}>
      <div className="grid grid-cols-2">
        <div className={cn('px-4 py-3 text-sm font-semibold border-r border-border', leftHeaderClass)}>
          {left.title}
        </div>
        <div className={cn('px-4 py-3 text-sm font-semibold', rightHeaderClass)}>
          {right.title}
        </div>

        {Array.from({ length: Math.max(left.items.length, right.items.length) }).map((_, i) => {
          const leftItem = normalizeItem(left.items[i])
          const rightItem = normalizeItem(right.items[i])
          const isEven = i % 2 === 0

          return (
            <>
              <div
                key={`left-${i}`}
                className={cn(
                  'px-4 py-2.5 border-t border-r border-border text-sm',
                  isEven ? 'bg-background' : 'bg-muted/30'
                )}
              >
                {leftItem && (
                  <>
                    <span className="font-mono text-foreground">{leftItem.label}</span>
                    {leftItem.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5">{leftItem.detail}</p>
                    )}
                  </>
                )}
              </div>
              <div
                key={`right-${i}`}
                className={cn(
                  'px-4 py-2.5 border-t border-border text-sm',
                  isEven ? 'bg-background' : 'bg-muted/30'
                )}
              >
                {rightItem && (
                  <>
                    <span className="font-mono text-foreground">{rightItem.label}</span>
                    {rightItem.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5">{rightItem.detail}</p>
                    )}
                  </>
                )}
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
}
