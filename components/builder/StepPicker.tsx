/**
 * Step 1 — go shopping. Each gift category is a product card (tissue-colour top with the
 * illustration, paper label strip below, like the gift dialog). Tap to put it in the basket.
 */

'use client'

import { motion } from 'framer-motion'
import Art from '@/components/ui/Art'
import { GIFT_ORDER, categoryInfo, typeTheme } from '@/lib/giftCatalog'
import type { GiftType } from '@/lib/types'

interface StepPickerProps {
  selectedTypes: GiftType[]
  onToggle: (type: GiftType) => void
}

export default function StepPicker({ selectedTypes, onToggle }: StepPickerProps) {
  return (
    <section aria-labelledby="pick-h">
      <h1 id="pick-h" className="text-3xl sm:text-4xl">Go shopping</h1>
      <p className="mt-2 text-base text-ink-soft">Put what you like in your basket. Tap again to put it back.</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {GIFT_ORDER.map((type, index) => {
          const on = selectedTypes.includes(type)
          const t = typeTheme[type]
          return (
            <li key={type}>
              <motion.button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(type)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-ink bg-paper text-left focus-visible:outline-ink transition-[box-shadow,transform] duration-200
                  ${on ? 'shadow-[0_0_0_3px_var(--color-paper),0_0_0_6px_var(--color-ink)]' : 'hover:-translate-y-0.5 hover:shadow-[0_3px_0_var(--color-ink)]'}`}
              >
                <span className={`${t.bg} relative block aspect-[5/4]`}>
                  <Art src={categoryInfo[type].image} alt="" size={220} priority={index < 4} className="absolute inset-0 m-auto h-[80%] w-[80%] object-contain" />
                  <span
                    className={`absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border-2 border-ink transition-all duration-200 ${on ? 'scale-100 bg-ink' : 'scale-90 bg-paper'}`}
                    aria-hidden="true"
                  >
                    {on ? (
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none"><path d="m3 8.5 3.2 3.2L13 4.8" stroke="#f4f5ef" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#14182b" strokeWidth="2.4" strokeLinecap="round" /></svg>
                    )}
                  </span>
                </span>
                <span className="flex flex-1 flex-col border-t-2 border-ink px-3 py-2.5 sm:px-4">
                  <span className="font-display text-base font-bold leading-tight text-ink sm:text-lg">{t.name}</span>
                  <span className="mt-0.5 text-[0.78rem] leading-snug text-ink-soft sm:text-sm">{on ? 'In your basket' : t.blurb}</span>
                </span>
              </motion.button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
