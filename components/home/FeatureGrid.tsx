import { BookOpen, Zap, TrendingUp, Target, FileText } from 'lucide-react'

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Progressive Difficulty',
    description: 'Junior → Mid → Senior, no gaps. Every phase builds on the last, ensuring you never hit a wall.',
  },
  {
    icon: Target,
    title: 'Trap-Focused',
    description: 'Dedicated lessons on misleading concepts. The gotchas that trip up even experienced engineers.',
  },
  {
    icon: Zap,
    title: 'Interactive, Not Passive',
    description: 'Every lesson includes code challenges where you predict output. Learn by doing, not scrolling.',
  },
  {
    icon: BookOpen,
    title: 'Foundation-First',
    description: 'We build mental models, not answer lists. Understand why C# works the way it does.',
  },
  {
    icon: FileText,
    title: 'Documentation-Anchored',
    description: 'Every topic links to authoritative Microsoft Docs. No guessing, no folklore.',
  },
]

export function FeatureGrid() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">What Makes This Different</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Most prep resources give you answers to memorize. We give you understanding that survives follow-up questions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-background p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
