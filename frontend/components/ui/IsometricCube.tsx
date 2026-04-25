/**
 * IsometricCube — Polished 3D isometric illustration for lesson/phase hero areas.
 * Soft matte-finish hexagonal prism with framed checkmark, diffused shadows, and particles.
 */

interface IsometricCubeProps {
  color?: string
  emoji?: string
  size?: number
  className?: string
}

type Palette = {
  topLight: string   // lightest — top face highlight
  top: string        // top face base
  left: string       // left face (medium)
  right: string      // right face (darkest)
  shadow: string     // drop shadow color
  glow: string       // ambient glow
  accent: string     // particles
}

const DEFAULT_PALETTE: Palette = {
  topLight: '#EDE9FE',
  top: '#DDD6FE',
  left: '#C4B5FD',
  right: '#A78BFA',
  shadow: 'rgba(124,58,237,0.20)',
  glow: 'rgba(167,139,250,0.18)',
  accent: '#DDD6FE',
}

const COLOR_MAP: Record<string, Palette> = {
  indigo: {
    topLight: '#E0E7FF', top: '#C7D2FE', left: '#A5B4FC', right: '#818CF8',
    shadow: 'rgba(99,102,241,0.20)', glow: 'rgba(165,180,252,0.18)', accent: '#C7D2FE',
  },
  blue: {
    topLight: '#DBEAFE', top: '#BFDBFE', left: '#93C5FD', right: '#60A5FA',
    shadow: 'rgba(59,130,246,0.20)', glow: 'rgba(147,197,253,0.18)', accent: '#BFDBFE',
  },
  violet: DEFAULT_PALETTE,
  purple: {
    topLight: '#F3E8FF', top: '#E9D5FF', left: '#D8B4FE', right: '#C084FC',
    shadow: 'rgba(168,85,247,0.20)', glow: 'rgba(216,180,254,0.18)', accent: '#E9D5FF',
  },
  teal: {
    topLight: '#CCFBF1', top: '#99F6E4', left: '#5EEAD4', right: '#2DD4BF',
    shadow: 'rgba(20,184,166,0.20)', glow: 'rgba(94,234,212,0.18)', accent: '#99F6E4',
  },
  cyan: {
    topLight: '#CFFAFE', top: '#A5F3FC', left: '#67E8F9', right: '#22D3EE',
    shadow: 'rgba(6,182,212,0.20)', glow: 'rgba(103,232,249,0.18)', accent: '#A5F3FC',
  },
  green: {
    topLight: '#DCFCE7', top: '#BBF7D0', left: '#86EFAC', right: '#4ADE80',
    shadow: 'rgba(34,197,94,0.20)', glow: 'rgba(134,239,172,0.18)', accent: '#BBF7D0',
  },
  amber: {
    topLight: '#FEF3C7', top: '#FDE68A', left: '#FCD34D', right: '#FBBF24',
    shadow: 'rgba(245,158,11,0.20)', glow: 'rgba(252,211,77,0.18)', accent: '#FDE68A',
  },
  rose: {
    topLight: '#FFE4E6', top: '#FECDD3', left: '#FDA4AF', right: '#FB7185',
    shadow: 'rgba(244,63,94,0.20)', glow: 'rgba(253,164,175,0.18)', accent: '#FECDD3',
  },
  orange: {
    topLight: '#FFEDD5', top: '#FED7AA', left: '#FDBA74', right: '#FB923C',
    shadow: 'rgba(249,115,22,0.20)', glow: 'rgba(253,186,116,0.18)', accent: '#FED7AA',
  },
  slate: {
    topLight: '#E0E7FF', top: '#C7D2FE', left: '#A5B4FC', right: '#818CF8',
    shadow: 'rgba(99,102,241,0.20)', glow: 'rgba(165,180,252,0.18)', accent: '#C7D2FE',
  },
}

export function IsometricCube({
  color = 'indigo',
  emoji,
  size = 180,
  className,
}: IsometricCubeProps) {
  const p: Palette = COLOR_MAP[color] ?? DEFAULT_PALETTE
  const id = `iso3d-${color}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 220"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Soft diffused shadow */}
        <filter id={`${id}-shadow`} x="-30%" y="-20%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="10" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ambient glow */}
        <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="45%">
          <stop offset="0%" stopColor={p.glow} />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>

        {/* Top face — lightest, subtle vertical gradient */}
        <linearGradient id={`${id}-top`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={p.topLight} />
          <stop offset="100%" stopColor={p.top} />
        </linearGradient>

        {/* Left face — medium tone */}
        <linearGradient id={`${id}-left`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={p.left} />
          <stop offset="100%" stopColor={p.right} stopOpacity="0.85" />
        </linearGradient>

        {/* Right face — darkest */}
        <linearGradient id={`${id}-right`} x1="1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={p.right} stopOpacity="0.75" />
          <stop offset="100%" stopColor={p.right} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* ── Ambient glow halo ── */}
      <ellipse cx="100" cy="130" rx="80" ry="55" fill={`url(#${id}-glow)`} />

      {/* ── Cube body ── */}
      <g filter={`url(#${id}-shadow)`}>
        {/* Top face */}
        <polygon
          points="100,32 168,68 100,104 32,68"
          fill={`url(#${id}-top)`}
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Left face */}
        <polygon
          points="32,68 100,104 100,184 32,148"
          fill={`url(#${id}-left)`}
          stroke="white"
          strokeOpacity="0.12"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Right face */}
        <polygon
          points="168,68 168,148 100,184 100,104"
          fill={`url(#${id}-right)`}
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>

      {/* ── Top face subtle sheen (matte highlight) ── */}
      <polygon
        points="100,32 168,68 100,104 32,68"
        fill="white"
        fillOpacity="0.08"
      />
      {/* Top-left edge shimmer */}
      <line x1="100" y1="32" x2="32" y2="68" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" />
      <line x1="100" y1="32" x2="168" y2="68" stroke="white" strokeOpacity="0.2" strokeWidth="0.8" />

      {/* ── Left face: framed checkmark icon ── */}
      <g transform="translate(66,126)">
        {/* Rounded square frame */}
        <rect
          x="-16" y="-16" width="32" height="32" rx="6"
          fill="white"
          fillOpacity="0.18"
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        {/* Checkmark */}
        <path
          d="M-7,1 L-2,6 L9,-5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
      </g>

      {/* ── Emoji on top face (optional) ── */}
      {emoji && (
        <text
          x="100"
          y="75"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
        >
          {emoji}
        </text>
      )}

      {/* ── Floating particles (soft, scattered) ── */}
      <circle cx="22"  cy="46"  r="3"   fill={p.accent} fillOpacity="0.45" />
      <circle cx="180" cy="50"  r="2.5" fill={p.accent} fillOpacity="0.35" />
      <circle cx="184" cy="130" r="3.5" fill={p.accent} fillOpacity="0.25" />
      <circle cx="16"  cy="140" r="2"   fill={p.accent} fillOpacity="0.3" />
      <circle cx="100" cy="14"  r="2"   fill="white"    fillOpacity="0.45" />
      <circle cx="145" cy="30"  r="1.5" fill={p.accent} fillOpacity="0.35" />
      {/* Tiny diamond shapes */}
      <rect x="176" y="90" width="4" height="4" rx="0.8" fill={p.accent} fillOpacity="0.3" transform="rotate(45 178 92)" />
      <rect x="14"  y="98" width="3.5" height="3.5" rx="0.8" fill={p.accent} fillOpacity="0.2" transform="rotate(45 15.75 99.75)" />
    </svg>
  )
}
