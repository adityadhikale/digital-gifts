/**
 * Landing page for Digital Gifts.
 * Features animated hero section with floating elements and CTA button.
 * Fully responsive: mobile (< 640px), tablet (640px-1024px), desktop (> 1024px)
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import FloatingElements from '@/components/ui/FloatingElements'
import type { GiftType } from '@/lib/types'

/** Mapping of gift types to their category illustration images */
const categoryImages: Record<GiftType, string> = {
  flower:  '/illustrations/categories/cat-flowers.png',
  sweets:  '/illustrations/categories/cat-sweets.png',
  teddy:   '/illustrations/categories/cat-teddy.png',
  magical: '/illustrations/categories/cat-magical.png',
  letter:  '/illustrations/categories/cat-letters.png',
  memory:  '/illustrations/categories/cat-memories.png',
}

/** Size configuration for GiftIcon component */
const ICON_SIZES = {
  sm: { width: 48,  height: 48,  className: 'w-12 h-12' },
  md: { width: 96,  height: 96,  className: 'w-24 h-24' },
  lg: { width: 128, height: 128, className: 'w-32 h-32' },
} as const

interface GiftIconProps {
  type: GiftType
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Displays a gift category icon with configurable size.
 * Used in gift picker and preview components.
 */
export function GiftIcon({ type, className = '', size = 'md' }: GiftIconProps) {
  const sizeConfig = ICON_SIZES[size]
  const imageSrc = categoryImages[type]
  if (!imageSrc) return null

  return (
    <div
      className={`relative ${className || sizeConfig.className}`}
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
    >
      <Image
        src={imageSrc}
        alt={`${type} gift`}
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="w-full h-full object-contain"
        priority={size === 'lg'}
      />
    </div>
  )
}

/**
 * Main landing page component.
 * Fully responsive layout — stacks vertically on mobile with reduced spacing.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col overflow-hidden relative">

      {/* Floating petals background */}
      <FloatingElements count={18} />

      {/* Large decorative watermark — hidden on very small screens to avoid overflow */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-[family-name:var(--font-playfair)] text-[50vw] text-rose opacity-[0.03] select-none"
          style={{ transform: 'rotate(-12deg)' }}
        >
          &amp;
        </span>
      </div>

      {/* ── Center content — flex-1 so footer stays at bottom ── */}
      <div className="flex-1 flex items-center justify-center py-16 sm:py-20 px-4">
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl mx-auto">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-8 sm:mb-12"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M12 2C8 2 4 6 4 12c0 4 4 10 8 10s8-6 8-10c0-6-4-10-8-10z" fill="#8b2a3e" />
            </svg>
            <span className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl italic text-rose tracking-wide">
              Digital Gifts
            </span>
          </motion.div>

          {/* Headline — clamp keeps it readable on all screen sizes */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="font-[family-name:var(--font-playfair)] font-light leading-tight mb-4 sm:mb-6"
            style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}
          >
            <span className="text-text">beautiful gifts,</span>
            <br />
            <span className="text-rose italic">delivered digitally</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="font-[family-name:var(--font-dm-sans)] font-light text-text-muted text-sm sm:text-base lg:text-lg max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
          >
            Build a personal digital gift — flowers, sweet treats, memories and
            more — and share it with someone you love.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          >
            <Link href="/build">
              <Button size="lg">Build a Gift</Button>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Footer — sits naturally at bottom of flex column, no overlap risk */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 text-center pb-6 pt-2 flex-shrink-0"
      >
        <p className="font-[family-name:var(--font-playfair)] italic text-text-muted text-xs sm:text-sm">
          Made with love · Digital Gifts
        </p>
        <p className="font-[family-name:var(--font-dm-sans)] text-text-muted text-xs mt-1">
          Inspired by my Ex. 💔
        </p>
      </motion.footer>

    </main>
  )
}