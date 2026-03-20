'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { GiftItem, GiftPhoto } from '@/lib/types'

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

interface GiftModalProps {
  item: (GiftItem & { photos?: GiftPhoto[] }) | null
  onClose: () => void
  fromName?: string
  toName?: string
}

const inkColorMap: Record<string, string> = {
  black: '#2a1a1f', rose: '#8b2a3e', blue: '#4a7db5', gold: '#b8860b',
}

function FloatingPetals() {
  const petals = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      x: -150 + (i * 43) % 300,
      endX: -50 + (i * 31) % 100,
      endRotate: 180 + (i * 47) % 360,
      left: `${20 + (i * 8) % 60}%`,
      duration: 4 + (i % 4) * 0.6,
      delay: i * 0.5,
    })), [])
  return (
    <>
      {petals.map((p, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          initial={{ x: p.x, y: -20, rotate: 0, opacity: 0 }}
          animate={{ y: [null, 400], x: [null, p.endX], rotate: [null, p.endRotate], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          style={{ left: p.left }}>
          <svg viewBox="0 0 20 20" className="w-4 h-4">
            <ellipse cx="10" cy="10" rx="8" ry="5" transform="rotate(45 10 10)" fill="#c9a090" opacity="0.5" />
          </svg>
        </motion.div>
      ))}
    </>
  )
}

function TwinklingStars() {
  const stars = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      left: `${(i * 5.1 + 2) % 100}%`,
      top: `${(i * 7.3 + 4) % 100}%`,
      duration: 1.5 + (i % 4) * 0.3,
      delay: (i % 5) * 0.4,
    })), [])
  return (
    <>
      {stars.map((s, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ left: s.left, top: s.top, background: '#e8c9a0' }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }} />
      ))}
    </>
  )
}

function WaxSeal() {
  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14 sm:w-16 sm:h-16">
      <circle cx="30" cy="30" r="28" fill="#8b2a3e" />
      <circle cx="30" cy="30" r="24" fill="#6b1e2e" />
      <circle cx="30" cy="30" r="18" fill="#8b2a3e" opacity="0.3" />
      <path d="M30 18 Q22 14 22 22 Q22 30 30 34 Q38 30 38 22 Q38 14 30 18" fill="#fdf0e0" opacity="0.8" />
      <circle cx="26" cy="24" r="2" fill="#fdf0e0" opacity="0.4" />
    </svg>
  )
}

/* ── Responsive image row: smaller size on mobile ── */
function ModalImageRow({ images, alts, size = 200 }: { images: string[]; alts: string[]; size?: number }) {
  const mobileSize = Math.min(size, 140)
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mx-auto mb-6">
      {images.map((src, i) => (
        <div key={i} className="flex items-center justify-center flex-shrink-0">
          {/* Mobile: smaller; sm+: full size */}
          <Image src={src} alt={alts[i] || ''} width={size} height={size}
            className="object-contain drop-shadow-xl"
            style={{ width: `clamp(${mobileSize}px, 40vw, ${size}px)`, height: `clamp(${mobileSize}px, 40vw, ${size}px)` }} />
        </div>
      ))}
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm capitalize"
      style={{ background: 'rgba(255,255,255,0.6)', color: '#2a1a1f' }}>
      {children}
    </span>
  )
}

// ── Polaroid photo component ──────────────────────────────────────────────────
function PolaroidPhoto({ photo, rotate, onClick, index }: {
  photo: GiftPhoto; rotate: number; onClick: () => void; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotate - 5 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
      onClick={onClick}
      className="bg-white shadow-xl cursor-pointer"
      style={{ padding: '8px 8px 36px 8px' }}>
      {/* Polaroid width: smaller on mobile */}
      <div className="aspect-square overflow-hidden" style={{ width: 'clamp(90px, 25vw, 130px)' }}>
        {photo.publicUrl ? (
          <img src={photo.publicUrl} alt={photo.caption || ''} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #f5e6d8, #e8ddd5)' }} />
        )}
      </div>
      {photo.caption ? (
        <p className="font-[family-name:var(--font-playfair)] italic text-xs text-center mt-2 text-text-muted truncate"
          style={{ width: 'clamp(90px, 25vw, 130px)' }}>
          {photo.caption}
        </p>
      ) : (
        <p className="font-[family-name:var(--font-playfair)] italic text-[10px] text-center mt-2 opacity-30"
          style={{ width: 'clamp(90px, 25vw, 130px)', color: '#6b4a52' }}>
          add a caption...
        </p>
      )}
    </motion.div>
  )
}

// ── MEMORY LAYOUTS ────────────────────────────────────────────────────────────

// 1. Polaroid Wall
function PolaroidWallLayout({ photos, onPhotoClick }: { photos: GiftPhoto[]; onPhotoClick: (i: number) => void }) {
  const rotations = [-6, 4, -3, 7, -5, 3]
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 py-4">
      {photos.map((photo, i) => (
        <PolaroidPhoto key={photo.id || i} photo={photo} rotate={rotations[i % 6]}
          onClick={() => onPhotoClick(i)} index={i} />
      ))}
    </div>
  )
}

// 2. Photo Strip
function PhotoStripLayout({ photos, onPhotoClick }: { photos: GiftPhoto[]; onPhotoClick: (i: number) => void }) {
  return (
    <div className="flex justify-center py-4">
      <div className="px-3 pt-3 pb-4 rounded-sm shadow-2xl flex flex-col gap-1"
        style={{ width: '180px', background: '#ffffff', border: '1px solid rgba(139,42,62,0.15)' }}>
        <div className="text-center mb-1">
          <span className="text-[9px] font-mono tracking-widest" style={{ color: '#8b2a3e', opacity: 0.5 }}>PHOTO STRIP</span>
        </div>
        {photos.map((photo, i) => (
          <motion.div key={photo.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => onPhotoClick(i)}
            className="cursor-pointer hover:brightness-110 transition-all">
            <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {photo.publicUrl ? (
                <img src={photo.publicUrl} alt={photo.caption || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700" />
              )}
            </div>
            {photo.caption && (
              <p className="text-[9px] text-white/50 text-center py-0.5 font-[family-name:var(--font-playfair)] italic truncate">
                {photo.caption}
              </p>
            )}
          </motion.div>
        ))}
        {/* Strip footer dots */}
        <div className="flex justify-center gap-1 mt-1">
          {photos.map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-white/20" />)}
        </div>
      </div>
    </div>
  )
}

// 3. Scrapbook Page — overflow-hidden added to prevent bleed on small screens
function ScrapbookLayout({ photos, onPhotoClick }: { photos: GiftPhoto[]; onPhotoClick: (i: number) => void }) {
  const configs = [
    { width: '160px', rotate: -4, top: '0%',  left: '5%'  },
    { width: '130px', rotate: 3,  top: '5%',  left: '52%' },
    { width: '145px', rotate: -2, top: '42%', left: '2%'  },
    { width: '135px', rotate: 5,  top: '45%', left: '48%' },
    { width: '130px', rotate: -3, top: '22%', left: '28%' },
    { width: '120px', rotate: 4,  top: '60%', left: '25%' },
  ]
  return (
    /* overflow-hidden prevents photos from bleeding outside on small screens */
    <div className="relative overflow-hidden" style={{ minHeight: '340px', background: '#f5ece4', borderRadius: '8px', padding: '16px' }}>
      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #8b2a3e 23px, #8b2a3e 24px)',
        borderRadius: '8px',
      }} />
      {photos.map((photo, i) => {
        const cfg = configs[i % configs.length]
        return (
          <motion.div key={photo.id || i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => onPhotoClick(i)}
            className="absolute cursor-pointer"
            style={{ top: cfg.top, left: cfg.left, width: cfg.width, zIndex: i + 1 }}
            whileHover={{ scale: 1.08, zIndex: 50 }}>
            {/* Tape decoration */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 opacity-40 rounded-sm"
              style={{ background: '#deb897' }} />
            <div className="bg-white p-1.5 pb-5 shadow-md" style={{ transform: `rotate(${cfg.rotate}deg)` }}>
              <div className="overflow-hidden aspect-square bg-gray-100">
                {photo.publicUrl ? (
                  <img src={photo.publicUrl} alt={photo.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #f5e6d8, #e8ddd5)' }} />
                )}
              </div>
              <p className="font-[family-name:var(--font-playfair)] italic text-[10px] text-center mt-1 text-text-muted truncate">
                {photo.caption || '✦'}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// 4. Memory Jar — overflow-hidden to contain photos on small screens
function MemoryJarLayout({ photos, onPhotoClick }: { photos: GiftPhoto[]; onPhotoClick: (i: number) => void }) {
  const positions = [
    { top: '8%',  left: '3%',  rotate: -8, size: 'clamp(80px, 22vw, 110px)' },
    { top: '5%',  left: '58%', rotate: 6,  size: 'clamp(80px, 22vw, 110px)' },
    { top: '38%', left: '1%',  rotate: -5, size: 'clamp(75px, 20vw, 100px)' },
    { top: '40%', left: '60%', rotate: 7,  size: 'clamp(75px, 20vw, 100px)' },
    { top: '68%', left: '8%',  rotate: -4, size: 'clamp(70px, 18vw, 95px)'  },
    { top: '70%', left: '55%', rotate: 5,  size: 'clamp(70px, 18vw, 95px)'  },
  ]
  return (
    /* overflow-hidden prevents photos bleeding on mobile */
    <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
      {/* Jar illustration */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" style={{ width: '140px' }}>
        <svg viewBox="0 0 160 200" fill="none" className="w-full">
          <path d="M45 40 L45 170 Q45 185 80 185 Q115 185 115 170 L115 40" fill="none" stroke="#8b2a3e" strokeWidth="3" />
          <rect x="45" y="40" width="70" height="145" fill="#8b2a3e" opacity="0.05" />
          <rect x="40" y="30" width="80" height="14" rx="4" fill="#8b2a3e" opacity="0.4" />
          <rect x="62" y="22" width="36" height="12" rx="3" fill="#8b2a3e" opacity="0.3" />
        </svg>
      </div>
      {/* Photos scattered around jar */}
      {photos.map((photo, i) => {
        const pos = positions[i % positions.length]
        return (
          <motion.div key={photo.id || i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
            onClick={() => onPhotoClick(i)}
            className="absolute cursor-pointer"
            style={{ top: pos.top, left: pos.left, width: pos.size, zIndex: i + 1 }}
            whileHover={{ scale: 1.12, zIndex: 50 }}>
            <div className="bg-white p-1.5 pb-4 shadow-lg rounded-sm" style={{ transform: `rotate(${pos.rotate}deg)` }}>
              <div className="overflow-hidden aspect-square bg-gray-100 rounded-sm">
                {photo.publicUrl ? (
                  <img src={photo.publicUrl} alt={photo.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #f5e6d8, #e8ddd5)' }} />
                )}
              </div>
              {photo.caption && (
                <p className="font-[family-name:var(--font-playfair)] italic text-[9px] text-center mt-1 text-text-muted truncate">
                  {photo.caption}
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── MEMORY MODAL ──────────────────────────────────────────────────────────────
function MemoryModalContent({ content, photos }: { content: Record<string, unknown>; photos?: GiftPhoto[] }) {
  const title = content.title as string || ''
  const layouts = (content.layouts as string[]) || (content.layout ? [content.layout as string] : ['polaroid wall'])
  const layout = layouts[0] || 'polaroid wall'
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const displayPhotos = photos && photos.length > 0 ? photos : []

  const bgMap: Record<string, string> = {
    'polaroid wall': 'linear-gradient(135deg, #f5e6d8, #edd5c0)',
    'photo strip': 'linear-gradient(135deg, #f5e6d8, #edd5c0)',
    'scrapbook page': 'linear-gradient(135deg, #f5ece4, #ede0d4)',
    'memory jar': 'linear-gradient(135deg, #f2dcc8, #e8ddd5)',
  }

  return (
    /* p-4 on mobile, p-6 on sm+ */
    <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6"
      style={{ background: bgMap[layout] || bgMap['polaroid wall'] }}>

      {/* Title */}
      {title && (
        <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl text-center text-text mb-4">{title}</h3>
      )}

      {/* Layout label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-[family-name:var(--font-dm-sans)] capitalize px-3 py-1 rounded-full"
          style={{ background: 'rgba(139,42,62,0.1)', color: '#8b2a3e' }}>
          {layout}
        </span>
      </div>

      {/* Caption hint */}
      {displayPhotos.length > 0 && (
        <p className="text-center text-[11px] sm:text-[12px] mb-4 font-[family-name:var(--font-playfair)] italic opacity-50"
          style={{ color: '#6b4a52' }}>
          ✦ Tap any photo to view · captions shown below each
        </p>
      )}

      {/* Layout-specific rendering */}
      {displayPhotos.length > 0 ? (
        <>
          {layout === 'polaroid wall'  && <PolaroidWallLayout photos={displayPhotos} onPhotoClick={setSelectedPhoto} />}
          {layout === 'photo strip'    && <PhotoStripLayout   photos={displayPhotos} onPhotoClick={setSelectedPhoto} />}
          {layout === 'scrapbook page' && <ScrapbookLayout    photos={displayPhotos} onPhotoClick={setSelectedPhoto} />}
          {layout === 'memory jar'     && <MemoryJarLayout    photos={displayPhotos} onPhotoClick={setSelectedPhoto} />}
        </>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="font-[family-name:var(--font-playfair)] italic text-text-muted opacity-50">
            No photos added
          </p>
        </div>
      )}

      {/* Full photo viewer */}
      <AnimatePresence>
        {selectedPhoto !== null && displayPhotos[selectedPhoto] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
            style={{ background: 'rgba(42,26,31,0.92)' }}
            onClick={() => setSelectedPhoto(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-white shadow-2xl"
              style={{ padding: '10px 10px 40px 10px', maxWidth: 'min(90vw, 420px)', width: '100%' }}
              onClick={(e) => e.stopPropagation()}>
              <img src={displayPhotos[selectedPhoto].publicUrl || ''} alt=""
                className="w-full aspect-square object-cover" />
              {displayPhotos[selectedPhoto].caption ? (
                <p className="font-[family-name:var(--font-playfair)] italic text-base sm:text-lg text-text text-center mt-3 sm:mt-4">
                  {displayPhotos[selectedPhoto].caption}
                </p>
              ) : (
                <p className="font-[family-name:var(--font-playfair)] italic text-sm text-center mt-3 sm:mt-4 opacity-30 text-text-muted">
                  no caption
                </p>
              )}
            </motion.div>
            {/* Navigation arrows */}
            {displayPhotos.length > 1 && (
              <>
                <button className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                  onClick={(e) => { e.stopPropagation(); setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : displayPhotos.length - 1) }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                  onClick={(e) => { e.stopPropagation(); setSelectedPhoto(selectedPhoto < displayPhotos.length - 1 ? selectedPhoto + 1 : 0) }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Photo counter */}
                <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {displayPhotos.map((_, i) => (
                    <div key={i} onClick={(e) => { e.stopPropagation(); setSelectedPhoto(i) }}
                      className="w-2 h-2 rounded-full cursor-pointer transition-all"
                      style={{ background: i === selectedPhoto ? 'white' : 'rgba(255,255,255,0.3)' }} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Other modal contents ──────────────────────────────────────────────────────

function FlowerModalContent({ content }: { content: Record<string, unknown> }) {
  const styles = (content.styles as string[]) || (content.style ? [content.style as string] : ['rose'])
  const note = content.note as string || ''
  return (
    /* p-5 on mobile, p-8 on sm+ */
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8" style={{ background: 'linear-gradient(135deg, #f5e6d8, #edd5c0)' }}>
      <FloatingPetals />
      <div className="relative z-10">
        <ModalImageRow images={styles.map(s => flowerImages[s] || flowerImages.rose)} alts={styles} size={192} />
        <div className="flex justify-center flex-wrap gap-2 mb-4 sm:mb-6">
          {styles.map((s, i) => <Badge key={i}>{s}</Badge>)}
        </div>
        {note && (
          <div className="rounded-2xl p-4 sm:p-6 shadow-inner" style={{ background: '#fdf0e0' }}>
            <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl text-center text-text leading-relaxed">
              &ldquo;{note}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SweetsModalContent({ content }: { content: Record<string, unknown> }) {
  const types = (content.types as string[]) || (content.type ? [content.type as string] : ['chocolate box'])
  const message = content.message as string || ''
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8" style={{ background: 'linear-gradient(135deg, #f2dcc8, #deb897)' }}>
      {[...Array(10)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 rounded-full"
          style={{ left: `${(i * 9.1 + 5) % 95}%`, top: `${(i * 7.3 + 3) % 90}%`, background: ['#c9a090', '#deb897', '#8b2a3e'][i % 3], opacity: 0.3 }}
          animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} />
      ))}
      <div className="relative z-10">
        <ModalImageRow images={types.map(t => sweetImages[t] || sweetImages['chocolate box'])} alts={types} size={224} />
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {types.map((t, i) => <Badge key={i}>{t}</Badge>)}
        </div>
        {message && (
          <div className="rounded-2xl p-4 sm:p-6" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl text-center text-text">&ldquo;{message}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TeddyModalContent({ content }: { content: Record<string, unknown> }) {
  const color = content.color as string || 'brown'
  const holdings = (content.holdings as string[]) || (content.holding ? [content.holding as string] : ['heart'])
  const message = content.message as string || ''
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8" style={{ background: 'linear-gradient(135deg, #ede0d4, #d4bfb0)' }}>
      <ModalImageRow images={holdings.map(h => teddyImages[h] || teddyImages.heart)} alts={holdings} size={208} />
      <div className="flex justify-center flex-wrap gap-2 mb-4 sm:mb-6">
        <Badge>{color} bear</Badge>
        {holdings.map((h, i) => <Badge key={i}>Holding {h}</Badge>)}
      </div>
      {message && (
        <div className="relative max-w-sm mx-auto">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <circle cx="12" cy="6" r="4" fill="#c9a090" />
              <path d="M12 10 L12 16" stroke="#c9a090" strokeWidth="2" />
            </svg>
          </div>
          <div className="rounded-xl p-4 sm:p-6 pt-7 sm:pt-8 shadow-md border-2 border-dashed" style={{ background: '#fdf0e0', borderColor: '#deb897' }}>
            <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl text-center text-text">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MagicalModalContent({ content }: { content: Record<string, unknown> }) {
  const types = (content.types as string[]) || (content.type ? [content.type as string] : ['snow globe'])
  const message = content.message as string || ''
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8" style={{ background: 'linear-gradient(135deg, #2a1015, #4a1a25)' }}>
      <TwinklingStars />
      <div className="relative z-10">
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 blur-3xl rounded-full opacity-20" style={{ background: '#F5ECD8' }} />
          <ModalImageRow images={types.map(t => magicalImages[t] || magicalImages['snow globe'])} alts={types} size={224} />
        </div>
        <div className="flex justify-center flex-wrap gap-2 mb-4 sm:mb-6">
          {types.map((t, i) => (
            <span key={i} className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm capitalize"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#e8c9a0' }}>{t}</span>
          ))}
        </div>
        {message && (
          <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl text-center leading-relaxed" style={{ color: '#e8c9a0' }}>
            &ldquo;{message}&rdquo;
          </p>
        )}
      </div>
    </div>
  )
}

function LetterModalContent({ content, fromName, toName }: {
  content: Record<string, unknown>; fromName?: string; toName?: string
}) {
  const styles = (content.styles as string[]) || (content.style ? [content.style as string] : ['open letter'])
  const text = content.text as string || ''
  const inkColor = content.inkColor as string || 'black'
  const color = inkColorMap[inkColor] || inkColorMap.black
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"><WaxSeal /></div>
      {/* p-5 sm:p-8 and pt-12 sm:pt-14 */}
      <div className="p-5 sm:p-8 pt-12 sm:pt-14 min-h-[340px] sm:min-h-[400px]"
        style={{
          background: '#fdf0e0',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e8d5c4 31px, #e8d5c4 32px)',
          backgroundPosition: '0 28px',
        }}>
        <div className="relative z-10">
          <div className="flex gap-2 sm:gap-3 justify-center mb-3 sm:mb-4">
            {styles.map((s, i) => (
              <div key={i} className="w-12 h-12 sm:w-16 sm:h-16">
                <Image src={letterImages[s] || letterImages['open letter']} alt={s}
                  width={64} height={64} className="w-full h-full object-contain drop-shadow-md" />
              </div>
            ))}
          </div>
          <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl mb-4 sm:mb-6" style={{ color }}>
            Dear {toName || 'You'},
          </p>
          <p className="font-[family-name:var(--font-playfair)] italic text-base sm:text-xl leading-[28px] sm:leading-[32px] whitespace-pre-wrap mb-6 sm:mb-8" style={{ color }}>
            {text || 'Your heartfelt message...'}
          </p>
          <div className="text-right">
            <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl" style={{ color }}>With love,</p>
            <p className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl mt-1" style={{ color }}>{fromName || 'Someone special'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal content wrapper ─────────────────────────────────────────────────────
function ModalContent({ item, onClose, fromName, toName }: GiftModalProps & { item: NonNullable<GiftModalProps['item']> }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-4"
        style={{ zIndex: 9999, background: 'rgba(42,26,31,0.88)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          /* Full width on mobile with small inset; capped at 680px on larger screens */
          className="relative w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
          style={{ background: '#fdf6ee' }}
          onClick={(e) => e.stopPropagation()}>

          {/* Close button */}
          <button onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition shadow-md cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.85)', color: '#8b2a3e' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'white')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {item.type === 'flower'  && <FlowerModalContent  content={item.content} />}
          {item.type === 'sweets'  && <SweetsModalContent  content={item.content} />}
          {item.type === 'teddy'   && <TeddyModalContent   content={item.content} />}
          {item.type === 'magical' && <MagicalModalContent content={item.content} />}
          {item.type === 'letter'  && <LetterModalContent  content={item.content} fromName={fromName} toName={toName} />}
          {item.type === 'memory'  && <MemoryModalContent  content={item.content} photos={item.photos} />}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main export — React Portal ────────────────────────────────────────────────
export default function GiftModal({ item, onClose, fromName, toName }: GiftModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (item) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    }
    return () => {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (scrollY) window.scrollTo(0, parseInt(scrollY) * -1)
    }
  }, [item])

  if (!item || !mounted) return null

  return createPortal(
    <ModalContent item={item} onClose={onClose} fromName={fromName} toName={toName} />,
    document.body
  )
}