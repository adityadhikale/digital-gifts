/**
 * Gift reveal page. The recipient opens it in the dark: unwrap → the tag (if there is a message)
 * → the gifts, each of which opens in a dialog.
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { FullGift, Gift, GiftItem, GiftPhoto } from '@/lib/types'
import UnwrapScreen from '@/components/reveal/UnwrapScreen'
import LetterCard from '@/components/reveal/LetterCard'
import GiftArrangement from '@/components/reveal/GiftArrangement'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'


export default function GiftRevealPage() {
  const params = useParams()
  const id = params.id as string

  const [gift, setGift] = useState<FullGift | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [stage, setStage] = useState<'unwrap' | 'letter' | 'arrange'>('unwrap')

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

  const handleUnwrapped = useCallback(() => {
    setStage(gift?.gift.message ? 'letter' : 'arrange')
  }, [gift])

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

  return (
    <main className={`min-h-dvh overflow-x-clip text-ink transition-colors duration-500 ${stage === 'letter' ? 'bg-pink' : 'bg-paper'}`}>
      {stage === 'unwrap' && <UnwrapScreen onComplete={handleUnwrapped} toName={gift.gift.to_name} />}

      {stage !== 'unwrap' && (
        <div className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-4 py-5 text-center sm:px-6">
          {stage === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full flex-col items-center"
            >
              <h1 className="mb-6 text-3xl text-ink sm:text-5xl">You&apos;ve got a gift</h1>
              <LetterCard message={gift.gift.message} fromName={gift.gift.from_name} toName={gift.gift.to_name} />
              <div className="mt-8">
                <Button variant="primary" size="lg" onClick={() => setStage('arrange')} arrow>See your gifts</Button>
              </div>
            </motion.div>
          )}

          {stage === 'arrange' && (
            <motion.div
              key="arrange"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="flex w-full flex-col items-center"
            >
              <h1 className="text-3xl text-ink sm:text-5xl">From {gift.gift.from_name}</h1>
              <p className="mb-4 mt-1 text-lg text-ink-soft">for <span className="font-semibold text-ink">{gift.gift.to_name}</span></p>

              <GiftArrangement items={gift.items} giftId={id} fromName={gift.gift.from_name} toName={gift.gift.to_name} />

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {gift.gift.message && (
                  <button
                    type="button"
                    onClick={() => setStage('letter')}
                    className="h-11 rounded-full border-2 border-ink px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper active:scale-[0.97]"
                  >
                    Read the tag again
                  </button>
                )}
                <Button href="/build" variant="accent" size="sm">Send your own gift</Button>
              </div>
              <div className="mt-5"><Logo small /></div>
            </motion.div>
          )}
        </div>
      )}
    </main>
  )
}
