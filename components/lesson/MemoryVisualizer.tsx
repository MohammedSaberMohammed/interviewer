import { cn } from '@/lib/utils'

interface StackFrame {
  name: string
  value: string
  isReference?: boolean
}

interface HeapObject {
  id: string
  label?: string
  content: Record<string, string>
}

interface Reference {
  from: string
  to: string
}

interface MemoryVisualizerProps {
  stack: StackFrame[]
  heap: HeapObject[]
  references?: Reference[]
  className?: string
}

const CELL_H = 48
const CELL_W = 160
const HEAP_X = 320
const HEAP_W = 180
const PAD = 16

export function MemoryVisualizer({ stack = [], heap = [], references = [], className }: MemoryVisualizerProps) {
  const totalHeapRows = heap.reduce((acc, o) => acc + Object.keys(o.content).length + 1, 0)
  const svgH = Math.max(stack.length * CELL_H + PAD * 2, totalHeapRows * 28 + PAD * 2)
  const svgW = HEAP_X + HEAP_W + PAD * 2

  let heapY = PAD
  const heapPositions: Record<string, number> = {}

  return (
    <figure className={cn('my-6 overflow-x-auto rounded-xl border border-border bg-background p-4', className)}>
      <figcaption className="text-xs font-semibold text-muted-foreground mb-3">Memory Layout</figcaption>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="font-mono text-xs"
        role="img"
        aria-label="Memory layout diagram showing stack and heap"
      >
        {/* Stack label */}
        <text x={CELL_W / 2} y={PAD - 4} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-xs font-bold">
          Stack
        </text>
        {/* Heap label */}
        <text x={HEAP_X + HEAP_W / 2} y={PAD - 4} textAnchor="middle" className="fill-violet-600 dark:fill-violet-400 text-xs font-bold">
          Heap
        </text>

        {/* Stack frames */}
        {stack.map((frame, i) => {
          const y = PAD + i * CELL_H
          return (
            <g key={frame.name}>
              <rect
                x={PAD}
                y={y}
                width={CELL_W}
                height={CELL_H - 2}
                rx={4}
                className="fill-blue-50 dark:fill-blue-950 stroke-blue-300 dark:stroke-blue-700"
                strokeWidth={1}
              />
              <text x={PAD + 8} y={y + 16} className="fill-blue-700 dark:fill-blue-300 font-semibold">
                {frame.name}
              </text>
              <text x={PAD + 8} y={y + 32} className="fill-blue-500 dark:fill-blue-400">
                {frame.isReference ? '→ ref' : frame.value}
              </text>
            </g>
          )
        })}

        {/* Heap objects */}
        {heap.map((obj) => {
          heapPositions[obj.id] = heapY + 12
          const fields = Object.entries(obj.content)
          const objH = (fields.length + 1) * 24 + 8

          const block = (
            <g key={obj.id}>
              <rect
                x={HEAP_X}
                y={heapY}
                width={HEAP_W}
                height={objH}
                rx={6}
                className="fill-violet-50 dark:fill-violet-950 stroke-violet-300 dark:stroke-violet-700"
                strokeWidth={1}
              />
              <text
                x={HEAP_X + HEAP_W / 2}
                y={heapY + 16}
                textAnchor="middle"
                className="fill-violet-700 dark:fill-violet-300 font-bold"
              >
                {obj.label ?? obj.id}
              </text>
              {fields.map(([key, val], fi) => (
                <g key={key}>
                  <text
                    x={HEAP_X + 8}
                    y={heapY + 32 + fi * 24}
                    className="fill-violet-600 dark:fill-violet-400"
                  >
                    {key}:
                  </text>
                  <text
                    x={HEAP_X + HEAP_W - 8}
                    y={heapY + 32 + fi * 24}
                    textAnchor="end"
                    className="fill-foreground"
                  >
                    {val}
                  </text>
                </g>
              ))}
            </g>
          )

          heapY += objH + 12
          return block
        })}

        {/* Reference arrows */}
        {references.map((ref) => {
          const fromIdx = stack.findIndex((f) => f.name === ref.from)
          const toY = heapPositions[ref.to]
          if (fromIdx === -1 || toY === undefined) return null
          const fromX = PAD + CELL_W
          const fromY = PAD + fromIdx * CELL_H + CELL_H / 2 - 1

          return (
            <g key={`${ref.from}-${ref.to}`}>
              <defs>
                <marker id={`arrow-${ref.from}`} markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" className="fill-primary" />
                </marker>
              </defs>
              <path
                d={`M ${fromX} ${fromY} C ${fromX + 40} ${fromY}, ${HEAP_X - 40} ${toY}, ${HEAP_X} ${toY}`}
                fill="none"
                className="stroke-primary"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                markerEnd={`url(#arrow-${ref.from})`}
              />
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
