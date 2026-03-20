'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { BuilderGiftItem } from '@/lib/types'

interface LivePreviewProps {
  items: BuilderGiftItem[]
  toName: string
  fromName: string
  message: string
}

const giftConfig: Record<string, { image: string; label: string; bg: string; textColor: string }> = {
  flower:  { image: '/illustrations/categories/cat-flowers.png',  label: 'Flowers',      bg: 'linear-gradient(135deg, #f5e6d8, #edd5c0)', textColor: '#2a1a1f' },
  sweets:  { image: '/illustrations/categories/cat-sweets.png',   label: 'Sweet Treats', bg: 'linear-gradient(135deg, #f2dcc8, #deb897)', textColor: '#2a1a1f' },
  teddy:   { image: '/illustrations/categories/cat-teddy.png',    label: 'Teddy Bear',   bg: 'linear-gradient(135deg, #ede0d4, #d4bfb0)', textColor: '#2a1a1f' },
  magical: { image: '/illustrations/categories/cat-magical.png',  label: 'Magical',      bg: 'linear-gradient(135deg, #f5e8c8, #f5efe2)', textColor: '#2a1a1f' },
  letter:  { image: '/illustrations/categories/cat-letters.png',  label: 'Love Letter',  bg: 'linear-gradient(135deg, #fdf0e0, #f0dcc8)', textColor: '#2a1a1f' },
  memory:  { image: '/illustrations/categories/cat-memories.png', label: 'Memories',     bg: 'linear-gradient(135deg, #f2dcc8, #e8ddd5)', textColor: '#2a1a1f' },
}

const imageMaps: Record<string, Record<string, string>> = {
  flower: {
    'rose':       '/illustrations/flowers/rose.png',
    'peony':      '/illustrations/flowers/peony.png',
    'wildflower': '/illustrations/flowers/wildflower.png',
    'tulip':      '/illustrations/flowers/tulip.png',
    'sunflower':  '/illustrations/flowers/sunflower.png',
  },
  sweets: {
    'chocolate box': '/illustrations/sweets/chocolate-box.png',
    'cupcakes':      '/illustrations/sweets/cupcakes.png',
    'macarons':      '/illustrations/sweets/macarons.png',
    'cookie jar':    '/illustrations/sweets/cookie-jar.png',
    'cake':          '/illustrations/sweets/cake.png',
  },
  teddy: {
    'heart':    '/illustrations/teddy/teddy-heart.png',
    'flower':   '/illustrations/teddy/teddy-flower.png',
    'balloon':  '/illustrations/teddy/teddy-balloon.png',
    'gift box': '/illustrations/teddy/teddy-giftbox.png',
  },
  magical: {
    'snow globe':        '/illustrations/magical/snow-globe.png',
    'floating balloons': '/illustrations/magical/balloons.png',
    'wishing lantern':   '/illustrations/magical/lantern.png',
    'jar of stars':      '/illustrations/magical/star-jar.png',
  },
  letter: {
    'parchment scroll': '/illustrations/letters/scroll.png',
    'sealed envelope':  '/illustrations/letters/envelope.png',
    'open letter':      '/illustrations/letters/open-letter.png',
  },
  memory: {
    'polaroid wall':  '/illustrations/memories/polaroid-wall.png',
    'photo strip':    '/illustrations/memories/photo-strip.png',
    'scrapbook page': '/illustrations/memories/scrapbook.png',
    'memory jar':     '/illustrations/memories/memory-jar.png',
  },
}

// ── Always returns at least 1 image (fallback = category image) ───────────────
function getAllImages(item: BuilderGiftItem): string[] {
  const content = item.content || {}
  const map     = imageMaps[item.type] || {}
  const fallback = giftConfig[item.type]?.image || '/illustrations/categories/cat-flowers.png'

  let arr: string[] = []

  switch (item.type) {
    case 'flower':  arr = (content.styles as string[])   || (content.style   ? [content.style as string]   : []); break
    case 'sweets':  arr = (content.types as string[])    || (content.type    ? [content.type as string]    : []); break
    case 'teddy':   arr = (content.holdings as string[]) || (content.holding ? [content.holding as string] : []); break
    case 'magical': arr = (content.types as string[])    || (content.type    ? [content.type as string]    : []); break
    case 'letter':  arr = (content.styles as string[])   || (content.style   ? [content.style as string]   : []); break
    case 'memory':  arr = (content.layouts as string[])  || (content.layout  ? [content.layout as string]  : []); break
  }

  const resolved = arr.map(k => map[k]).filter(Boolean)
  // Always fall back to category image so card is never empty
  return resolved.length > 0 ? resolved : [fallback]
}

// ── Label: specific if selected, generic fallback if not ─────────────────────
function getSpecificLabel(item: BuilderGiftItem): string {
  const content = item.content || {}
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const fallbackLabel = giftConfig[item.type]?.label || 'Gift'

  let arr: string[] = []
  let prefix = ''

  switch (item.type) {
    case 'flower':  arr = (content.styles as string[])   || (content.style   ? [content.style as string]   : []); break
    case 'sweets':  arr = (content.types as string[])    || (content.type    ? [content.type as string]    : []); break
    case 'teddy':   arr = (content.holdings as string[]) || (content.holding ? [content.holding as string] : []); prefix = 'Teddy with '; break
    case 'magical': arr = (content.types as string[])    || (content.type    ? [content.type as string]    : []); break
    case 'letter':  arr = (content.styles as string[])   || (content.style   ? [content.style as string]   : []); break
    case 'memory':  arr = (content.layouts as string[])  || (content.layout  ? [content.layout as string]  : []); break
  }

  if (arr.length === 0) return fallbackLabel
  const joined = arr.map(cap).join(' + ')
  return prefix ? `${prefix}${joined}` : joined
}

function extractNote(item: BuilderGiftItem): string {
  const c = item.content || {}
  return (c.note as string) || (c.message as string) || (c.text as string) || (c.wish as string) || (c.title as string) || (c.caption as string) || ''
}

function WaxSeal() {
  return (
    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
      <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-sm">
        <circle cx="12" cy="12" r="11" fill="#8b2a3e" />
        <circle cx="12" cy="12" r="8.5" fill="#6b1e2e" />
        <path d="M12 8.5 Q9.5 7 9.5 8.5 Q9.5 11 12 13.5 Q14.5 11 14.5 8.5 Q14.5 7 12 8.5" fill="#fdf0e0" />
        <circle cx="12" cy="8.5" r="1.5" fill="#fdf0e0" />
      </svg>
    </div>
  )
}

// ── Mini gift card ────────────────────────────────────────────────────────────
function MiniGiftCard({ item, index }: { item: BuilderGiftItem; index: number }) {
  const config = giftConfig[item.type] ?? giftConfig.flower
  const images = getAllImages(item)
  const label  = getSpecificLabel(item)
  const note   = extractNote(item)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      style={{ background: config.bg }}
      className="rounded-xl p-3 flex flex-col items-center text-center shadow-sm min-h-[110px]"
    >
      {/* 1 image */}
      {images.length === 1 && (
        <div className="relative w-16 h-16 mb-2 flex-shrink-0">
          <Image src={images[0]} alt={label} fill className="object-contain drop-shadow-sm" />
        </div>
      )}

      {/* 2 images side by side */}
      {images.length === 2 && (
        <div className="flex gap-1 mb-2 flex-shrink-0">
          {images.map((src, i) => (
            <div key={i} className="relative w-10 h-10">
              <Image src={src} alt={label} fill className="object-contain drop-shadow-sm" />
            </div>
          ))}
        </div>
      )}

      {/* 3+ images grid */}
      {images.length >= 3 && (
        <div className="grid grid-cols-3 gap-0.5 mb-2 flex-shrink-0">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="relative w-9 h-9">
              <Image src={src} alt={label} fill className="object-contain drop-shadow-sm" />
            </div>
          ))}
          {images.length > 3 && (
            <div className="relative w-9 h-9 rounded-lg bg-black/10 flex items-center justify-center">
              <span style={{ color: config.textColor, fontSize: '9px', fontWeight: 700 }}>
                +{images.length - 3}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Label — always shows */}
      <p style={{ color: config.textColor, fontWeight: 700, fontSize: '0.7rem', fontFamily: 'var(--font-dm-sans), sans-serif', lineHeight: 1.3 }}>
        {label}
      </p>

      {note && (
        <p style={{ color: config.textColor }}
          className="font-[family-name:var(--font-playfair)] text-[10px] italic mt-0.5 line-clamp-1 opacity-70">
          {note}
        </p>
      )}
    </motion.div>
  )
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
        Your gifts will appear here
      </p>
    </div>
  )
}

export default function LivePreview({ items, toName, fromName, message }: LivePreviewProps) {
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
                    From {fromName}, with love
                  </p>
                )}
              </motion.div>
            ) : (
              <p className="font-[family-name:var(--font-playfair)] text-xs text-text/40 italic">
                For your special someone
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }} className="relative mb-4">
              <div className="rounded-xl p-4 relative"
                style={{
                  background: '#fdf0e0',
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #e8d5c4 23px, #e8d5c4 24px)',
                  border: '1px solid rgba(139,42,62,0.15)',
                  boxShadow: '0 3px 16px rgba(139,42,62,0.1)',
                }}>
                <WaxSeal />
                {toName && (
                  <p className="font-[family-name:var(--font-playfair)] italic text-xs text-text/70 mt-1.5 mb-1">
                    Dear {toName},
                  </p>
                )}
                <p className="font-[family-name:var(--font-playfair)] italic text-xs text-text leading-relaxed line-clamp-3">
                  {message}
                </p>
                {fromName && (
                  <p className="font-[family-name:var(--font-playfair)] italic text-[10px] mt-2 text-right" style={{ color: '#8b2a3e' }}>
                    With love, {fromName}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Gift cards */}
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {items.map((item, index) => (
                <MiniGiftCard key={item.id} item={item} index={index} />
              ))}
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