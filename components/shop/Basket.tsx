/**
 * The shopping basket in the builder's bottom bar: a little wicker basket with the picked
 * gifts peeking out of it, and a count. Fills up as the sender shops.
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Art from '@/components/ui/Art'
import { categoryInfo, typeTheme } from '@/lib/giftCatalog'
import type { GiftType } from '@/lib/types'

export function BasketIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      <path d="M12 16C12 6 36 6 36 16" fill="none" stroke="#14182b" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 16h40l-5 20H9Z" fill="#e3c9a0" stroke="#14182b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 23h32M10 29h28M17 16l1.5 20M31 16l-1.5 20M24 16v20" stroke="#14182b" strokeWidth="1.6" opacity="0.45" />
    </svg>
  )
}

export default function Basket({ types }: { types: GiftType[] }) {
  const label = types.length === 0 ? 'Basket is empty' : `${types.length} in your basket`
  return (
    <div className="flex min-w-0 items-center gap-2" aria-live="polite" aria-label={label}>
      <div className="relative h-10 w-12 shrink-0">
        <div className="absolute inset-x-1 -top-1 flex justify-center -space-x-2">
          <AnimatePresence initial={false}>
            {types.slice(0, 3).map((t) => (
              <motion.span
                key={t}
                initial={{ y: -16, opacity: 0, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                className={`grid h-6 w-6 place-items-center rounded-full border-2 border-ink ${typeTheme[t].bg}`}
              >
                <Art src={categoryInfo[t].image} alt="" size={24} className="h-4 w-4" />
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <BasketIcon className="absolute inset-x-0 bottom-0 h-8 w-12" />
      </div>
      <p className="hidden min-w-0 truncate text-sm font-semibold text-ink sm:block">{label}</p>
      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs font-bold text-paper sm:hidden" aria-hidden="true">{types.length}</span>
    </div>
  )
}
