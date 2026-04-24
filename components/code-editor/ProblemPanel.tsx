import type { CodeProblem } from '@/types/code-editor'
import { DIFFICULTY_CONFIG } from '@/lib/constants'

interface ProblemPanelProps {
  problem: CodeProblem
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  return (
    <div className="p-4 space-y-3 h-full overflow-y-auto">
      <div>
        <h2 className="text-base font-semibold">{problem.title}</h2>
        <div className="mt-1 flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_CONFIG.foundation.bgClass} ${DIFFICULTY_CONFIG.foundation.textClass}`}>
            Foundation
          </span>
        </div>
      </div>

      <div
        className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: mdToHtml(problem.description) }}
      />
    </div>
  )
}

/* Very minimal markdown → HTML for the problem description (no external dep) */
function mdToHtml(md: string): string {
  return md
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}
