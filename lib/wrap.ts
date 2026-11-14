/**
 * Wrapping options the sender picks at the "wrap it up" counter: paper and ribbon.
 * Saved on each gift item as `content.wrap`; gifts without it use the defaults.
 */

import type { GiftItemContent } from './types'

export interface Paper { id: string; label: string; fill: string; /** Colour of the dots/stripes, if any */ accent?: string; pattern?: 'dots' | 'stripes' }
export interface Ribbon { id: string; label: string; fill: string }

export const PAPERS: Paper[] = [
  { id: 'pink',    label: 'Pink',          fill: '#ff8fb8' },
  { id: 'butter',  label: 'Butter',        fill: '#ffd23f' },
  { id: 'lilac',   label: 'Lilac',         fill: '#b8a4ff' },
  { id: 'mint',    label: 'Mint',          fill: '#5fd3a6' },
  { id: 'kraft',   label: 'Kraft',         fill: '#e3c9a0' },
  { id: 'dots',    label: 'Polka dots',    fill: '#f0452d', accent: '#ffffff', pattern: 'dots' },
  { id: 'stripes', label: 'Candy stripes', fill: '#ffffff', accent: '#ff8fb8', pattern: 'stripes' },
]

export const RIBBONS: Ribbon[] = [
  { id: 'cobalt', label: 'Cobalt', fill: '#2f46e6' },
  { id: 'tomato', label: 'Red',    fill: '#f0452d' },
  { id: 'butter', label: 'Gold',   fill: '#ffd23f' },
  { id: 'ink',    label: 'Navy',   fill: '#14182b' },
  { id: 'white',  label: 'White',  fill: '#ffffff' },
]

export interface WrapChoice { paper: string; ribbon: string }

export const DEFAULT_WRAP: WrapChoice = { paper: 'pink', ribbon: 'cobalt' }

export const paperById = (id: string) => PAPERS.find((p) => p.id === id) ?? PAPERS[0]
export const ribbonById = (id: string) => RIBBONS.find((r) => r.id === id) ?? RIBBONS[0]

/** The saved wrap of a gift, read from the first item that has one */
export function getWrap(items: { content: GiftItemContent }[]): WrapChoice {
  const raw = items.map((i) => i.content.wrap).find((w) => w && typeof w === 'object') as Partial<WrapChoice> | undefined
  return {
    paper: typeof raw?.paper === 'string' ? paperById(raw.paper).id : DEFAULT_WRAP.paper,
    ribbon: typeof raw?.ribbon === 'string' ? ribbonById(raw.ribbon).id : DEFAULT_WRAP.ribbon,
  }
}
