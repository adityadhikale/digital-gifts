/**
 * API route for creating new gifts.
 * POST /api/gifts - Creates a gift with its associated items.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateGiftId } from '@/lib/nanoid'
import type { GiftType, GiftItemContent } from '@/lib/types'

/** Request body structure for creating a gift */
interface CreateGiftRequest {
  fromName: string
  toName: string
  message?: string
  items: Array<{
    type: GiftType
    content: GiftItemContent
  }>
}

/**
 * Supabase client with service role key for server-side operations.
 * Falls back to anon key if service role key is not available.
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * POST handler - Creates a new gift with items.
 * @param request - Contains gift metadata and items array
 * @returns JSON with gift ID on success, error message on failure
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateGiftRequest = await request.json()
    const { fromName, toName, message, items } = body

    // Validate required fields
    if (!fromName || !toName) {
      return NextResponse.json({ error: 'Names are required' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'At least one gift item is required' }, { status: 400 })
    }

    // Generate unique gift ID
    const giftId = generateGiftId()

    // Create the main gift record
    const { error: giftError } = await supabase.from('gifts').insert({
      id: giftId,
      from_name: fromName,
      to_name: toName,
      message: message || '',
    })

    if (giftError) {
      console.error('Gift insert error:', giftError)
      return NextResponse.json(
        { error: giftError.message || 'Failed to create gift' },
        { status: 500 }
      )
    }

    // Create associated gift items with position ordering
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const { error: itemError } = await supabase.from('gift_items').insert({
        gift_id: giftId,
        type: item.type,
        content: item.content,
        position: i,
      })

      if (itemError) {
        console.error('Gift item insert error:', itemError)
        // NOTE: We continue even if an item fails to not lose the whole gift
      }
    }

    return NextResponse.json({ id: giftId })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
