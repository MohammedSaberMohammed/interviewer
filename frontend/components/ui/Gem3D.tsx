/**
 * Gem3D — CSS/SVG 3D crystal illustration.
 * Renders a faceted gem shape with depth shading, glow, and floating particles.
 * Used in phase cards and lesson hero sections.
 */

interface Gem3DProps {
  /** Primary accent colour (hex or CSS colour) */
  color?: string
  /** Secondary / highlight colour */
  colorAlt?: string
  /** Emoji overlay in the gem centre */
  emoji?: string
  size?: number
  className?: string
}

type PaletteEntry = { primary: string; alt: string; glow: string }

const DEFAULT_PALETTE: PaletteEntry = { primary: '#6366F1', alt: '#818CF8', glow: 'rgba(99,102,241,0.45)' }

const COLOR_MAP: Record<string, PaletteEntry> = {
  indigo: DEFAULT_PALETTE,
  blue:   { primary: '#3B82F6', alt: '#60A5FA', glow: 'rgba(59,130,246,0.45)' },
  violet: { primary: '#8B5CF6', alt: '#A78BFA', glow: 'rgba(139,92,246,0.45)' },
  purple: { primary: '#A855F7', alt: '#C084FC', glow: 'rgba(168,85,247,0.45)' },
  teal:   { primary: '#14B8A6', alt: '#2DD4BF', glow: 'rgba(20,184,166,0.45)' },
  cyan:   { primary: '#06B6D4', alt: '#22D3EE', glow: 'rgba(6,182,212,0.45)' },
  green:  { primary: '#22C55E', alt: '#4ADE80', glow: 'rgba(34,197,94,0.45)' },
  amber:  { primary: '#F59E0B', alt: '#FCD34D', glow: 'rgba(245,158,11,0.45)' },
  rose:   { primary: '#F43F5E', alt: '#FB7185', glow: 'rgba(244,63,94,0.45)' },
  orange: { primary: '#F97316', alt: '#FB923C', glow: 'rgba(249,115,22,0.45)' },
  slate:  DEFAULT_PALETTE,
}

export function Gem3D({
  color = 'indigo',
  emoji,
  size = 120,
  className,
}: Gem3DProps) {
  const palette: PaletteEntry = COLOR_MAP[color] ?? DEFAULT_PALETTE
  const id = `gem-${color}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Radial glow behind gem */}
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.glow} />
          <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>

        {/* Top-left face — brightest */}
        <linearGradient id={`${id}-tl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.alt} stopOpacity="0.85" />
        </linearGradient>

        {/* Top-right face — mid-bright */}
        <linearGradient id={`${id}-tr`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.alt} stopOpacity="0.75" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.7" />
        </linearGradient>

        {/* Bottom-left face — mid */}
        <linearGradient id={`${id}-bl`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={palette.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.4" />
        </linearGradient>

        {/* Bottom-right face — darkest */}
        <linearGradient id={`${id}-br`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.primary} stopOpacity="0.55" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.2" />
        </linearGradient>

        {/* Belt face — left */}
        <linearGradient id={`${id}-belt-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.1" />
        </linearGradient>

        {/* Belt face — right */}
        <linearGradient id={`${id}-belt-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={palette.primary} stopOpacity="0.1" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.3" />
        </linearGradient>

        {/* Stroke gradient */}
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.2" />
        </linearGradient>

        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={palette.primary} floodOpacity="0.4" />
        </filter>
      </defs>

      {/* ── Ambient glow halo ── */}
      <ellipse cx="50" cy="64" rx="38" ry="32" fill={`url(#${id}-glow)`} />

      {/* ── Gem body (filter for drop shadow) ── */}
      <g filter={`url(#${id}-shadow)`}>
        {/* CROWN — top-left face: tip → left-belt → top-belt */}
        <polygon
          points="50,8 20,44 50,44"
          fill={`url(#${id}-tl)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
        />
        {/* CROWN — top-right face: tip → top-belt → right-belt */}
        <polygon
          points="50,8 50,44 80,44"
          fill={`url(#${id}-tr)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
        />

        {/* BELT — left face: top-left-belt → bottom-left-belt → top-belt → bottom-belt */}
        <polygon
          points="20,44 38,28 38,60 20,44"
          fill={`url(#${id}-belt-l)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
        />
        <polygon
          points="38,28 62,28 62,60 38,60"
          fill={`url(#${id}-tl)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
          fillOpacity="0.25"
        />
        <polygon
          points="62,28 80,44 80,44 62,60"
          fill={`url(#${id}-belt-r)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
        />

        {/* PAVILION — bottom-left: bottom-belt → culet */}
        <polygon
          points="20,44 38,60 50,108"
          fill={`url(#${id}-bl)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
        />
        <polygon
          points="38,60 62,60 50,108"
          fill={`url(#${id}-bl)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
          fillOpacity="0.7"
        />
        {/* PAVILION — bottom-right: culet */}
        <polygon
          points="62,60 80,44 50,108"
          fill={`url(#${id}-br)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="0.5"
        />
      </g>

      {/* ── Inner sparkle highlight (upper-left, gives glass depth) ── */}
      <polygon
        points="50,12 36,36 50,36"
        fill="white"
        fillOpacity="0.35"
      />
      {/* Tiny specular dot at tip */}
      <circle cx="50" cy="10" r="1.5" fill="white" fillOpacity="0.8" />

      {/* ── Emoji in centre ── */}
      {emoji && (
        <text
          x="50"
          y="56"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18"
        >
          {emoji}
        </text>
      )}

      {/* ── Floating particles ── */}
      <circle cx="14" cy="20" r="1.5" fill={palette.alt} fillOpacity="0.7" />
      <circle cx="86" cy="16" r="1" fill={palette.alt} fillOpacity="0.5" />
      <circle cx="90" cy="72" r="2" fill={palette.alt} fillOpacity="0.35" />
      <circle cx="10" cy="84" r="1.2" fill={palette.alt} fillOpacity="0.4" />
      <circle cx="50" cy="4" r="1" fill="white" fillOpacity="0.6" />
    </svg>
  )
}
