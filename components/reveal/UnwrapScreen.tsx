/**
 * Opening screen. A wrapped box sits on a butter-yellow field. The recipient lifts the lid
 * (drag it up, or tap / press Enter): it pops off, confetti bursts out, and the screen opens
 * onto the tag. Reduced motion skips straight through.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'

interface UnwrapScreenProps {
  onComplete: () => void
  toName?: string
}

const OPENING_MS = 2300
const LIFT = 70
const COLORS = ['#ff8fb8', '#2f46e6', '#b8a4ff', '#5fd3a6', '#f0452d', '#ffffff', '#14182b']

const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  x: ((i * 61) % 380) - 190,
  rise: 140 + ((i * 53) % 240),
  rotate: ((i * 71) % 540) - 270,
  delay: 0.2 + (i % 7) * 0.04,
  w: 8 + ((i * 7) % 9),
  h: 6 + ((i * 5) % 12),
  color: COLORS[i % COLORS.length],
  round: i % 4 === 0,
}))

export default function UnwrapScreen({ onComplete, toName }: UnwrapScreenProps) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const y = useMotionValue(0)
  const tilt = useTransform(y, [-120, 0], [-10, 0])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const open = () => {
    if (phase !== 'idle') return
    if (reduce) { setPhase('done'); return }
    setPhase('opening')
    timer.current = setTimeout(() => setPhase('done'), OPENING_MS)
  }
  const opening = phase === 'opening'

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== 'done' && (
        <motion.div
          key="unwrap"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-butter px-6 text-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Burst behind the box when it opens */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full bg-white"
            initial={{ scale: 0.1, opacity: 0 }}
            animate={opening ? { scale: 2.4, opacity: [0, 0.8, 0.5] } : { scale: 0.1, opacity: 0 }}
            transition={{ duration: 1.3, delay: 0.15, ease: 'easeOut' }}
          />

          <h1 className="relative mb-[clamp(1rem,5dvh,2.25rem)] max-w-md text-balance text-center text-3xl sm:text-4xl" style={{ opacity: opening ? 0 : 1, transition: 'opacity .3s' }}>
            {toName ? `A gift for ${toName}` : 'A gift for you'}
          </h1>

          {/* The box */}
          <div className="relative aspect-square w-[min(68vw,280px,36dvh)]">
            {/* Base */}
            <svg viewBox="0 0 280 280" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <ellipse cx="140" cy="254" rx="106" ry="11" fill="#14182b" opacity="0.14" />
              {/* Dark inner rim revealed when the lid lifts */}
              <rect x="44" y="118" width="192" height="16" rx="8" fill="#14182b" />
              {/* Pink box body */}
              <rect x="36" y="124" width="208" height="124" rx="20" fill="#ff8fb8" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
              {/* Cobalt vertical ribbon */}
              <rect x="118" y="124" width="44" height="124" fill="#2f46e6" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
              {/* Subtle shadow cast by the lid */}
              <rect x="39" y="126.5" width="202" height="14" fill="#14182b" opacity="0.14" />
              {/* Glossy cartoon highlights */}
              <path d="M54 156v42" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
              <circle cx="54" cy="212" r="3" fill="#ffffff" opacity="0.9" />
            </svg>

            {/* Draggable lid + plush bow */}
            <motion.button
              type="button"
              aria-label="Lift the lid to open your gift"
              className="absolute inset-x-0 top-[7.8%] z-10 h-[42.2%] cursor-grab touch-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/30 focus-visible:rounded-2xl active:cursor-grabbing"
              style={{ y, rotate: tilt }}
              drag={!reduce && phase === 'idle' ? 'y' : false}
              dragConstraints={{ top: -160, bottom: 0 }}
              dragSnapToOrigin
              dragElastic={0.15}
              onTap={open}
              onDragEnd={(_, info) => { if (info.offset.y < -LIFT) open() }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
              animate={opening ? { y: [0, -20, -420], rotate: [0, 0, -26], opacity: [1, 1, 0] } : undefined}
              transition={opening ? { duration: 1, times: [0, 0.2, 1], ease: 'easeOut' } : undefined}
              whileHover={!opening && !reduce ? { y: -4 } : undefined}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 22 280 118" className="h-full w-full overflow-visible" aria-hidden="true">
                {/* Lid body */}
                <rect x="22" y="84" width="236" height="50" rx="15" fill="#ff8fb8" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
                {/* Lid corner highlight */}
                <path d="M36 112v-11a5 5 0 0 1 5-5h28" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.92" />
                {/* Lid cobalt ribbon */}
                <rect x="118" y="84" width="44" height="50" fill="#2f46e6" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
                {/* Bow tails */}
                <path d="M132 82 105 112l13-3 6 9 14-31Z" fill="#2f46e6" stroke="#14182b" strokeWidth="5" strokeLinejoin="round" />
                <path d="M148 82 175 112l-13-3-6 9-14-31Z" fill="#2f46e6" stroke="#14182b" strokeWidth="5" strokeLinejoin="round" />
                {/* Bow loops */}
                <path d="M134 78c-24 0-54-2-58-24-3-18 20-26 38-12 10 8 18 22 22 32Z" fill="#2f46e6" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
                <path d="M146 78c24 0 54-2 58-24 3-18-20-26-38-12-10 8-18 22-22 32Z" fill="#2f46e6" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
                {/* Loop creases */}
                <path d="M126 72c-12-4-22-10-29-16" fill="none" stroke="#14182b" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M154 72c12-4 22-10 29-16" fill="none" stroke="#14182b" strokeWidth="4.5" strokeLinecap="round" />
                {/* Loop specular highlights */}
                <path d="M87 53c0-8 7-13 15-11" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
                {/* Center knot */}
                <rect x="128" y="65" width="24" height="22" rx="9" fill="#2f46e6" stroke="#14182b" strokeWidth="5.5" strokeLinejoin="round" />
                <circle cx="136" cy="72" r="2.5" fill="#ffffff" opacity="0.85" />
              </svg>
            </motion.button>
          </div>

          <p className="relative mt-[clamp(1rem,5dvh,2.25rem)] text-center" style={{ opacity: opening ? 0 : 1, transition: 'opacity .3s' }}>
            <span className="font-hand text-4xl leading-none">Lift the lid</span>
            <span className="mt-1 block text-sm text-ink/70">drag it up, or just tap</span>
          </p>

          {opening && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
              {CONFETTI.map((c, i) => (
                <motion.span
                  key={i}
                  className="absolute block"
                  style={{ width: c.w, height: c.h, marginLeft: -c.w / 2, marginTop: -c.h / 2, background: c.color, borderRadius: c.round ? 999 : 2 }}
                  initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                  animate={{ x: c.x, y: [0, -c.rise, -c.rise + 140], opacity: [0, 1, 1, 0], rotate: c.rotate }}
                  transition={{ duration: 1.7, delay: c.delay, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
