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
import FloatingLetter from '@/components/reveal/FloatingLetter'
import GiftGrid from '@/components/reveal/GiftGrid'
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

  // Animation state - controls when content appears after ribbon animation
  const [showContent, setShowContent] = useState(false)

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
    setShowContent(true)
  }, [])

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
            This gift has expired or doesn&apos;t exist
          </h1>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            The gift link might be incorrect or the gift may have been removed.
          </p>
          <Link href="/"><Button>Go Home</Button></Link>
        </motion.div>
      </div>
    )
  }

  // Guard clause for null gift
  if (!gift) return null

  return (
    <main
      className="min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5e6d8 0%, #fdf6ee 50%, #e8ddd5 100%)' }}
    >
      {/* Ribbon unwrapping animation - shown before content */}
      {!showContent && <RibbonAnimation onComplete={handleAnimationComplete} />}

      {/* Main content - shown after animation */}
      {showContent && (
        <>
          <FloatingElements count={20} />

          {/* Gradient overlay for depth */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'linear-gradient(to bottom, rgba(139,42,62,0.04) 0%, transparent 40%, rgba(212,197,184,0.08) 100%)' }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Header section with animated sparkles */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center mb-16 relative"
            >
              {/* Decorative sparkles */}
              <motion.div
                className="absolute -top-4 left-1/4 w-6 h-6"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="#8b2a3e" opacity="0.4">
                  <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
                </svg>
              </motion.div>
              <motion.div
                className="absolute top-8 right-1/4 w-4 h-4"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, delay: 0.5, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="#deb897" opacity="0.5">
                  <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
                </svg>
              </motion.div>
              <motion.div
                className="absolute -bottom-2 left-1/3 w-5 h-5"
                animate={{ opacity: [0.5, 1, 0.5], rotate: [0, 90, 0] }}
                transition={{ duration: 4, delay: 1, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="#8b2a3e" opacity="0.3">
                  <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
                </svg>
              </motion.div>

              {/* Animated heart icon */}
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-lg">
                  <path
                    d="M32 58C32 58 8 40 8 22C8 12 16 6 24 6C28 6 31 8 32 10C33 8 36 6 40 6C48 6 56 12 56 22C56 40 32 58 32 58Z"
                    fill="url(#revealHeartGrad)"
                  />
                  <path
                    d="M24 14C20 14 16 18 16 24C16 26 17 28 18 30"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient id="revealHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b2a3e" />
                      <stop offset="100%" stopColor="#6b1e2e" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-light text-text mb-6 tracking-wide"
              >
                You&apos;ve received a gift
              </motion.h1>

              {/* From name */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl mb-2"
                style={{ color: '#8b2a3e' }}
              >
                From {gift.gift.from_name}, with love
              </motion.p>

              {/* To name */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-text-muted text-lg"
              >
                For <span className="text-text font-medium">{gift.gift.to_name}</span>
              </motion.p>
            </motion.div>

            {/* Personal message as floating letter */}
            {gift.gift.message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <FloatingLetter
                  message={gift.gift.message}
                  fromName={gift.gift.from_name}
                  toName={gift.gift.to_name}
                />
              </motion.div>
            )}

            {/* Gift items grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <GiftGrid items={gift.items} fromName={gift.gift.from_name} toName={gift.gift.to_name} />
            </motion.div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-center mt-20 pt-10"
              style={{ borderTop: '1px solid rgba(139,42,62,0.1)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M8 3Q5 0 5 3Q5 6 8 9Q11 6 11 3Q11 0 8 3" fill="#8b2a3e" />
                </svg>
              </div>
              <p className="text-text-muted text-sm mb-1">Made with love</p>
              <p className="font-[family-name:var(--font-playfair)] italic" style={{ color: '#8b2a3e' }}>
                Digital Gifts
              </p>
              <p className="font-[family-name:var(--font-dm-sans)] text-text-muted text-xs mb-6 mt-1">
                Inspired by my Ex. 💔
              </p>
              <Link href="/build">
                <Button variant="outline" size="sm">Send your own gift</Button>
              </Link>
            </motion.footer>
          </div>
        </>
      )}
    </main>
  )
}
