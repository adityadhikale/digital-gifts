/**
 * Shared catalog of gift types: labels, illustrations and content-field lookups.
 * Single source of truth for the reveal screens.
 */

import type { GiftItemContent, GiftType } from './types'

/** Category illustration and display label for each gift type */
export const categoryInfo: Record<GiftType, { image: string; label: string }> = {
  flower:  { image: '/art/categories/cat-flowers.webp',  label: 'Flowers' },
  sweets:  { image: '/art/categories/cat-sweets.webp',   label: 'Sweets' },
  teddy:   { image: '/art/categories/cat-teddy.webp',    label: 'Teddy bear' },
  magical: { image: '/art/categories/cat-magical.webp',  label: 'Magical' },
  letter:  { image: '/art/categories/cat-letters.webp',  label: 'Letter' },
  memory:  { image: '/art/categories/cat-memories.webp', label: 'Photos' },
}

/** Illustration for each selectable option, keyed by gift type then option name */
export const optionImages: Record<GiftType, Record<string, string>> = {
  flower: {
    rose: '/art/flowers/rose.webp',
    peony: '/art/flowers/peony.webp',
    wildflower: '/art/flowers/wildflower.webp',
    tulip: '/art/flowers/tulip.webp',
    sunflower: '/art/flowers/sunflower.webp',
  },
  sweets: {
    'chocolate box': '/art/sweets/chocolate-box.webp',
    cupcakes: '/art/sweets/cupcakes.webp',
    macarons: '/art/sweets/macarons.webp',
    'cookie jar': '/art/sweets/cookie-jar.webp',
    cake: '/art/sweets/cake.webp',
  },
  teddy: {
    heart: '/art/teddy/teddy-heart.webp',
    flower: '/art/teddy/teddy-flower.webp',
    balloon: '/art/teddy/teddy-balloon.webp',
    'gift box': '/art/teddy/teddy-giftbox.webp',
  },
  magical: {
    'snow globe': '/art/magical/snow-globe.webp',
    'floating balloons': '/art/magical/balloons.webp',
    'wishing lantern': '/art/magical/lantern.webp',
    'jar of stars': '/art/magical/star-jar.webp',
  },
  letter: {
    'parchment scroll': '/art/letters/scroll.webp',
    'sealed envelope': '/art/letters/envelope.webp',
    'open letter': '/art/letters/open-letter.webp',
  },
  memory: {
    'polaroid wall': '/art/memories/polaroid-wall.webp',
    'photo strip': '/art/memories/photo-strip.webp',
    'scrapbook page': '/art/memories/scrapbook.webp',
    'memory jar': '/art/memories/memory-jar.webp',
  },
}

/** Tissue colour (Tailwind token) and readable text colour for each gift type */
export const typeTheme: Record<GiftType, { bg: string; text: string; hex: string; name: string; blurb: string }> = {
  flower:  { bg: 'bg-pink',   text: 'text-ink',   hex: '#ff8fb8', name: 'Flowers',     blurb: "A bouquet that doesn't wilt" },
  sweets:  { bg: 'bg-butter', text: 'text-ink',   hex: '#ffd23f', name: 'Sweets',      blurb: 'Cakes, cupcakes, chocolates' },
  teddy:   { bg: 'bg-lilac',  text: 'text-ink',   hex: '#b8a4ff', name: 'Teddy bear',  blurb: 'A teddy holding something' },
  magical: { bg: 'bg-cobalt', text: 'text-white', hex: '#2f46e6', name: 'Magical',     blurb: 'Snow globes, lanterns, balloons' },
  letter:  { bg: 'bg-tomato', text: 'text-ink',   hex: '#f0452d', name: 'Letter',      blurb: 'Your own words' },
  memory:  { bg: 'bg-mint',   text: 'text-ink',   hex: '#5fd3a6', name: 'Photos',      blurb: 'Up to 6 of your photos' },
}

/** Gift types in display order */
export const GIFT_ORDER: GiftType[] = ['flower', 'sweets', 'teddy', 'magical', 'letter', 'memory']

/** Selectable options per gift type, in display order */
export const optionLists: Record<GiftType, string[]> = {
  flower: ['rose', 'peony', 'wildflower', 'tulip', 'sunflower'],
  sweets: ['chocolate box', 'cupcakes', 'macarons', 'cookie jar', 'cake'],
  teddy: ['heart', 'flower', 'balloon', 'gift box'],
  magical: ['snow globe', 'floating balloons', 'wishing lantern', 'jar of stars'],
  letter: ['parchment scroll', 'sealed envelope', 'open letter'],
  memory: ['polaroid wall', 'photo strip', 'scrapbook page', 'memory jar'],
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
