/**
 * Landing page for Digital Gifts.
 * Features animated hero section with floating elements and CTA button.
 * Fully responsive: mobile (< 640px), tablet (640px-1024px), desktop (> 1024px)
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import FloatingElements from '@/components/ui/FloatingElements'

/**
 * Main landing page component.
 * Fully responsive layout — stacks vertically on mobile with reduced spacing.
 */
export default function LandingPage() {
  return (
    <main className="fixed inset-0 bg-cream flex flex-col overflow-hidden">

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
      <div className="flex-1 min-h-0 flex items-center justify-center py-[clamp(0.75rem,6vh,5rem)] px-4">
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl mx-auto">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-[clamp(0.75rem,5vh,3rem)]"
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
            className="font-[family-name:var(--font-playfair)] font-light leading-tight mb-[clamp(0.5rem,3vh,1.5rem)]"
            style={{ fontSize: 'clamp(1.75rem, min(7vw, 11vh), 5rem)' }}
          >
            <span className="text-text">Make a gift,</span>
            <br />
            <span className="text-rose italic">send it as a link</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="font-[family-name:var(--font-dm-sans)] font-light text-text-muted text-sm sm:text-base lg:text-lg max-w-sm sm:max-w-md mx-auto mb-[clamp(1rem,5vh,2.5rem)] leading-relaxed px-2 sm:px-0 [@media(max-height:480px)]:hidden"
          >
            Pick flowers, sweets, a teddy, a letter or photos, add a message, and send a
            link they can open on their phone.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          >
            <Link href="/build">
              <Button size="lg">Make a gift</Button>
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
      </motion.footer>

    </main>
  )
}