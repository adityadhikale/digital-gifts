/**
 * Landing hero art: a little gift-shop window. A "Gift shop" sign hangs above an arched window
 * with an "Open" tag. Inside is a window display: the featured gift on a pedestal with two smaller
 * gifts beside it, a backdrop in the featured gift's tissue colour, and a shop label.
 * The featured gift cycles through the six categories. Decorative only.
 */

'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Art from '@/components/ui/Art'
import { GIFT_ORDER, categoryInfo, typeTheme } from '@/lib/giftCatalog'

const EASE = [0.22, 1, 0.36, 1] as const

export default function HeroStack() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % GIFT_ORDER.length), 2600)
    return () => clearInterval(t)
  }, [reduce])

  const at = (o: number) => GIFT_ORDER[(i + o) % GIFT_ORDER.length]
  const main = at(0)
  const theme = typeTheme[main]

  /** A small gift standing on the sill beside the pedestal */
  const side = (type: (typeof GIFT_ORDER)[number], pos: string, tilt: number) => (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={type}
        className={`absolute bottom-[17%] w-[26%] ${pos}`}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, rotate: tilt }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <Art src={categoryInfo[type].image} alt="" size={160} className="h-auto w-full drop-shadow-[0_4px_4px_rgba(20,24,43,0.2)]" />
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="mx-auto flex w-[min(64vw,250px)] min-w-[220px] flex-col items-center md:w-[min(100%,360px,calc((100dvh-13rem)*0.7))] md:min-w-[230px]" aria-hidden="true">
      {/* Shop sign on two short chains */}
      <div className="relative z-10 rounded-xl border-2 border-ink bg-ink px-5 py-1.5 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-paper shadow-[3px_3px_0_var(--color-pink)]">
        Gift shop
      </div>
      <div className="flex w-[46%] justify-between">
        <span className="h-3 w-0.5 bg-ink" />
        <span className="h-3 w-0.5 bg-ink" />
      </div>

      {/* Arched display window; the backdrop takes the featured gift's colour */}
      <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] border-[3px] border-b-0 border-ink transition-colors duration-500 ${theme.bg}`}>
        {/* Glass shine */}
        <span className="absolute -left-[10%] top-0 h-[140%] w-[14%] rotate-[24deg] bg-white/25" />
        <span className="absolute left-[12%] top-0 h-[140%] w-[5%] rotate-[24deg] bg-white/25" />

        {/* "Open" tag hanging in the window */}
        <div className="absolute left-1/2 top-[6%] z-10 flex -translate-x-1/2 flex-col items-center">
          <svg viewBox="0 0 40 16" className="h-3 w-10" fill="none"><path d="M4 16 20 2l16 14" stroke="#14182b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="-mt-0.5 -rotate-3 rounded-lg border-2 border-ink bg-paper px-3 py-0.5 font-hand text-xl leading-tight text-ink">Open</span>
        </div>

        {/* Display floor */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] border-t-2 border-ink bg-paper" />

        {/* Neighbouring gifts on the floor */}
        {side(at(1), 'left-[1.5%]', -6)}
        {side(at(GIFT_ORDER.length - 1), 'right-[1.5%]', 6)}

        {/* Pedestal */}
        <div className="absolute bottom-[14%] left-1/2 h-[13%] w-[42%] -translate-x-1/2 rounded-t-2xl rounded-b-md border-2 border-ink bg-white" />

        {/* Featured gift */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={main}
            className="absolute bottom-[25%] left-1/2 w-[48%] -translate-x-1/2"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Art src={categoryInfo[main].image} alt="" size={360} priority className="h-auto w-full drop-shadow-[0_8px_8px_rgba(20,24,43,0.25)]" />
          </motion.div>
        </AnimatePresence>

        {/* Shop label on the display floor */}
        <div className="absolute inset-x-[7%] bottom-[3.5%] flex items-center justify-between gap-1.5 rounded-lg border-2 border-ink bg-kraft px-2.5 py-1 text-ink [container-type:inline-size]">
          <p className="shrink-0 whitespace-nowrap pr-1 font-hand text-[clamp(0.78rem,6.4cqw,1.35rem)] leading-tight">for someone you love</p>
          <p className="min-w-0 truncate rounded-full bg-paper px-2 py-0.5 text-[0.65rem] font-bold sm:text-[0.7rem]">{theme.name.split(' ')[0]}</p>
        </div>
      </div>

      {/* Window sill */}
      <div className="relative -mx-[4%] h-4 w-[108%] rounded-md border-2 border-ink bg-kraft shadow-[0_8px_12px_-8px_rgba(20,24,43,0.4)]" />
    </div>
  )
}
