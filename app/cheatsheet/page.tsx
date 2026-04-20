import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Cheatsheet',
  description: 'Quick-reference .NET interview cheatsheet covering C#, async, EF Core, and more.',
}

const SECTIONS = [
  {
    id: 'csharp-types',
    title: '⚙️ C# Types & Memory',
    content: [
      { label: 'Value types', value: 'struct, enum, primitives, DateTime, Guid — stored inline, copied on assignment' },
      { label: 'Reference types', value: 'class, interface, delegate, string, arrays — pointer + heap object' },
      { label: 'Boxing', value: 'int → object causes heap allocation. Avoid in hot paths. Use generics.' },
      { label: 'Nullable value type', value: 'int? = Nullable<int>. HasValue + Value. Never null check without ??' },
      { label: 'NRT (C# 8+)', value: 'string? = annotation only. No runtime null, just compiler warnings.' },
    ],
  },
  {
    id: 'async',
    title: '⚡ Async/Await',
    content: [
      { label: 'async/await', value: 'Compiles to state machine. No new thread by default.' },
      { label: 'ConfigureAwait(false)', value: 'Skip SynchronizationContext capture. Use in library code.' },
      { label: 'Deadlock', value: 'Task.Wait() + SynchronizationContext = deadlock. Always await.' },
      { label: 'async void', value: 'Only for event handlers. Exceptions are uncatchable.' },
      { label: 'ValueTask', value: 'Use when result is often synchronous. Avoid awaiting twice.' },
      { label: 'CancellationToken', value: 'Always accept in public async APIs. Check IsCancellationRequested.' },
    ],
  },
  {
    id: 'linq',
    title: '🔧 LINQ',
    content: [
      { label: 'Deferred execution', value: 'Where/Select/OrderBy do not execute until iterated.' },
      { label: 'Immediate execution', value: 'ToList(), ToArray(), Count(), First() execute immediately.' },
      { label: 'IEnumerable vs IQueryable', value: 'IQueryable builds an expression tree (SQL). IEnumerable runs in-memory.' },
      { label: 'Multiple enumeration', value: 'var q = ...; q.Count(); q.ToList() — hits DB/memory twice. Call ToList() once.' },
      { label: 'LINQ pitfall', value: 'Closure capture in lambdas can cause unexpected behavior in loops.' },
    ],
  },
  {
    id: 'gc',
    title: '🧠 GC & Memory',
    content: [
      { label: 'Gen 0/1/2', value: 'Short-lived → Gen 0. Survives → Gen 1 → Gen 2. GC is generational.' },
      { label: 'LOH', value: 'Objects ≥ 85,000 bytes go to Large Object Heap. Infrequently collected.' },
      { label: 'IDisposable', value: 'Implement for unmanaged resources. Use `using` or `using var`.' },
      { label: 'Span<T>', value: 'Stack-allocated slice. Zero heap. ref struct — cannot be boxed.' },
      { label: 'ArrayPool<T>', value: 'Rent/Return to avoid GC pressure for temporary arrays.' },
    ],
  },
  {
    id: 'efcore',
    title: '🗄️ EF Core',
    content: [
      { label: 'Change tracker', value: 'EF tracks entities automatically. Use AsNoTracking() for read-only queries.' },
      { label: 'N+1 problem', value: 'Lazy loading in loop = 1 + N queries. Use Include() or split queries.' },
      { label: 'DbContext lifetime', value: 'Scoped per HTTP request. Never singleton. Never use across threads.' },
      { label: 'Compiled queries', value: 'EF.CompileQuery() — cache query plan for hot paths.' },
      { label: 'ExecuteUpdate/Delete', value: '.NET 7+. Bulk operations without loading entities.' },
    ],
  },
  {
    id: 'di',
    title: '🌐 DI & ASP.NET Core',
    content: [
      { label: 'Singleton', value: 'One instance per app lifetime. Thread-safe required.' },
      { label: 'Scoped', value: 'One per HTTP request. Default for DbContext.' },
      { label: 'Transient', value: 'New instance every resolve. Lightweight stateless services.' },
      { label: 'Captive dependency', value: 'Singleton depends on Scoped = bug. Scoped lives longer than expected.' },
      { label: 'Middleware order', value: 'Order matters! UseExceptionHandler → UseAuth → UseRouting → UseEndpoints.' },
    ],
  },
  {
    id: 'patterns',
    title: '🎨 Patterns',
    content: [
      { label: 'Repository', value: 'Abstracts data access. Testable. Do not expose IQueryable.' },
      { label: 'CQRS', value: 'Commands mutate state. Queries read state. Separate models.' },
      { label: 'Result pattern', value: 'Return Result<T> instead of throwing exceptions for expected failures.' },
      { label: 'Options pattern', value: 'IOptions<T>, IOptionsSnapshot<T>, IOptionsMonitor<T> for config.' },
      { label: 'Outbox pattern', value: 'Write event to DB in same transaction. Background worker publishes.' },
    ],
  },
]

export default function CheatsheetPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Cheatsheet</h1>
          <p className="text-muted-foreground">
            Quick-reference cards for last-minute review. Expand any section.
          </p>
        </div>

        <Accordion multiple className="space-y-3">
          {SECTIONS.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-accent">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <dl className="space-y-2 mt-2">
                  {section.content.map((item) => (
                    <div key={item.label} className="flex gap-3 text-sm">
                      <dt className="shrink-0 font-mono text-primary min-w-[160px]">{item.label}</dt>
                      <dd className="text-muted-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </>
  )
}
