/**
 * Step 4 of the gift builder - Generate and share the gift link.
 * Handles gift link generation and provides sharing options.
 */

'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface StepShareProps {
  giftLink: string | null
  onGenerate: () => Promise<void>
  isGenerating: boolean
}

/** Duration in ms to show "Copied" feedback */
const COPY_FEEDBACK_DURATION = 2000

/**
 * Share step component.
 * Shows generate button before link exists, sharing options after.
 */
export default function StepShare({ giftLink, onGenerate, isGenerating }: StepShareProps) {
  const [copied, setCopied] = useState(false)

  /** Copy link to clipboard with visual feedback */
  const handleCopy = useCallback(async () => {
    if (!giftLink) return
    await navigator.clipboard.writeText(giftLink)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION)
  }, [giftLink])

  /** Open WhatsApp with pre-filled message */
  const handleWhatsApp = useCallback(() => {
    if (!giftLink) return
    const text = encodeURIComponent(`I made something special for you! Open your gift here: ${giftLink}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }, [giftLink])

  /** Open gift link in new tab for preview */
  const handlePreview = useCallback(() => {
    if (giftLink) {
      window.open(giftLink, '_blank')
    }
  }, [giftLink])

  return (
    <div>
      {/* Slightly smaller heading on mobile */}
      <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-light italic text-text mb-2">
        Share the magic
      </h2>
      <p className="font-[family-name:var(--font-dancing)] text-lg text-text-muted mb-4 sm:mb-8">
        Generate your unique gift link
      </p>

      {/* Pre-generation state - show generate button */}
      {!giftLink ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-layered text-center"
        >
          {/* Animated gift box: smaller on mobile, full size on sm+ */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-5 sm:mb-8"
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              {/* Gift box body */}
              <rect x="15" y="45" width="70" height="45" rx="6" fill="url(#giftBoxGrad)" />
              <rect x="15" y="45" width="70" height="45" rx="6" stroke="#c4637a" strokeWidth="2" fill="none" />

              {/* Gift box lid */}
              <rect x="10" y="35" width="80" height="15" rx="4" fill="url(#giftLidGrad)" />
              <rect x="10" y="35" width="80" height="15" rx="4" stroke="#c4637a" strokeWidth="2" fill="none" />

              {/* Ribbons */}
              <rect x="45" y="35" width="10" height="55" fill="#e8859a" />
              <rect x="15" y="62" width="70" height="10" fill="#e8859a" />

              {/* Bow */}
              <path d="M50 35 Q30 20 35 30 Q30 40 50 35" fill="#c4637a" />
              <path d="M50 35 Q70 20 65 30 Q70 40 50 35" fill="#c4637a" />
              <circle cx="50" cy="33" r="5" fill="#e8859a" />

              {/* Sparkle decorations */}
              <path d="M85 30 L87 35 L92 35 L88 38 L90 43 L85 40 L80 43 L82 38 L78 35 L83 35 Z" fill="#ffd700" opacity="0.8" />
              <path d="M15 25 L16 28 L19 28 L17 30 L18 33 L15 31 L12 33 L13 30 L11 28 L14 28 Z" fill="#ffd700" opacity="0.6" />
              <circle cx="25" cy="20" r="2" fill="#c9bfee" />
              <circle cx="75" cy="55" r="1.5" fill="#f9c8d4" />

              <defs>
                <linearGradient id="giftBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde8ed" />
                  <stop offset="100%" stopColor="#f9c8d4" />
                </linearGradient>
                <linearGradient id="giftLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f9c8d4" />
                  <stop offset="100%" stopColor="#fde8ed" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <p className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl text-text mb-2">
            Your gift is ready to be wrapped
          </p>
          <p className="text-text-muted mb-5 sm:mb-8 text-sm sm:text-base">
            Click below to generate your unique gift link
          </p>

          <Button onClick={onGenerate} size="lg" disabled={isGenerating}>
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Creating your gift...
              </span>
            ) : (
              'Generate your gift link'
            )}
          </Button>
        </motion.div>
      ) : (
        /* Post-generation state - show sharing options */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-layered-lg text-center">
            {/* Success checkmark animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6"
            >
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <circle cx="40" cy="40" r="36" fill="url(#successGrad)" />
                <motion.path
                  d="M24 40 L35 51 L56 30"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b2d4ad" />
                    <stop offset="100%" stopColor="#6b9b5a" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl text-text mb-2">
              Your gift is ready!
            </h3>
            <p className="font-[family-name:var(--font-dancing)] text-lg text-rose mb-4 sm:mb-6">
              Share this link with someone special
            </p>

            {/* Gift link display */}
            <div className="bg-cream rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border-2 border-blush/20">
              <p className="text-text text-xs sm:text-sm font-mono break-all">{giftLink}</p>
            </div>

            {/* Sharing action buttons — wrap on small screens */}
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              {/* Copy button */}
              <Button onClick={handleCopy} size="md" variant={copied ? 'ghost' : 'primary'}>
                {copied ? (
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                      <path d="M5 10 L8 13 L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                      <rect x="6" y="6" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M4 14 L4 4 Q4 2 6 2 L12 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                    Copy Link
                  </span>
                )}
              </Button>

              {/* WhatsApp share button */}
              <Button onClick={handleWhatsApp} size="md" variant="outline">
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M12 3.2A8.8 8.8 0 0 0 4.4 16.6L3 21l4.5-1.3A8.8 8.8 0 1 0 12 3.2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 8.8c.2-.4.5-.5.8-.5h.6c.2 0 .4.1.5.4l.9 2c.1.2.1.4 0 .6l-.5.8c-.1.1-.1.3 0 .4.4.7 1 1.3 1.7 1.8.1.1.3.1.4 0l.8-.5c.2-.1.4-.1.6 0l1.9.9c.3.1.4.3.4.5v.6c0 .4-.2.7-.6.8-.5.2-1 .3-1.5.2-1.4-.2-2.8-1-4-2.1-1.1-1.1-1.8-2.5-2.1-4-.1-.5 0-1 .1-1.4Z"
                      fill="currentColor"
                    />
                  </svg>
                  WhatsApp
                </span>
              </Button>

              {/* Preview button */}
              <Button onClick={handlePreview} size="md" variant="ghost">
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                    <path d="M11 3H17V9M17 3L9 11M7 5H5C3.9 5 3 5.9 3 7V15C3 16.1 3.9 17 5 17H13C14.1 17 15 16.1 15 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  Preview
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}