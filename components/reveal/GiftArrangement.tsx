/**
 * Arrangement of a gift's items, loosely scattered like a bouquet. The sender picks an
 * arrangement at the wrap step; it is saved with the gift and shown unchanged to the recipient.
 */

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Art from '@/components/ui/Art'
import { GiftItemContent, GiftType } from '@/lib/types'
import { getItemImage, getItemLabel, getSelections, typeTheme } from '@/lib/giftCatalog'

/** The minimum an item needs to be drawn in the scene (builder items fit this too) */
export interface ArrangementItem {
  id: string
  type: GiftType
  content: GiftItemContent
  position?: number
}

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
  /** Name labels under each gift; off for small previews where they would crowd the art */
  showLabels?: boolean
}

/** The scene itself: items placed in slots for the chosen variant */
export function ArrangementScene({ items, variant, width = REVEAL_WIDTH, onItemClick, showLabels = true }: ArrangementSceneProps) {
  const reduce = useReducedMotion()
  const sorted = [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const count = Math.min(sorted.length, 6)
  const slots = SLOTS[count]
  if (count === 0 || !slots) return null

  const order = orderFor(count, variant)

  const placed = sorted.slice(0, count).map((item, i) => {
    const slotIndex = order.indexOf(i)
    const [x, y, size] = slots[slotIndex]
    return { item, i, slotIndex, x, y, size, label: getItemLabel(item.type, item.content) }
  })

  return (
    <div className="relative mx-auto" style={{ width, aspectRatio: '5 / 4' }}>
      {placed.map(({ item, i, slotIndex, x, y, size, label }) => (
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
          <span className={`absolute inset-[6%] rounded-full ${typeTheme[item.type].bg} opacity-45`} aria-hidden="true" />
          <Art
            src={getItemImage(item.type, item.content)}
            alt=""
            size={400}
            className="relative h-full w-full object-contain drop-shadow-[0_8px_10px_rgba(20,24,43,0.22)]"
          />
        </motion.button>
      ))}

      {/* Name labels in their own layer, so no gift's art can cover another gift's name.
          Short on purpose: the category name plus how many things are inside (the dialog lists them).
          Each sits just under its gift (the gift is square: its height is size×0.82% of the width, ÷0.8 in height %). */}
      {showLabels && placed.map(({ item, i, x, y, size }) => {
        const w = Math.min(size * 0.92, 60)
        const left = Math.min(Math.max(x, w / 2 + 1), 99 - w / 2)
        const count = getSelections(item.type, item.content).length
        return (
        <motion.span
          key={`label-${item.id}`}
          aria-hidden="true"
          className="pointer-events-none absolute z-30 flex w-max items-center gap-1 whitespace-nowrap rounded-full bg-ink py-0.5 pl-2.5 pr-1 text-[0.7rem] font-bold leading-tight text-paper sm:text-xs"
          style={{
            left: `${left}%`,
            maxWidth: `${w}%`,
            top: `${Math.min(y + size * 0.41, 93)}%`,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: reduce ? 0 : 0.35 + i * 0.08 }}
        >
          <span className="pr-1.5">{typeTheme[item.type].name}</span>
          {count > 1 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-paper px-1 text-[0.65rem] text-ink sm:h-[1.1rem] sm:text-[0.7rem]">{count}</span>}
        </motion.span>
        )
      })}
    </div>
  )
}

/** The arrangement a gift was saved with, or a stable one derived from its id for older gifts */
export function savedVariant(items: { content: GiftItemContent }[], giftId: string): number {
  const saved = items.map((i) => i.content.arrangement).find((n): n is number => typeof n === 'number')
  return saved ?? seedFrom(giftId)
}
