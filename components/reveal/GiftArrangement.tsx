/**
 * Arrangement of a gift's items: each one sits on a tissue-colour disc, loosely scattered.
 * The sender picks an arrangement in the builder; it is saved with the gift and shown unchanged
 * to the recipient, who taps a disc to open that gift.
 */

'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Art from '@/components/ui/Art'
import { GiftItem, GiftItemContent, GiftPhoto, GiftType } from '@/lib/types'
import { getItemImage, getItemLabel, typeTheme } from '@/lib/giftCatalog'
import GiftModal from './GiftModal'

/** The minimum an item needs to be drawn in the scene (builder items fit this too) */
export interface ArrangementItem {
  id: string
  type: GiftType
  content: GiftItemContent
  position?: number
}

type RevealItem = GiftItem & { photos?: GiftPhoto[] }

/** A slot in the scene: centre position and size as percentages of the scene width */
type Slot = readonly [x: number, y: number, size: number]

/** Slot positions for each item count (1 to 6), arranged like a loose bouquet */
const SLOTS: Record<number, readonly Slot[]> = {
  1: [[50, 50, 64]],
  2: [[31, 54, 52], [69, 46, 52]],
  3: [[50, 31, 44], [28, 68, 44], [72, 68, 44]],
  4: [[50, 27, 40], [25, 54, 40], [75, 54, 40], [50, 76, 40]],
  5: [[50, 25, 36], [24, 46, 36], [76, 46, 36], [35, 76, 36], [65, 76, 36]],
  6: [[21, 27, 33], [51, 21, 33], [80, 28, 33], [19, 73, 33], [49, 77, 33], [79, 72, 33]],
}

/** Per-slot tilt in degrees; shifted by the arrangement variant */
const TILTS = [-7, 5, -3, 8, -5, 4]

/** Number of distinct arrangements the sender can cycle through */
export const ARRANGEMENT_VARIANTS = 6

/** Scene width that fits the viewport above the headings and buttons on the reveal page */
const REVEAL_WIDTH = 'max(min(92vw, 320px), min(92vw, calc((100dvh - 19rem) * 1.25), 740px))'

/** Which item goes in which slot for a variant: rotate the order, and mirror odd variants */
function orderFor(count: number, variant: number): number[] {
  const order = Array.from({ length: count }, (_, i) => (i + variant) % count)
  return variant % 2 === 1 ? order.reverse() : order
}

/** Stable variant derived from the gift id, for gifts saved before the sender could choose one */
function seedFrom(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h % ARRANGEMENT_VARIANTS
}

interface ArrangementSceneProps {
  items: ArrangementItem[]
  variant: number
  /** CSS width of the scene; defaults to what fits the reveal page */
  width?: string
  /** When omitted, items are not clickable (builder preview) */
  onItemClick?: (id: string) => void
}

/** The scene itself: items placed in slots for the chosen variant */
export function ArrangementScene({ items, variant, width = REVEAL_WIDTH, onItemClick }: ArrangementSceneProps) {
  const reduce = useReducedMotion()
  const sorted = [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const count = Math.min(sorted.length, 6)
  const slots = SLOTS[count]
  if (count === 0 || !slots) return null

  const order = orderFor(count, variant)

  return (
    <div className="relative mx-auto" style={{ width, aspectRatio: '5 / 4' }}>
      {sorted.slice(0, count).map((item, i) => {
        const slotIndex = order.indexOf(i)
        const [x, y, size] = slots[slotIndex]
        const label = getItemLabel(item.type, item.content)
        const theme = typeTheme[item.type]
        return (
          <motion.button
            key={item.id}
            type="button"
            disabled={!onItemClick}
            aria-label={onItemClick ? `Open ${label}` : label}
            onClick={() => onItemClick?.(item.id)}
            className={`group absolute aspect-square rounded-full ${onItemClick ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ x: '-50%', y: '-50%', width: `${size * 0.82}%` }}
            initial={reduce ? false : { left: `${x}%`, top: `${y}%`, rotate: 0, scale: 0.4, opacity: 0 }}
            animate={{ left: `${x}%`, top: `${y}%`, rotate: TILTS[(slotIndex + variant) % TILTS.length] * 0.6, scale: 1, opacity: 1 }}
            whileHover={onItemClick && !reduce ? { scale: 1.07, zIndex: 20 } : undefined}
            whileTap={onItemClick && !reduce ? { scale: 0.96 } : undefined}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: reduce ? 0 : i * 0.08 }}
          >
            <span className={`absolute inset-[6%] rounded-full ${theme.bg} opacity-45`} aria-hidden="true" />
            <Art
              src={getItemImage(item.type, item.content)}
              alt=""
              size={400}
              className="relative h-full w-full object-contain drop-shadow-[0_8px_10px_rgba(20,24,43,0.22)]"
            />
            <span className="pointer-events-none absolute left-1/2 top-[92%] z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-0.5 text-[0.7rem] font-bold capitalize text-paper sm:text-xs">
              {label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

interface GiftArrangementProps {
  items: RevealItem[]
  giftId: string
  fromName?: string
  toName?: string
}

/** Reveal-page arrangement: the sender's saved layout, with a dialog for each item */
export default function GiftArrangement({ items, giftId, fromName, toName }: GiftArrangementProps) {
  const [selected, setSelected] = useState<RevealItem | null>(null)

  const saved = items.map((i) => i.content.arrangement).find((n): n is number => typeof n === 'number')
  const variant = saved ?? seedFrom(giftId)

  return (
    <div className="flex w-full flex-col items-center">
      <ArrangementScene
        items={items}
        variant={variant}
        onItemClick={(id) => setSelected(items.find((i) => i.id === id) ?? null)}
      />

      <p className="mt-3 font-hand text-3xl leading-none text-ink">Tap a gift to open it</p>

      <GiftModal item={selected} onClose={() => setSelected(null)} fromName={fromName} toName={toName} />
    </div>
  )
}
