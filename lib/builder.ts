/**
 * Builder rules shared by the wizard screens: default content per gift type and the
 * "is this gift filled in?" check that gates the Next button.
 */

import type { BuilderGiftItem, GiftItemContent, GiftType } from './types'

/** Default content structure for each gift type */
export const DEFAULT_CONTENT: Record<GiftType, GiftItemContent> = {
  flower: { styles: [], note: '' },
  sweets: { types: [], message: '' },
  teddy: { holdings: [], message: '' },
  magical: { types: [], message: '' },
  letter: { styles: [], text: '', inkColor: 'black' },
  memory: { layouts: [], title: '' },
}

/** Maximum photos in a memory gift */
export const MAX_PHOTOS = 6

/** What is still missing from a gift item, or null when it is ready */
export function missingFor(item: BuilderGiftItem): string | null {
  const c = item.content || {}
  const has = (key: string) => ((c[key] as string[] | undefined) || []).length > 0
  switch (item.type) {
    case 'flower': return has('styles') ? null : 'Pick at least one flower'
    case 'sweets': return has('types') ? null : 'Pick at least one sweet'
    case 'teddy': return has('holdings') ? null : 'Pick what the teddy holds'
    case 'magical': return has('types') ? null : 'Pick at least one magical gift'
    case 'letter':
      if (!has('styles')) return 'Pick a letter style'
      return String(c.text || '').trim().length > 0 ? null : 'Write your letter'
    case 'memory':
      if (!has('layouts')) return 'Pick a layout'
      return (item.photos || []).length > 0 ? null : 'Add at least one photo'
    default: return null
  }
}

export const isItemComplete = (item: BuilderGiftItem) => missingFor(item) === null
