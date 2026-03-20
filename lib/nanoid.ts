/**
 * Gift ID generation utility.
 * Uses nanoid for short, URL-safe unique identifiers.
 */

import { nanoid } from 'nanoid'

/**
 * Generates a unique 8-character ID for a new gift.
 * Short enough to be shareable while still being collision-resistant.
 * @returns A unique 8-character string ID
 */
export function generateGiftId(): string {
  return nanoid(8)
}
