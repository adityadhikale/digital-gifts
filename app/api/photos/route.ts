/**
 * API route for uploading photos to memory gifts.
 * POST /api/photos - Uploads a photo and creates a record.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client with service role key for storage operations.
 * Falls back to anon key if service role key is not available.
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/** Storage bucket name for gift photos */
const PHOTOS_BUCKET = 'digitalgifts-photos'

/**
 * POST handler - Uploads a photo for a memory gift item.
 * @param request - FormData with file, giftId, caption, and position
 * @returns JSON with success status and storage path
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const file = formData.get('file') as File | null
    const giftId = formData.get('giftId') as string | null
    const caption = formData.get('caption') as string | null
    const positionStr = formData.get('position') as string | null
    const position = parseInt(positionStr || '0', 10) || 0

    // Validate required fields
    if (!file || !giftId) {
      return NextResponse.json({ error: 'File and giftId are required' }, { status: 400 })
    }

    // Find the memory gift_item for this gift
    const { data: giftItems, error: giftItemsError } = await supabase
      .from('gift_items')
      .select('id')
      .eq('gift_id', giftId)
      .eq('type', 'memory')

    if (giftItemsError) {
      console.error('Gift items lookup error:', giftItemsError)
      return NextResponse.json(
        { error: giftItemsError.message || 'Failed to find memory gift item' },
        { status: 500 }
      )
    }

    if (!giftItems || giftItems.length === 0) {
      return NextResponse.json({ error: 'No memory gift item found' }, { status: 404 })
    }

    const giftItemId = giftItems[0].id

    // Sanitize filename - remove special characters
    const safeName = (file.name || 'photo').replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${Date.now()}-${safeName}`

    // Storage path format: giftId/giftItemId/filename
    const storagePath = `${giftId}/${giftItemId}/${fileName}`

    // Upload file to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload photo' },
        { status: 500 }
      )
    }

    // Create photo record in database
    const { error: dbError } = await supabase.from('gift_photos').insert({
      gift_item_id: giftItemId,
      storage_path: storagePath,
      caption: caption || null,
      position,
    })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json(
        { error: dbError.message || 'Failed to save photo record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, path: storagePath })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
