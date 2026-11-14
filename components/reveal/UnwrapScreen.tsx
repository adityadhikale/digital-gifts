/**
 * Opening screen. A wrapped box sits on a butter-yellow field. The recipient lifts the lid
 * (drag it up, or tap / press Enter): it pops off, confetti bursts out, and the screen opens
 * onto the tag. Reduced motion skips straight through.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { BoxBase, BoxLid } from '@/components/wrap/GiftBox'
import { DEFAULT_WRAP, paperById, ribbonById } from '@/lib/wrap'

interface UnwrapScreenProps {
  onComplete: () => void
  toName?: string
  /** Wrapping the sender chose; defaults to pink paper and a cobalt ribbon */
  paper?: string
  ribbon?: string
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

export default function UnwrapScreen({ onComplete, toName, paper = DEFAULT_WRAP.paper, ribbon = DEFAULT_WRAP.ribbon }: UnwrapScreenProps) {
  const wrapColors = [ribbonById(ribbon).fill, paperById(paper).fill]
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
            <BoxBase paper={paper} ribbon={ribbon} className="pointer-events-none absolute inset-0 h-full w-full" />

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
              <BoxLid paper={paper} ribbon={ribbon} className="h-full w-full" />
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
                  style={{ width: c.w, height: c.h, marginLeft: -c.w / 2, marginTop: -c.h / 2, background: i % 3 === 0 ? wrapColors[(i / 3) % 2] : c.color, borderRadius: c.round ? 999 : 2 }}
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
