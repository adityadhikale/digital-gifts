/**
 * Bouquet-style arrangement of a gift's items.
 * The sender picks an arrangement in the builder; it is saved with the gift and
 * shown unchanged to the recipient, who taps an item to open it.
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GiftItem, GiftItemContent, GiftPhoto, GiftType } from '@/lib/types'
import { getItemImage, getItemLabel } from '@/lib/giftCatalog'
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
  1: [[50, 50, 70]],
  2: [[31, 54, 56], [69, 46, 56]],
  3: [[50, 32, 48], [28, 68, 48], [72, 68, 48]],
  4: [[50, 27, 43], [25, 54, 43], [75, 54, 43], [50, 76, 43]],
  5: [[50, 25, 39], [24, 46, 39], [76, 46, 39], [35, 76, 39], [65, 76, 39]],
  6: [[28, 27, 36], [72, 27, 36], [50, 50, 38], [20, 73, 36], [50, 79, 36], [80, 73, 36]],
}

/** Per-slot tilt in degrees; shifted by the arrangement variant */
const TILTS = [-7, 5, -3, 8, -5, 4]

/** Number of distinct arrangements the sender can cycle through */
export const ARRANGEMENT_VARIANTS = 6

/** Scene width that fits the viewport above the headings and buttons on the reveal page */
const REVEAL_WIDTH = 'max(min(92vw, 320px), min(92vw, calc((100dvh - 22.5rem) * 1.25), 760px))'

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
        return (
          <motion.button
            key={item.id}
            type="button"
            disabled={!onItemClick}
            aria-label={onItemClick ? `Open ${label}` : label}
            onClick={() => onItemClick?.(item.id)}
            className={`group absolute ${onItemClick ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ x: '-50%', y: '-50%', width: `${size}%` }}
            initial={{ left: `${x}%`, top: `${y}%`, rotate: 0, scale: 0.4, opacity: 0 }}
            animate={{ left: `${x}%`, top: `${y}%`, rotate: TILTS[(slotIndex + variant) % TILTS.length], scale: 1, opacity: 1 }}
            whileHover={onItemClick ? { scale: 1.08, zIndex: 20 } : undefined}
            whileTap={onItemClick ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.08 }}
          >
            <Image
              src={getItemImage(item.type, item.content)}
              alt={label}
              width={320}
              height={320}
              className="w-full h-auto object-contain drop-shadow-xl"
            />
            <span className="pointer-events-none absolute left-1/2 -bottom-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs text-rose shadow-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
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

/** Reveal-page arrangement: the sender's saved layout, with a modal for each item */
export default function GiftArrangement({ items, giftId, fromName, toName }: GiftArrangementProps) {
  const [selected, setSelected] = useState<RevealItem | null>(null)

  const saved = items.map((i) => i.content.arrangement).find((n): n is number => typeof n === 'number')
  const variant = saved ?? seedFrom(giftId)

  return (
    <div className="flex flex-col items-center w-full">
      <ArrangementScene
        items={items}
        variant={variant}
        onItemClick={(id) => setSelected(items.find((i) => i.id === id) ?? null)}
      />

      <p className="font-[family-name:var(--font-dancing)] text-lg text-text-muted mt-2">
        Tap a gift to open it
      </p>

      <AnimatePresence>
        {selected && (
          <GiftModal item={selected} onClose={() => setSelected(null)} fromName={fromName} toName={toName} />
        )}
      </AnimatePresence>
    </div>
  )
}
