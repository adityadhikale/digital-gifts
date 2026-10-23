'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { BuilderGiftItem } from '@/lib/types'
import { ArrangementScene, ARRANGEMENT_VARIANTS } from '@/components/reveal/GiftArrangement'

interface LivePreviewProps {
  items: BuilderGiftItem[]
  toName: string
  fromName: string
  message: string
  arrangement: number
  onArrangementChange: (variant: number) => void
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-12 h-12 mx-auto mb-3 opacity-25">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          <rect x="12" y="28" width="40" height="28" rx="4" stroke="#6b4a52" strokeWidth="1.5" />
          <rect x="8" y="22" width="48" height="10" rx="3" stroke="#6b4a52" strokeWidth="1.5" />
          <rect x="29" y="22" width="6" height="34" stroke="#6b4a52" strokeWidth="1.5" />
          <path d="M32 22 Q22 12 24 18 Q22 24 32 22" stroke="#6b4a52" strokeWidth="1.5" />
          <path d="M32 22 Q42 12 40 18 Q42 24 32 22" stroke="#6b4a52" strokeWidth="1.5" />
          <circle cx="32" cy="20" r="3" stroke="#6b4a52" strokeWidth="1.5" />
        </svg>
      </motion.div>
      <p className="font-[family-name:var(--font-playfair)] italic text-text/35 text-xs">
        Your gifts show up here as you pick them
      </p>
    </div>
  )
}

export default function LivePreview({ items, toName, fromName, message, arrangement, onArrangementChange }: LivePreviewProps) {
  const photoUrlsRef = useRef<string[]>([])
  useEffect(() => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    photoUrlsRef.current = []
  }, [items])

  return (
    <div className="w-full h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#8b2a3e' }}
        />
        <span className="font-[family-name:var(--font-playfair)] italic text-text text-sm tracking-wide">
          Live Preview
        </span>
      </div>

      {/* Browser mockup */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
        style={{ border: '1px solid rgba(139,42,62,0.15)', boxShadow: '0 4px 20px rgba(139,42,62,0.1), 0 1px 4px rgba(0,0,0,0.05)' }}>

        {/* Chrome bar */}
        <div className="bg-[#2a1a1f] px-4 py-2.5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 bg-[#1a1015] rounded-md px-3 py-1 flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 flex-shrink-0">
                <circle cx="8" cy="8" r="6" stroke="#8a6a72" strokeWidth="1.5" />
                <path d="M8 5 L8 8 L10.5 9.5" stroke="#8a6a72" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] text-[#8a6a72]/70 font-mono truncate">
                digitalgifts.com/gift/preview
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0"
          style={{ background: 'linear-gradient(160deg, #f5e6d8 0%, #fdf6ee 50%, #e8ddd5 100%)' }}>

          {/* To / From */}
          <div className="text-center mb-4">
            {toName ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="font-[family-name:var(--font-playfair)] text-sm text-text">
                  For <span className="italic font-medium">{toName}</span>
                </p>
                {fromName && (
                  <p className="font-[family-name:var(--font-playfair)] italic text-xs mt-0.5" style={{ color: '#8b2a3e' }}>
                    From {fromName}
                  </p>
                )}
              </motion.div>
            ) : (
              <p className="font-[family-name:var(--font-playfair)] text-xs text-text/40 italic">
                Recipient&apos;s name
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }} className="relative mb-4">
              <div className="rounded-xl p-4 border border-rose/25 bg-[#fffaf3] shadow-md">
                {toName && (
                  <p className="font-[family-name:var(--font-playfair)] italic text-xs text-text mb-1">
                    Dear <span className="text-rose">{toName}</span>,
                  </p>
                )}
                <p className="font-[family-name:var(--font-playfair)] text-xs text-text leading-relaxed line-clamp-3">
                  {message}
                </p>
                {fromName && (
                  <p className="font-[family-name:var(--font-dancing)] text-sm mt-2 text-right text-rose">
                    With love, {fromName}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Gift arrangement — the layout the recipient will see */}
          {items.length > 0 ? (
            <div className="flex flex-col items-center">
              <ArrangementScene items={items} variant={arrangement} width="min(100%, 400px)" />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onArrangementChange((arrangement + 1) % ARRANGEMENT_VARIANTS)}
                  className="mt-2 rounded-full border border-rose/30 px-4 py-1.5 text-xs text-rose font-[family-name:var(--font-dm-sans)] transition-colors hover:bg-rose/5 cursor-pointer"
                >
                  Try a new arrangement
                </button>
              )}
            </div>
          ) : (
            <EmptyState />
          )}

          {/* Footer */}
          <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(139,42,62,0.1)' }}>
            <p className="font-[family-name:var(--font-playfair)] italic text-[10px] text-text/30">
              Made with love · Digital Gifts
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}