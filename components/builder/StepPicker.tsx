/**
 * Step 1 — pick what to send. Each category is a tissue-coloured tile; pick one or more.
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
      <h1 id="pick-h" className="text-3xl sm:text-4xl">What do you want to send?</h1>
      <p className="mt-2 text-base text-ink-soft">Pick one or more. Tap again to take it out.</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                className={`${t.bg} ${t.text} relative flex h-full w-full flex-col items-center rounded-[1.5rem] border-2 p-3 text-center transition-[box-shadow,border-color,transform] duration-200 sm:p-5
                  ${on ? 'border-ink shadow-[0_0_0_4px_var(--color-paper),0_0_0_7px_var(--color-ink)]' : 'border-ink/25 hover:border-ink hover:-translate-y-0.5'}`}
              >
                <span
                  className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border-2 border-ink transition-all duration-200 ${on ? 'scale-100 bg-ink' : 'scale-75 bg-white/60'}`}
                  aria-hidden="true"
                >
                  {on && (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                      <path d="m3 8.5 3.2 3.2L13 4.8" stroke="#f4f5ef" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <Art src={categoryInfo[type].image} alt="" size={220} priority={index < 4} className="h-auto w-[58%] max-w-[120px]" />
                <span className="mt-2 font-display text-lg font-bold leading-tight sm:text-xl">{t.name}</span>
                <span className="mt-0.5 text-[0.8rem] leading-tight opacity-85 sm:text-sm">{t.blurb}</span>
              </motion.button>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 min-h-6 text-base font-semibold" aria-live="polite">
        {selectedTypes.length === 0
          ? 'Nothing picked yet'
          : `${selectedTypes.length} picked: ${selectedTypes.map((t) => typeTheme[t].name).join(', ')}`}
      </p>
    </section>
  )
}
