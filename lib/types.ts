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
