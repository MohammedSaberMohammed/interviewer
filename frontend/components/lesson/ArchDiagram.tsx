'use client'

import { useId } from 'react'
import {
  Server, Database, Zap, Monitor, GitBranch, Shield,
  Inbox, User, Cloud, Globe, Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Node types ──────────────────────────────────────────────────────────────

type NodeType =
  | 'client' | 'browser' | 'user'
  | 'server' | 'service'
  | 'cache'
  | 'database'
  | 'queue'
  | 'gateway'
  | 'lb'
  | 'cloud'

interface NodeConfig {
  Icon: React.ComponentType<{ className?: string }>
  bg: string
  border: string
  iconColor: string
}

const NODE_CONFIG: Record<NodeType, NodeConfig> = {
  client:   { Icon: Monitor,   bg: 'bg-blue-50 dark:bg-blue-950/40',     border: 'border-blue-200 dark:border-blue-800',     iconColor: 'text-blue-500'   },
  browser:  { Icon: Globe,     bg: 'bg-blue-50 dark:bg-blue-950/40',     border: 'border-blue-200 dark:border-blue-800',     iconColor: 'text-blue-500'   },
  user:     { Icon: User,      bg: 'bg-sky-50 dark:bg-sky-950/40',       border: 'border-sky-200 dark:border-sky-800',       iconColor: 'text-sky-500'    },
  server:   { Icon: Server,    bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800', iconColor: 'text-violet-500' },
  service:  { Icon: Layers,    bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-800', iconColor: 'text-indigo-500' },
  cache:    { Icon: Zap,       bg: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-200 dark:border-amber-800',   iconColor: 'text-amber-500'  },
  database: { Icon: Database,  bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', iconColor: 'text-emerald-500' },
  queue:    { Icon: Inbox,     bg: 'bg-rose-50 dark:bg-rose-950/40',     border: 'border-rose-200 dark:border-rose-800',     iconColor: 'text-rose-500'   },
  gateway:  { Icon: Shield,    bg: 'bg-slate-50 dark:bg-slate-950/40',   border: 'border-slate-200 dark:border-slate-800',   iconColor: 'text-slate-500'  },
  lb:       { Icon: GitBranch, bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800', iconColor: 'text-purple-500' },
  cloud:    { Icon: Cloud,     bg: 'bg-gray-50 dark:bg-gray-950/40',     border: 'border-gray-200 dark:border-gray-800',     iconColor: 'text-gray-500'   },
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface ArchDiagramNode {
  id: string
  label: string
  sublabel?: string
  type: NodeType
}

export interface ArchDiagramLayer {
  nodes: ArchDiagramNode[]
  /** Optional row-level label shown above the nodes */
  label?: string
}

export interface ArchDiagramConnector {
  /** Short text label shown on the arrow between two layers */
  label?: string
  /** Numbered step (prepended to label as "1. label") */
  step?: number
  /** Dashed line — useful for conditional / async paths */
  dashed?: boolean
  /** Draw arrowheads on both ends */
  bidirectional?: boolean
}

interface ArchDiagramProps {
  title?: string
  caption?: string
  /** Ordered top-to-bottom rows of nodes */
  layers: ArchDiagramLayer[]
  /** One connector per gap: connectors[i] sits between layers[i] and layers[i+1] */
  connectors?: ArchDiagramConnector[]
}

// ─── SVG connector ────────────────────────────────────────────────────────────

const H = 64 // connector section height in px

function ConnectorSVG({
  fromCount,
  toCount,
  label,
  step,
  dashed,
  bidirectional,
  uid,
}: {
  fromCount: number
  toCount: number
  label?: string
  step?: number
  dashed?: boolean
  bidirectional?: boolean
  uid: string
}) {
  const fromXs = Array.from({ length: fromCount }, (_, i) => ((2 * i + 1) / (2 * fromCount)) * 100)
  const toXs   = Array.from({ length: toCount },   (_, i) => ((2 * i + 1) / (2 * toCount)) * 100)

  const lineStyle: React.CSSProperties = {
    stroke: 'var(--border)',
    strokeWidth: 1.5,
    strokeDasharray: dashed ? '5 3' : undefined,
    fill: 'none',
  }

  const markerEnd = `url(#${uid}-e)`
  const markerStart = bidirectional ? `url(#${uid}-s)` : undefined

  let paths: React.ReactNode
  let labelCY = H / 2

  if (fromCount === 1 && toCount === 1) {
    // ── straight vertical ──
    const x = fromXs[0]!
    paths = (
      <line
        x1={`${x}%`} y1="4"
        x2={`${x}%`} y2={H - 4}
        style={lineStyle}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
    )
  } else if (fromCount === 1) {
    // ── fan-out: stem → bar → drops ──
    const stemX   = fromXs[0]!
    const branchY = H * 0.4
    const leftX   = Math.min(...toXs)
    const rightX  = Math.max(...toXs)
    labelCY = branchY / 2

    paths = (
      <>
        <line x1={`${stemX}%`} y1="4"       x2={`${stemX}%`} y2={branchY} style={lineStyle} markerStart={markerStart} />
        {toCount > 1 && <line x1={`${leftX}%`} y1={branchY} x2={`${rightX}%`} y2={branchY} style={lineStyle} />}
        {toXs.map((toX, i) => (
          <line key={i} x1={`${toX}%`} y1={branchY} x2={`${toX}%`} y2={H - 4} style={lineStyle} markerEnd={markerEnd} />
        ))}
      </>
    )
  } else if (toCount === 1) {
    // ── fan-in: rises → bar → stem ──
    const stemX  = toXs[0]!
    const mergeY = H * 0.6
    const leftX  = Math.min(...fromXs)
    const rightX = Math.max(...fromXs)
    labelCY = (mergeY + H) / 2

    paths = (
      <>
        {fromXs.map((fromX, i) => (
          <line key={i} x1={`${fromX}%`} y1="4" x2={`${fromX}%`} y2={mergeY} style={lineStyle} markerStart={i === 0 && bidirectional ? markerStart : undefined} />
        ))}
        {fromCount > 1 && <line x1={`${leftX}%`} y1={mergeY} x2={`${rightX}%`} y2={mergeY} style={lineStyle} />}
        <line x1={`${stemX}%`} y1={mergeY} x2={`${stemX}%`} y2={H - 4} style={lineStyle} markerEnd={markerEnd} />
      </>
    )
  } else {
    // ── parallel: N straight lines ──
    const count = Math.min(fromCount, toCount)
    paths = (
      <>
        {fromXs.slice(0, count).map((fromX, i) => (
          <line
            key={i}
            x1={`${fromX}%`} y1="4"
            x2={`${toXs[i]!}%`} y2={H - 4}
            style={lineStyle}
            markerEnd={markerEnd}
            markerStart={bidirectional ? markerStart : undefined}
          />
        ))}
      </>
    )
  }

  const displayLabel = step !== undefined
    ? `${step}. ${label ?? ''}`.trimEnd()
    : label

  return (
    <svg width="100%" height={H} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <marker id={`${uid}-e`} markerWidth="8" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M1,1 L6,3.5 L1,6" fill="none" style={{ stroke: 'var(--border)', strokeWidth: 1.5 }} />
        </marker>
        {bidirectional && (
          <marker id={`${uid}-s`} markerWidth="8" markerHeight="7" refX="2" refY="3.5" orient="auto-start-reverse">
            <path d="M1,1 L6,3.5 L1,6" fill="none" style={{ stroke: 'var(--border)', strokeWidth: 1.5 }} />
          </marker>
        )}
      </defs>

      {paths}

      {displayLabel && (
        <>
          <rect
            x="20%" y={labelCY - 10}
            width="60%" height="20"
            rx="10"
            style={{ fill: 'var(--background)', stroke: 'var(--border)' }}
          />
          <text
            x="50%" y={labelCY + 1}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }}
          >
            {displayLabel}
          </text>
        </>
      )}
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ArchDiagram({ title, caption, layers, connectors = [] }: ArchDiagramProps) {
  const rawId = useId()
  // useId can emit colons — replace so the id is valid in SVG url() refs
  const uid = rawId.replace(/:/g, 'R')

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-border">
      {title && (
        <div className="border-b border-border bg-muted/30 px-4 py-2.5">
          <p className="text-sm font-semibold">{title}</p>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6">
        {layers.map((layer, li) => {
          const nextLayer = layers[li + 1]
          const connector = connectors[li] ?? {}

          return (
            <div key={li}>
              {/* Optional row label */}
              {layer.label && (
                <p className="mb-2 text-center text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
                  {layer.label}
                </p>
              )}

              {/* Node row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${layer.nodes.length}, 1fr)`,
                  gap: '10px',
                }}
              >
                {layer.nodes.map((node) => {
                  const cfg = NODE_CONFIG[node.type]
                  const { Icon } = cfg
                  return (
                    <div
                      key={node.id}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center',
                        cfg.bg,
                        cfg.border,
                      )}
                    >
                      <Icon className={cn('h-5 w-5', cfg.iconColor)} />
                      <div>
                        <p className="text-xs font-semibold leading-tight">{node.label}</p>
                        {node.sublabel && (
                          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{node.sublabel}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Connector to next layer */}
              {nextLayer && (
                <ConnectorSVG
                  fromCount={layer.nodes.length}
                  toCount={nextLayer.nodes.length}
                  uid={`${uid}c${li}`}
                  {...connector}
                />
              )}
            </div>
          )
        })}
      </div>

      {caption && (
        <figcaption className="border-t border-border bg-muted/20 px-4 py-2.5">
          <p className="text-xs italic text-muted-foreground">{caption}</p>
        </figcaption>
      )}
    </figure>
  )
}
