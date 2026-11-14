/**
 * Gift reveal page: the surprise. Unwrap the box (in the sender's paper and ribbon) → read the
 * note tucked in front of the gifts → tap each gift to open it.
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { FullGift, Gift, GiftItem, GiftPhoto } from '@/lib/types'
import UnwrapScreen from '@/components/reveal/UnwrapScreen'
import GiftReveal from '@/components/reveal/GiftReveal'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { getWrap } from '@/lib/wrap'


export default function GiftRevealPage() {
  const params = useParams()
  const id = params.id as string

  const [gift, setGift] = useState<FullGift | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [stage, setStage] = useState<'unwrap' | 'reveal'>('unwrap')

  /** Fetch the gift, its items and photos (with public URLs) from Supabase */
  const fetchGift = useCallback(async () => {
    const { data: giftData, error: giftError } = await supabase.from('gifts').select('*').eq('id', id).single()
    if (giftError || !giftData) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const { data: itemsData } = await supabase.from('gift_items').select('*').eq('gift_id', id).order('position')

    const items = await Promise.all(
      (itemsData || []).map(async (item: GiftItem) => {
        const { data: photosData } = await supabase.from('gift_photos').select('*').eq('gift_item_id', item.id).order('position')
        const photosWithUrls = (photosData || []).map((photo: GiftPhoto) => {
          const { data } = supabase.storage.from('digitalgifts-photos').getPublicUrl(photo.storage_path)
          return { ...photo, publicUrl: data.publicUrl }
        })
        return { ...item, photos: photosWithUrls }
      }),
    )

    setGift({ gift: giftData as Gift, items })
    setLoading(false)
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchGift()
  }, [fetchGift])

  const handleUnwrapped = useCallback(() => setStage('reveal'), [])

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-butter" role="status" aria-label="Loading your gift">
        <div className="flex flex-col items-center gap-5">
          <motion.div
            className="h-16 w-16 rounded-xl border-2 border-ink bg-pink"
            animate={{ rotate: [0, -8, 8, 0], y: [0, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="font-hand text-3xl text-ink">Getting your gift…</p>
        </div>
      </main>
    )
  }

  /* ── Not found ── */
  if (notFound) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper px-6">
        <div className="max-w-md text-center">
          <p className="font-hand text-5xl text-tomato">Oh no.</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">We can&apos;t find this gift</h1>
          <p className="mx-auto mt-4 text-lg text-ink-soft">Check that the link is complete. If it is, the gift may have been deleted.</p>
          <div className="mt-8"><Button href="/" size="lg">Go to the home page</Button></div>
        </div>
      </main>
    )
  }

  if (!gift) return null

  const wrap = getWrap(gift.items)

  return (
    <main className="min-h-dvh overflow-x-clip bg-paper text-ink">
      {stage === 'unwrap' && <UnwrapScreen onComplete={handleUnwrapped} toName={gift.gift.to_name} paper={wrap.paper} ribbon={wrap.ribbon} />}

      {stage === 'reveal' && (
        <div className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-4 py-6 text-center sm:px-6">
          <GiftReveal gift={gift} giftId={id} />
          <div className="mt-6 flex flex-col items-center gap-4">
            <Button href="/build" variant="accent" size="sm">Send your own gift</Button>
            <Logo small />
          </div>
        </div>
      )}
    </main>
  )
}
