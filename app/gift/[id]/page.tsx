/**
 * Gift reveal page - displays a received gift with animations.
 * Shows an unwrapping animation followed by the gift contents.
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { FullGift, Gift, GiftItem, GiftPhoto } from '@/lib/types'
import RibbonAnimation from '@/components/reveal/RibbonAnimation'
import LetterCard from '@/components/reveal/LetterCard'
import GiftArrangement from '@/components/reveal/GiftArrangement'
import FloatingElements from '@/components/ui/FloatingElements'
import Button from '@/components/ui/Button'

/**
 * Gift reveal page component.
 * Fetches gift data by ID and displays it with reveal animations.
 */
export default function GiftRevealPage() {
  const params = useParams()
  const id = params.id as string

  // Gift data state
  const [gift, setGift] = useState<FullGift | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Reveal stage: unwrap animation, then the letter, then the gift arrangement
  const [stage, setStage] = useState<'unwrap' | 'letter' | 'arrange'>('unwrap')

  /**
   * Fetch gift data from Supabase including items and photos.
   * Uses getPublicUrl() for photo URLs to ensure proper access.
   */
  const fetchGift = useCallback(async () => {
    // Fetch the main gift record
    const { data: giftData, error: giftError } = await supabase
      .from('gifts')
      .select('*')
      .eq('id', id)
      .single()

    if (giftError || !giftData) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Fetch gift items ordered by position
    const { data: itemsData } = await supabase
      .from('gift_items')
      .select('*')
      .eq('gift_id', id)
      .order('position')

    // For each item, fetch associated photos and generate public URLs
    const items = await Promise.all(
      (itemsData || []).map(async (item: GiftItem) => {
        const { data: photosData } = await supabase
          .from('gift_photos')
          .select('*')
          .eq('gift_item_id', item.id)
          .order('position')

        // Add public URL to each photo using Supabase's getPublicUrl
        const photosWithUrls = (photosData || []).map((photo: GiftPhoto) => {
          const { data } = supabase.storage
            .from('digitalgifts-photos')
            .getPublicUrl(photo.storage_path)
          return { ...photo, publicUrl: data.publicUrl }
        })

        return { ...item, photos: photosWithUrls }
      })
    )

    setGift({ gift: giftData as Gift, items })
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchGift()
  }, [fetchGift])

  /** Handle ribbon animation completion */
  const handleAnimationComplete = useCallback(() => {
    setStage(gift?.gift.message ? 'letter' : 'arrange')
  }, [gift])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf6ee' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: '#8b2a3e', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fdf6ee' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          {/* Sad face icon */}
          <div className="w-24 h-24 mx-auto mb-8">
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
              <circle cx="40" cy="40" r="36" fill="#f5e6d8" stroke="#8b2a3e" strokeWidth="2" />
              <path d="M28 50 Q40 58 52 50" stroke="#6b4a52" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="30" cy="34" r="3" fill="#6b4a52" />
              <circle cx="50" cy="34" r="3" fill="#6b4a52" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-text mb-3">
            We can&apos;t find this gift
          </h1>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            Check that the link is complete. If it is, the gift may have been deleted.
          </p>
          <Link href="/"><Button>Go to the home page</Button></Link>
        </motion.div>
      </div>
    )
  }

  // Guard clause for null gift
  if (!gift) return null

  return (
    <main
      className="min-h-dvh overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5e6d8 0%, #fdf6ee 50%, #e8ddd5 100%)' }}
    >
      {/* Ribbon unwrapping animation - shown before content */}
      {stage === 'unwrap' && <RibbonAnimation onComplete={handleAnimationComplete} toName={gift.gift.to_name} />}

      {stage !== 'unwrap' && (
        <>
          <FloatingElements count={20} />

          {/* Gradient overlay for depth */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'linear-gradient(to bottom, rgba(139,42,62,0.04) 0%, transparent 40%, rgba(212,197,184,0.08) 100%)' }}
          />

          {/* One stage per screen */}
          <div className="relative z-10 min-h-dvh max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center py-6 text-center">
            {stage === 'letter' && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full flex flex-col items-center"
              >
                {/* Animated heart icon */}
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 mb-3"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-lg">
                    <path
                      d="M32 58C32 58 8 40 8 22C8 12 16 6 24 6C28 6 31 8 32 10C33 8 36 6 40 6C48 6 56 12 56 22C56 40 32 58 32 58Z"
                      fill="url(#revealHeartGrad)"
                    />
                    <path d="M24 14C20 14 16 18 16 24C16 26 17 28 18 30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                    <defs>
                      <linearGradient id="revealHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b2a3e" />
                        <stop offset="100%" stopColor="#6b1e2e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl font-light text-text mb-5 tracking-wide">
                  You&apos;ve received a gift
                </h1>

                <LetterCard
                  message={gift.gift.message}
                  fromName={gift.gift.from_name}
                  toName={gift.gift.to_name}
                />

                <div className="mt-6">
                  <Button onClick={() => setStage('arrange')}>See your gifts</Button>
                </div>
              </motion.div>
            )}

            {stage === 'arrange' && (
              <motion.div
                key="arrange"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full flex flex-col items-center"
              >
                <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl font-light text-text tracking-wide">
                  From {gift.gift.from_name}
                </h1>
                <p className="text-text-muted text-sm sm:text-base mb-2">
                  For <span className="text-text font-medium">{gift.gift.to_name}</span>
                </p>

                <GiftArrangement
                  items={gift.items}
                  giftId={id}
                  fromName={gift.gift.from_name}
                  toName={gift.gift.to_name}
                />

                <div className="mt-5 flex flex-col items-center gap-2">
                  {gift.gift.message && (
                    <Button variant="outline" size="sm" onClick={() => setStage('letter')}>
                      Read the letter again
                    </Button>
                  )}
                  <p className="font-[family-name:var(--font-playfair)] italic text-sm text-text-muted mt-1">
                    Made with love · Digital Gifts
                  </p>
                  <Link href="/build">
                    <Button variant="ghost" size="sm">Send your own gift</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </main>
  )
}
