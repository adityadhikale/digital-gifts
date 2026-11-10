/**
 * Landing hero art: a stack of tissue-coloured gift cards that cycles through the six categories.
 * Decorative only (the same content appears as real text further down the page).
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

  return (
    <div className="relative mx-auto aspect-[4/5] w-[min(100%,320px,calc((100dvh-14rem)*0.8))] min-w-[200px] [container-type:inline-size]" aria-hidden="true">
      {/* Cards waiting underneath */}
      {[2, 1].map((o) => {
        const t = at(o)
        return (
          <div
            key={t}
            className={`absolute inset-0 rounded-[2rem] border-2 border-ink ${typeTheme[t].bg} transition-colors duration-500`}
            style={{ transform: `translate(${o * 14}px, ${o * 14}px) rotate(${o * 3.5}deg)`, zIndex: 3 - o }}
          />
        )
      })}

      <AnimatePresence mode="popLayout">
        <motion.div
          key={at(0)}
          className={`absolute inset-0 z-10 flex flex-col overflow-hidden rounded-[2rem] border-2 border-ink ${typeTheme[at(0)].bg}`}
          initial={reduce ? false : { opacity: 0, y: 36, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -70, rotate: -9 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center p-[8%]">
            <Art src={categoryInfo[at(0)].image} alt="" size={360} priority className="h-full max-h-full w-auto max-w-full object-contain" />
          </div>
          <div className="mx-[6%] mb-[6%] flex shrink-0 items-center justify-between gap-2 rounded-xl bg-kraft px-3.5 py-2.5 text-ink">
            <p className="min-w-0 truncate font-hand text-[clamp(1.1rem,5.5cqw,1.6rem)] leading-none">for someone you love</p>
            <p className="shrink-0 rounded-full bg-paper px-2.5 py-0.5 text-xs font-bold">{typeTheme[at(0)].name}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
