import { X, Check } from 'lucide-react'

interface MythBusterProps {
  myth: string
  // Accept both 'truth' (original) and 'reality' (AI-generated MDX format)
  truth?: string
  reality?: string
  explanation?: string
  example?: string
}

export function MythBuster({ myth, truth, reality, explanation, example }: MythBusterProps) {
  const displayTruth = truth ?? reality ?? ''
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border">
      {/* Myth */}
      <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/40 border-b border-border px-4 py-3">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-200 dark:bg-rose-900">
          <X className="h-3 w-3 text-rose-700 dark:text-rose-300" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400 mb-0.5">
            Common Myth
          </p>
          <p className="text-sm text-rose-800 dark:text-rose-200 line-through decoration-rose-400">
            {myth}
          </p>
        </div>
      </div>

      {/* Truth */}
      <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-900">
          <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-0.5">
            The Truth
          </p>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{displayTruth}</p>
          {explanation && (
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{explanation}</p>
          )}
          {example && (
            <pre className="mt-2 text-xs font-mono bg-emerald-100 dark:bg-emerald-900/40 rounded p-2 overflow-x-auto whitespace-pre-wrap">
              {example}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
