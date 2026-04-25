import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Glossary',
  description: 'A-Z glossary of .NET and C# terms for interview preparation.',
}

const TERMS = [
  { term: 'AOT', definition: 'Ahead-of-Time compilation. IL compiled to native code before runtime. .NET 8 supports Native AOT.' },
  { term: 'BCL', definition: 'Base Class Library. Core standard libraries in System.*.' },
  { term: 'Boxing', definition: 'Converting a value type to object or an interface. Causes heap allocation.' },
  { term: 'CAP Theorem', definition: 'Consistency, Availability, Partition Tolerance — distributed systems can only guarantee two.' },
  { term: 'CLR', definition: 'Common Language Runtime. The virtual machine that executes .NET IL code.' },
  { term: 'CLS', definition: 'Common Language Specification. Subset of CTS that ensures cross-language interop.' },
  { term: 'CQRS', definition: 'Command Query Responsibility Segregation. Separate read and write models.' },
  { term: 'CTS', definition: 'Common Type System. Defines all types in .NET across languages.' },
  { term: 'DDD', definition: 'Domain-Driven Design. Design software around the business domain with aggregates, entities, value objects.' },
  { term: 'DI', definition: 'Dependency Injection. Providing dependencies from outside rather than constructing them inside.' },
  { term: 'GC', definition: 'Garbage Collector. Automatic memory management. Generational: Gen 0, 1, 2, LOH, POH.' },
  { term: 'IL', definition: 'Intermediate Language (also CIL). Compiled C# output. JIT-compiled at runtime.' },
  { term: 'IQueryable', definition: 'Builds expression trees translated to SQL. Use with EF Core for DB queries.' },
  { term: 'JIT', definition: 'Just-In-Time compiler. Converts IL to native machine code at runtime.' },
  { term: 'LOH', definition: 'Large Object Heap. For objects ≥ 85,000 bytes. Infrequently collected.' },
  { term: 'Memory<T>', definition: 'Like Span<T> but heap-allocatable. Can be used in async methods.' },
  { term: 'Middleware', definition: 'ASP.NET Core request pipeline components. Order matters.' },
  { term: 'NRT', definition: 'Nullable Reference Types (C# 8+). Compiler annotations, not runtime null checks.' },
  { term: 'ORM', definition: 'Object-Relational Mapper. Maps .NET objects to database tables. EF Core is the primary .NET ORM.' },
  { term: 'POH', definition: 'Pinned Object Heap (.NET 5+). For objects pinned in memory (interop, unsafe code).' },
  { term: 'Span<T>', definition: 'Stack-allocated slice over contiguous memory. Zero allocation. ref struct.' },
  { term: 'TAP', definition: 'Task-based Asynchronous Pattern. async/await + Task<T>. The standard async model in .NET.' },
  { term: 'ValueTask', definition: 'Allocation-free alternative to Task<T> when result is often synchronous.' },
]

// Group by first letter
const grouped = TERMS.reduce<Record<string, typeof TERMS>>((acc, term) => {
  const letter = term.term[0]?.toUpperCase() ?? '#'
  if (!acc[letter]) acc[letter] = []
  acc[letter]!.push(term)
  return acc
}, {})

const letters = Object.keys(grouped).sort()

export default function GlossaryPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Glossary</h1>
          <p className="text-muted-foreground">.NET and C# terms, A-Z.</p>
        </div>

        {/* Letter index */}
        <nav aria-label="Glossary index" className="flex flex-wrap gap-1 mb-8">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="flex h-7 w-7 items-center justify-center rounded text-xs font-mono font-semibold hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={letter}>
              <h2 className="text-xl font-bold text-primary mb-3 border-b border-border pb-1">{letter}</h2>
              <dl className="space-y-3">
                {grouped[letter]!.map(({ term, definition }) => (
                  <div key={term} className="flex gap-4">
                    <dt className="shrink-0 w-36 font-mono font-semibold text-sm text-foreground">{term}</dt>
                    <dd className="text-sm text-muted-foreground leading-relaxed">{definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
