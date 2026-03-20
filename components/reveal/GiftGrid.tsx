'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GiftItem, GiftPhoto } from '@/lib/types'
import GiftModal from './GiftModal'

const flowerImages: Record<string, string> = {
  rose: '/illustrations/flowers/rose.png',
  peony: '/illustrations/flowers/peony.png',
  wildflower: '/illustrations/flowers/wildflower.png',
  tulip: '/illustrations/flowers/tulip.png',
  sunflower: '/illustrations/flowers/sunflower.png',
}
const sweetImages: Record<string, string> = {
  'chocolate box': '/illustrations/sweets/chocolate-box.png',
  cupcakes: '/illustrations/sweets/cupcakes.png',
  macarons: '/illustrations/sweets/macarons.png',
  'cookie jar': '/illustrations/sweets/cookie-jar.png',
  cake: '/illustrations/sweets/cake.png',
}
const teddyImages: Record<string, string> = {
  heart: '/illustrations/teddy/teddy-heart.png',
  flower: '/illustrations/teddy/teddy-flower.png',
  balloon: '/illustrations/teddy/teddy-balloon.png',
  'gift box': '/illustrations/teddy/teddy-giftbox.png',
}
const magicalImages: Record<string, string> = {
  'snow globe': '/illustrations/magical/snow-globe.png',
  'floating balloons': '/illustrations/magical/balloons.png',
  'wishing lantern': '/illustrations/magical/lantern.png',
  'jar of stars': '/illustrations/magical/star-jar.png',
}
const letterImages: Record<string, string> = {
  'parchment scroll': '/illustrations/letters/scroll.png',
  'sealed envelope': '/illustrations/letters/envelope.png',
  'open letter': '/illustrations/letters/open-letter.png',
}
const memoryImages: Record<string, string> = {
  'polaroid wall': '/illustrations/memories/polaroid-wall.png',
  'photo strip': '/illustrations/memories/photo-strip.png',
  'scrapbook page': '/illustrations/memories/scrapbook.png',
  'memory jar': '/illustrations/memories/memory-jar.png',
}

interface GiftGridProps {
  items: (GiftItem & { photos?: GiftPhoto[] })[]
  fromName?: string
  toName?: string
}

const cardVariants = [
  { width: 'w-full sm:w-[48%] lg:w-[32%]', height: 'min-h-[280px] sm:min-h-[320px]', rotate: -1.5, zIndex: 10, offsetY: 0  },
  { width: 'w-full sm:w-[52%] lg:w-[35%]', height: 'min-h-[300px] sm:min-h-[360px]', rotate: 2,    zIndex: 12, offsetY: 20 },
  { width: 'w-full sm:w-[46%] lg:w-[30%]', height: 'min-h-[260px] sm:min-h-[300px]', rotate: -0.8, zIndex: 11, offsetY: -10 },
  { width: 'w-full sm:w-[50%] lg:w-[33%]', height: 'min-h-[280px] sm:min-h-[340px]', rotate: 1.2,  zIndex: 13, offsetY: 15 },
  { width: 'w-full sm:w-[48%] lg:w-[31%]', height: 'min-h-[280px] sm:min-h-[320px]', rotate: -2,   zIndex: 10, offsetY: 5  },
  { width: 'w-full sm:w-[54%] lg:w-[36%]', height: 'min-h-[320px] sm:min-h-[380px]', rotate: 0.5,  zIndex: 14, offsetY: -5 },
]

function MultiImageGrid({ images, alts, maxH = '70%' }: { images: string[]; alts: string[]; maxH?: string }) {
  if (images.length === 1) {
    return (
      <div className="w-full mx-auto mb-3 flex items-center justify-center" style={{ maxHeight: maxH }}>
        <Image src={images[0]} alt={alts[0]} width={200} height={240}
          className="w-full h-full object-contain drop-shadow-lg" />
      </div>
    )
  }
  return (
    <div className="w-full mx-auto mb-3 flex flex-wrap items-center justify-center gap-2" style={{ maxHeight: maxH }}>
      {images.map((src, i) => (
        <div key={i} style={{ width: images.length <= 2 ? '46%' : '30%' }}>
          <Image src={src} alt={alts[i] || ''} width={120} height={120}
            className="w-full h-full object-contain drop-shadow-md" />
        </div>
      ))}
    </div>
  )
}

function HoverOverlay({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 2px #8b2a3e, 0 0 24px rgba(139,42,62,0.2)' }} />
      <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="#8b2a3e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3">
        <span className={`px-4 py-1.5 rounded-full text-xs font-medium shadow-md
          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
          ${dark ? 'bg-white/20 text-white' : 'bg-white/85'}`}
          style={!dark ? { color: '#8b2a3e' } : {}}>
          Tap to open
        </span>
      </div>
    </>
  )
}

function FlowerCard({ content, onClick }: { content: Record<string, unknown>; onClick: () => void }) {
  const styles = (content.styles as string[]) || (content.style ? [content.style as string] : ['rose'])
  const note   = content.note as string || ''
  return (
    <div className="relative h-full rounded-3xl p-5 overflow-hidden cursor-pointer group"
      style={{ background: 'linear-gradient(135deg, #f5e6d8, #edd5c0)' }} onClick={onClick}>
      <MultiImageGrid images={styles.map(s => flowerImages[s] || flowerImages.rose)} alts={styles} maxH="70%" />
      {note ? (
        <p className="font-[family-name:var(--font-playfair)] italic text-base text-text text-center leading-snug truncate">
          &ldquo;{note}&rdquo;
        </p>
      ) : (
        <p className="font-[family-name:var(--font-playfair)] text-sm text-text-muted text-center capitalize">
          {styles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' + ')} Bouquet
        </p>
      )}
      <HoverOverlay />
    </div>
  )
}

function SweetsCard({ content, onClick }: { content: Record<string, unknown>; onClick: () => void }) {
  const types   = (content.types as string[]) || (content.type ? [content.type as string] : ['chocolate box'])
  const message = content.message as string || ''
  return (
    <div className="relative h-full rounded-3xl p-5 overflow-hidden cursor-pointer group"
      style={{ background: 'linear-gradient(135deg, #f2dcc8, #deb897)' }} onClick={onClick}>
      <MultiImageGrid images={types.map(t => sweetImages[t] || sweetImages['chocolate box'])} alts={types} maxH="65%" />
      {message ? (
        <p className="font-[family-name:var(--font-playfair)] italic text-base text-text text-center leading-snug">
          &ldquo;{message}&rdquo;
        </p>
      ) : (
        <p className="font-[family-name:var(--font-playfair)] text-sm text-text-muted text-center capitalize">
          {types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}
        </p>
      )}
      <HoverOverlay />
    </div>
  )
}

function TeddyCard({ content, onClick }: { content: Record<string, unknown>; onClick: () => void }) {
  const holdings = (content.holdings as string[]) || (content.holding ? [content.holding as string] : ['heart'])
  const message  = content.message as string || ''
  return (
    <div className="relative h-full rounded-3xl p-5 overflow-hidden cursor-pointer group"
      style={{ background: 'linear-gradient(135deg, #ede0d4, #d4bfb0)' }} onClick={onClick}>
      <MultiImageGrid images={holdings.map(h => teddyImages[h] || teddyImages.heart)} alts={holdings} maxH="68%" />
      {message ? (
        <div className="bg-white/60 rounded-lg px-3 py-1.5 text-center">
          <p className="font-[family-name:var(--font-playfair)] italic text-sm text-text truncate">{message}</p>
        </div>
      ) : (
        <p className="font-[family-name:var(--font-playfair)] text-sm text-text-muted text-center capitalize">
          Teddy with {holdings.map(h => h.charAt(0).toUpperCase() + h.slice(1)).join(' + ')}
        </p>
      )}
      <HoverOverlay />
    </div>
  )
}

function MagicalCard({ content, onClick }: { content: Record<string, unknown>; onClick: () => void }) {
  const types   = (content.types as string[]) || (content.type ? [content.type as string] : ['snow globe'])
  const message = content.message as string || ''
  const stars   = useMemo(() =>
    [...Array(15)].map((_, i) => ({
      left: `${10 + (i * 5.3 + 3) % 80}%`,
      top:  `${10 + (i * 7.1 + 1) % 80}%`,
      duration: 2 + (i % 5) * 0.4,
      delay: (i % 7) * 0.35,
    })), [])
  return (
    <div className="relative h-full rounded-3xl p-5 overflow-hidden cursor-pointer group"
      style={{ background: 'linear-gradient(135deg, #2a1015, #4a1a25)' }} onClick={onClick}>
      {stars.map((star, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ left: star.left, top: star.top, background: '#e8c9a0' }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity }} />
      ))}
      <div className="w-full max-h-[65%] mx-auto mb-4 relative">
        <div className="absolute inset-4 blur-2xl rounded-full opacity-20" style={{ background: '#8b2a3e' }} />
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
          {types.map((t, i) => (
            <div key={i} style={{ width: types.length === 1 ? '100%' : '46%' }}>
              <Image src={magicalImages[t] || magicalImages['snow globe']} alt={t}
                width={180} height={180} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          ))}
        </div>
      </div>
      {message ? (
        <p className="font-[family-name:var(--font-playfair)] italic text-base text-center leading-snug relative z-10"
          style={{ color: '#e8c9a0' }}>&ldquo;{message}&rdquo;</p>
      ) : (
        <p className="font-[family-name:var(--font-playfair)] text-sm text-center capitalize relative z-10"
          style={{ color: 'rgba(253,246,238,0.6)' }}>
          {types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}
        </p>
      )}
      <HoverOverlay dark />
    </div>
  )
}

function LetterCard({ content, onClick }: { content: Record<string, unknown>; onClick: () => void }) {
  const styles   = (content.styles as string[]) || (content.style ? [content.style as string] : ['open letter'])
  const text     = content.text as string || ''
  const inkColor = content.inkColor as string || 'black'
  const inkColorMap: Record<string, string> = {
    black: '#3a2a2e', rose: '#8b2a3e', blue: '#4a7db5', gold: '#b8860b',
  }
  const color = inkColorMap[inkColor] || inkColorMap.black
  return (
    <div className="relative h-full rounded-3xl overflow-hidden cursor-pointer group" onClick={onClick}>
      <div className="h-full p-6"
        style={{
          background: 'linear-gradient(135deg, #fdf0e0, #f5e6c8)',
          backgroundImage: `linear-gradient(135deg, #fdf0e0, #f5e6c8), repeating-linear-gradient(transparent, transparent 27px, #e8d5c4 27px, #e8d5c4 28px)`,
          backgroundBlendMode: 'multiply',
          backgroundPosition: '0 0, 0 20px',
        }}>
        <div className="flex gap-2 justify-center mb-3">
          {styles.map((s, i) => (
            <div key={i} className="w-16 h-16">
              <Image src={letterImages[s] || letterImages['open letter']} alt={s}
                width={64} height={64} className="w-full h-full object-contain drop-shadow-md" />
            </div>
          ))}
        </div>
        <p className="font-[family-name:var(--font-playfair)] italic text-base leading-[28px] line-clamp-5" style={{ color }}>
          {text || 'Your heartfelt message will appear here...'}
        </p>
      </div>
      <HoverOverlay />
    </div>
  )
}

// ── MEMORY — grid layout, no overflow clipping ────────────────────────────────
function MemoryCard({ content, photos, onClick }: { content: Record<string, unknown>; photos?: GiftPhoto[]; onClick: () => void }) {
  const title         = content.title as string || ''
  const layouts       = (content.layouts as string[]) || (content.layout ? [content.layout as string] : ['polaroid wall'])
  const displayPhotos = photos?.slice(0, 4) || []

  return (
    <div className="relative h-full rounded-3xl p-4 cursor-pointer group"
      style={{ background: 'linear-gradient(135deg, #f2dcc8, #e8ddd5)' }} onClick={onClick}>

      {title && (
        <p className="font-[family-name:var(--font-playfair)] text-sm text-text font-medium text-center mb-3">{title}</p>
      )}

      {displayPhotos.length > 0 ? (
        /* ── Grid layout — photos never overflow ── */
        <div className="grid grid-cols-2 gap-2">
          {displayPhotos.map((photo, i) => (
            <div key={photo.id || i}
              className="bg-white p-1.5 pb-5 shadow-md rounded-sm"
              style={{ transform: `rotate(${[-3, 2.5, -2, 3.5][i % 4]}deg)` }}>
              <div className="aspect-square bg-gray-100 overflow-hidden rounded-sm">
                {photo.publicUrl ? (
                  <img src={photo.publicUrl} alt={photo.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #f5e6d8, #e8ddd5)' }} />
                )}
              </div>
              {photo.caption && (
                <p className="font-[family-name:var(--font-playfair)] italic text-[10px] text-text-muted text-center mt-1 truncate">
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ── No photos — show layout illustration ── */
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {layouts.map((l, i) => (
            <div key={i} style={{ width: layouts.length === 1 ? '80%' : '45%' }}>
              <Image src={memoryImages[l] || memoryImages['polaroid wall']} alt={l}
                width={180} height={180} className="w-full h-full object-contain drop-shadow-md opacity-80" />
            </div>
          ))}
        </div>
      )}

      <HoverOverlay />
    </div>
  )
}

// ── Main GiftGrid ─────────────────────────────────────────────────────────────
export default function GiftGrid({ items, fromName, toName }: GiftGridProps) {
  const [selectedItem, setSelectedItem] = useState<(GiftItem & { photos?: GiftPhoto[] }) | null>(null)
  const sortedItems = [...items].sort((a, b) => a.position - b.position)

  return (
    <>
      {/*
        Mobile (<640px):   w-full cards stacked, no offsetY, rotation retained for charm
        Tablet (640-1024): 2-col wrapping flex, offsetY applied
        Desktop (1024+):   3-col wrapping flex with offsetY
      */}
      <div className="flex flex-wrap gap-4 sm:gap-5 justify-center items-start px-2 sm:px-0">
        {sortedItems.map((item, i) => {
          const variant = cardVariants[i % cardVariants.length]
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -8, scale: 1.02, zIndex: 50, transition: { duration: 0.3 } }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
              className={`${variant.width} ${variant.height} relative`}
              style={{
                /* Suppress offsetY on mobile; apply on sm+ via a CSS variable trick isn't possible
                   inline, so we keep it — the small values are visually harmless when stacked */
                transform: `rotate(${variant.rotate}deg)`,
                zIndex: variant.zIndex,
                marginTop: variant.offsetY,
              }}>
              <div className="absolute inset-0 rounded-3xl blur-xl translate-y-2" style={{ background: 'rgba(42,26,31,0.12)' }} />
              <div className="relative h-full shadow-xl rounded-3xl overflow-hidden">
                {item.type === 'flower'  && <FlowerCard  content={item.content} onClick={() => setSelectedItem(item)} />}
                {item.type === 'sweets'  && <SweetsCard  content={item.content} onClick={() => setSelectedItem(item)} />}
                {item.type === 'teddy'   && <TeddyCard   content={item.content} onClick={() => setSelectedItem(item)} />}
                {item.type === 'magical' && <MagicalCard content={item.content} onClick={() => setSelectedItem(item)} />}
                {item.type === 'letter'  && <LetterCard  content={item.content} onClick={() => setSelectedItem(item)} />}
                {item.type === 'memory'  && <MemoryCard  content={item.content} photos={item.photos} onClick={() => setSelectedItem(item)} />}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <GiftModal item={selectedItem} onClose={() => setSelectedItem(null)} fromName={fromName} toName={toName} />
        )}
      </AnimatePresence>
    </>
  )
}