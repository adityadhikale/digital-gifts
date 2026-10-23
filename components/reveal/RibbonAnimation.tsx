/**
 * Gift opening screen.
 * A wrapped box waits on screen. When the recipient taps it, the box shakes, the lid and bow lift
 * off, light and confetti burst out, and the screen fades into the letter.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import FloatingElements from '@/components/ui/FloatingElements'

interface RibbonAnimationProps {
  onComplete: () => void
  toName?: string
}

/** How long the opening plays before the screen fades out, in ms */
const OPENING_MS = 2800

const HEART_PATH = 'M32 58C32 58 8 40 8 22C8 12 16 6 24 6C28 6 31 8 32 10C33 8 36 6 40 6C48 6 56 12 56 22C56 40 32 58 32 58Z'
const SPARKLE_PATH = 'M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z'
const CONFETTI_COLORS = ['#8b2a3e', '#e8859a', '#deb897', '#ffd36e', '#c4637a']

/** Fixed confetti pieces, so nothing random is computed while rendering */
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  x: (i - 8.5) * 24 + ((i * 37) % 30) - 15,
  rise: 170 + ((i * 53) % 170),
  rotate: ((i * 71) % 240) - 120,
  delay: 0.75 + (i % 6) * 0.07,
  size: 14 + ((i * 13) % 14),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  heart: i % 3 !== 0,
}))

/** Keeps an SVG group rotating and moving around its own centre */
const centred = { transformBox: 'fill-box', transformOrigin: 'center' } as const

export default function RibbonAnimation({ onComplete, toName }: RibbonAnimationProps) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle')
  const reduceMotion = useReducedMotion()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const open = () => {
    if (phase !== 'idle') return
    if (reduceMotion) {
      setPhase('done')
      return
    }
    setPhase('opening')
    timer.current = setTimeout(() => setPhase('done'), OPENING_MS)
  }

  const opening = phase === 'opening'

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== 'done' && (
        <motion.div
          key="unwrap"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-hero-gradient overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FloatingElements count={10} />

          {/* Warm light that grows behind the box when it opens */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 360, height: 360, background: 'radial-gradient(circle, rgba(255,226,170,0.9) 0%, rgba(255,226,170,0) 70%)' }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={opening ? { scale: [0.2, 2.4], opacity: [0, 0.95, 0.6] } : { scale: 0.2, opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: 'easeOut' }}
          />

          <p
            className="relative z-10 mb-6 font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl text-text text-center px-6 transition-opacity duration-500"
            style={{ opacity: opening ? 0 : 1 }}
          >
            {toName ? `A gift for ${toName}` : 'A gift for you'}
          </p>

          <button
            type="button"
            onClick={open}
            aria-label="Open your gift"
            className="relative z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-3xl"
          >
            {/* Float while waiting, shake once when tapped */}
            <motion.div
              animate={
                opening
                  ? { rotate: [0, -6, 6, -5, 5, -2, 0], y: 0, scale: [1, 1.04, 1] }
                  : { y: [0, -10, 0], rotate: 0, scale: 1 }
              }
              transition={opening ? { duration: 0.6 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-72 sm:h-72 drop-shadow-2xl overflow-visible">
                <defs>
                  <linearGradient id="giftBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f7b6c4" />
                    <stop offset="100%" stopColor="#e07a93" />
                  </linearGradient>
                  <linearGradient id="giftLid" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fbc5d0" />
                    <stop offset="100%" stopColor="#e88aa1" />
                  </linearGradient>
                  <linearGradient id="giftRibbon" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a8344b" />
                    <stop offset="100%" stopColor="#7a2336" />
                  </linearGradient>
                </defs>

                {/* Ground shadow */}
                <ellipse cx="100" cy="184" rx="58" ry="7" fill="rgba(42,26,31,0.14)" />

                {/* Box body and its ribbon */}
                <rect x="40" y="100" width="120" height="80" rx="8" fill="url(#giftBody)" />
                <rect x="92" y="100" width="16" height="80" fill="url(#giftRibbon)" />

                {/* Light inside the box */}
                <motion.ellipse
                  cx="100" cy="102" rx="52" ry="8" fill="#ffe7b0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: opening ? [0, 1, 0.8] : 0 }}
                  transition={{ duration: 0.9, delay: 0.5 }}
                />

                {/* Lid and bow lift off together */}
                <motion.g
                  style={centred}
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={opening ? { y: [0, -14, -120], rotate: [0, 0, -18], opacity: [1, 1, 0] } : { y: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.3, delay: 0.5, times: [0, 0.25, 1], ease: 'easeOut' }}
                >
                  <rect x="32" y="76" width="136" height="30" rx="7" fill="url(#giftLid)" />
                  <rect x="92" y="76" width="16" height="30" fill="url(#giftRibbon)" />
                  {/* Bow */}
                  <path d="M100 74 C78 40 52 58 78 74 C88 80 96 78 100 74Z" fill="url(#giftRibbon)" />
                  <path d="M100 74 C122 40 148 58 122 74 C112 80 104 78 100 74Z" fill="url(#giftRibbon)" />
                  <circle cx="100" cy="74" r="8" fill="#8b2a3e" />
                </motion.g>
              </svg>
            </motion.div>
          </button>

          <motion.p
            className="relative z-10 mt-6 font-[family-name:var(--font-dancing)] text-2xl text-rose"
            animate={opening ? { opacity: 0 } : { opacity: [0.5, 1, 0.5] }}
            transition={opening ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
          >
            Tap to open
          </motion.p>

          {/* Confetti bursts from the box */}
          {opening && (
            <div className="absolute left-1/2 top-1/2 pointer-events-none z-20">
              {CONFETTI.map((c, i) => (
                <motion.svg
                  key={i}
                  viewBox={c.heart ? '0 0 64 64' : '0 0 24 24'}
                  className="absolute"
                  style={{ width: c.size, height: c.size, marginLeft: -c.size / 2, marginTop: -c.size / 2 }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
                  animate={{ x: c.x, y: -c.rise, opacity: [0, 1, 1, 0], scale: [0.3, 1, 1], rotate: c.rotate }}
                  transition={{ duration: 1.9, delay: c.delay, ease: 'easeOut' }}
                >
                  <path d={c.heart ? HEART_PATH : SPARKLE_PATH} fill={c.color} />
                </motion.svg>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
