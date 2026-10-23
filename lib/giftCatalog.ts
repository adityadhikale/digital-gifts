/**
 * Shared catalog of gift types: labels, illustrations and content-field lookups.
 * Single source of truth for the reveal screens.
 */

import type { GiftItemContent, GiftType } from './types'

/** Category illustration and display label for each gift type */
export const categoryInfo: Record<GiftType, { image: string; label: string }> = {
  flower:  { image: '/illustrations/categories/cat-flowers.png',  label: 'Flowers' },
  sweets:  { image: '/illustrations/categories/cat-sweets.png',   label: 'Sweets' },
  teddy:   { image: '/illustrations/categories/cat-teddy.png',    label: 'Teddy bear' },
  magical: { image: '/illustrations/categories/cat-magical.png',  label: 'Magical' },
  letter:  { image: '/illustrations/categories/cat-letters.png',  label: 'Letter' },
  memory:  { image: '/illustrations/categories/cat-memories.png', label: 'Photos' },
}

/** Illustration for each selectable option, keyed by gift type then option name */
export const optionImages: Record<GiftType, Record<string, string>> = {
  flower: {
    rose: '/illustrations/flowers/rose.png',
    peony: '/illustrations/flowers/peony.png',
    wildflower: '/illustrations/flowers/wildflower.png',
    tulip: '/illustrations/flowers/tulip.png',
    sunflower: '/illustrations/flowers/sunflower.png',
  },
  sweets: {
    'chocolate box': '/illustrations/sweets/chocolate-box.png',
    cupcakes: '/illustrations/sweets/cupcakes.png',
    macarons: '/illustrations/sweets/macarons.png',
    'cookie jar': '/illustrations/sweets/cookie-jar.png',
    cake: '/illustrations/sweets/cake.png',
  },
  teddy: {
    heart: '/illustrations/teddy/teddy-heart.png',
    flower: '/illustrations/teddy/teddy-flower.png',
    balloon: '/illustrations/teddy/teddy-balloon.png',
    'gift box': '/illustrations/teddy/teddy-giftbox.png',
  },
  magical: {
    'snow globe': '/illustrations/magical/snow-globe.png',
    'floating balloons': '/illustrations/magical/balloons.png',
    'wishing lantern': '/illustrations/magical/lantern.png',
    'jar of stars': '/illustrations/magical/star-jar.png',
  },
  letter: {
    'parchment scroll': '/illustrations/letters/scroll.png',
    'sealed envelope': '/illustrations/letters/envelope.png',
    'open letter': '/illustrations/letters/open-letter.png',
  },
  memory: {
    'polaroid wall': '/illustrations/memories/polaroid-wall.png',
    'photo strip': '/illustrations/memories/photo-strip.png',
    'scrapbook page': '/illustrations/memories/scrapbook.png',
    'memory jar': '/illustrations/memories/memory-jar.png',
  },
}

/** Content field holding the selected options: [current plural key, legacy singular key] */
const selectionKeys: Record<GiftType, [string, string]> = {
  flower:  ['styles', 'style'],
  sweets:  ['types', 'type'],
  teddy:   ['holdings', 'holding'],
  magical: ['types', 'type'],
  letter:  ['styles', 'style'],
  memory:  ['layouts', 'layout'],
}

/** The options a sender selected, reading the plural field first and the legacy singular field second */
export function getSelections(type: GiftType, content: GiftItemContent): string[] {
  const [plural, singular] = selectionKeys[type]
  const many = content[plural]
  if (Array.isArray(many)) return many as string[]
  const one = content[singular]
  return typeof one === 'string' ? [one] : []
}

/** Illustration for a gift item: its first selected option, or the category image if there is none */
export function getItemImage(type: GiftType, content: GiftItemContent): string {
  const first = getSelections(type, content).map((s) => optionImages[type][s]).find(Boolean)
  return first ?? categoryInfo[type].image
}

/** Short display label, e.g. "Rose + Peony" or "Teddy with Heart" */
export function getItemLabel(type: GiftType, content: GiftItemContent): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const picked = getSelections(type, content)
  if (picked.length === 0) return categoryInfo[type].label
  const joined = picked.map(cap).join(' + ')
  return type === 'teddy' ? `Teddy with ${joined}` : joined
}
