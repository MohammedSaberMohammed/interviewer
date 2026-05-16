'use client'

import { motion } from 'motion/react'
import { Gem3D } from '@/components/ui/Gem3D'

export function HeroOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 400, height: 400 }}>
      {/* Outer ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, oklch(0.72 0.18 195 / 0.5) 0%, oklch(0.68 0.25 320 / 0.3) 50%, transparent 75%)' }}
        aria-hidden
      />

      {/* Orbit ring 1 — cyan dashed */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ width: 320, height: 320 }}
        aria-hidden
      >
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <ellipse
            cx="160" cy="160" rx="158" ry="58"
            stroke="oklch(0.72 0.18 195 / 0.35)"
            strokeWidth="1"
            strokeDasharray="6 10"
            transform="rotate(-20 160 160)"
          />
        </svg>
      </motion.div>

      {/* Orbit ring 2 — magenta dashed */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{ width: 280, height: 280 }}
        aria-hidden
      >
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
          <ellipse
            cx="140" cy="140" rx="136" ry="48"
            stroke="oklch(0.68 0.25 320 / 0.3)"
            strokeWidth="1"
            strokeDasharray="4 14"
            transform="rotate(25 140 140)"
          />
        </svg>
      </motion.div>

      {/* Orbit dot on ring 1 */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ width: 320, height: 320 }}
        aria-hidden
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            top: '50%', left: '50%',
            marginTop: -4,
            marginLeft: 156,
            background: 'oklch(0.72 0.18 195)',
            boxShadow: '0 0 12px 3px oklch(0.72 0.18 195 / 0.8)',
          }}
        />
      </motion.div>

      {/* Orbit dot on ring 2 */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{ width: 280, height: 280 }}
        aria-hidden
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 6, height: 6,
            top: '50%', left: '50%',
            marginTop: -3,
            marginLeft: 133,
            background: 'oklch(0.68 0.25 320)',
            boxShadow: '0 0 10px 3px oklch(0.68 0.25 320 / 0.8)',
          }}
        />
      </motion.div>

      {/* The gem — floating animation */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          filter: 'drop-shadow(0 0 40px oklch(0.72 0.18 195 / 0.5)) drop-shadow(0 0 80px oklch(0.68 0.25 320 / 0.25))',
        }}
      >
        <Gem3D color="cyan" size={220} />
      </motion.div>

      {/* Small particle dots */}
      {[
        { x: 60,  y: 80,  size: 3, color: 'oklch(0.72 0.18 195)', delay: 0 },
        { x: 320, y: 120, size: 2, color: 'oklch(0.68 0.25 320)', delay: 1.2 },
        { x: 80,  y: 300, size: 2, color: 'oklch(0.78 0.18 85)',  delay: 0.6 },
        { x: 340, y: 280, size: 3, color: 'oklch(0.72 0.18 195)', delay: 1.8 },
        { x: 200, y: 50,  size: 2, color: 'oklch(0.68 0.25 320)', delay: 0.9 },
      ].map(({ x, y, size, color, delay }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{ width: size, height: size, background: color, left: x, top: y, boxShadow: `0 0 ${size * 3}px ${color}` }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
          aria-hidden
        />
      ))}
    </div>
  )
}
