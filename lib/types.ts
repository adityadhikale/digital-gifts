/**
 * Type definitions for the Digital Gifts application.
 * Contains interfaces for gifts, gift items, photos, and builder state.
 */

/** Available gift category types */
export type GiftType = 'flower' | 'sweets' | 'teddy' | 'magical' | 'letter' | 'memory'

/** Database gift record - represents a complete gift package */
export interface Gift {
  id: string
  from_name: string
  to_name: string
  message: string
  created_at: string
  expires_at?: string
}

/**
 * Gift item content type - union of all possible content structures.
 * Using a flexible record type since content varies by gift type.
 */
export type GiftItemContent = Record<string, unknown>

/** Database gift item record - represents a single item within a gift */
export interface GiftItem {
  id: string
  gift_id: string
  type: GiftType
  content: GiftItemContent
  position: number
}

/** Database photo record for memory gift items */
export interface GiftPhoto {
  id: string
  gift_item_id: string
  storage_path: string
  caption?: string
  position: number
  /** Populated at fetch time using Supabase getPublicUrl() */
  publicUrl?: string
}

/** Complete gift data including all items and their photos */
export interface FullGift {
  gift: Gift
  items: (GiftItem & { photos?: GiftPhoto[] })[]
}

/*
 * ── Content interfaces for each gift type ──
 * These define the structure of the `content` field for each gift type.
 */

/** Content structure for flower gifts */
export interface FlowerContent {
  style: 'rose' | 'peony' | 'wildflower' | 'tulip' | 'sunflower'
  styles?: string[]
  color: 'pink' | 'red' | 'white' | 'mixed' | 'purple'
  note: string
}

/** Content structure for sweets gifts */
export interface SweetsContent {
  type: 'chocolate box' | 'cupcakes' | 'macarons' | 'cookie jar' | 'cake'
  types?: string[]
  ribbonColor: string
  message: string
}

/** Content structure for teddy bear gifts */
export interface TeddyContent {
  color: 'brown' | 'white' | 'pink' | 'grey'
  holding: 'heart' | 'flower' | 'balloon' | 'gift box'
  holdings?: string[]
  message: string
}

/** Content structure for magical gifts */
export interface MagicalContent {
  type: 'snow globe' | 'floating balloons' | 'wishing lantern' | 'jar of stars'
  types?: string[]
  colorTheme: string
  message: string
}

/** Content structure for letter gifts */
export interface LetterContent {
  style: 'parchment scroll' | 'sealed envelope' | 'open letter'
  styles?: string[]
  text: string
  inkColor: 'black' | 'rose' | 'blue' | 'gold'
}

/** Content structure for memory gifts */
export interface MemoryContent {
  layout: 'polaroid wall' | 'photo strip' | 'scrapbook page' | 'memory jar'
  layouts?: string[]
  title: string
}

/*
 * ── Builder state types ──
 * Used in the gift builder wizard for managing form state.
 */

/** Builder gift item with local file references for photo uploads */
export interface BuilderGiftItem {
  id: string
  type: GiftType
  content: GiftItemContent
  /** Local File objects for memory photos (not yet uploaded) */
  photos?: File[]
  /** Captions corresponding to each photo by index */
  photoCaptions?: string[]
}

/** Complete builder state for the multi-step wizard */
export interface BuilderState {
  step: number
  selectedTypes: GiftType[]
  items: BuilderGiftItem[]
  toName: string
  fromName: string
  message: string
}
