'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { GiftType, BuilderGiftItem } from '@/lib/types'

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
const holdingImages: Record<string, string> = {
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
const letterStyleImages: Record<string, string> = {
  'parchment scroll': '/illustrations/letters/scroll.png',
  'sealed envelope': '/illustrations/letters/envelope.png',
  'open letter': '/illustrations/letters/open-letter.png',
}
const memoryLayoutImages: Record<string, string> = {
  'polaroid wall': '/illustrations/memories/polaroid-wall.png',
  'photo strip': '/illustrations/memories/photo-strip.png',
  'scrapbook page': '/illustrations/memories/scrapbook.png',
  'memory jar': '/illustrations/memories/memory-jar.png',
}

interface StepCustomizeProps {
  items: BuilderGiftItem[]
  onUpdateItem: (id: string, content: Record<string, any>) => void
  onUpdatePhotos: (id: string, photos: File[], captions: string[]) => void
  onRemoveItem?: (id: string) => void
  toName?: string
  fromName?: string
}

const typeLabels: Record<GiftType, string> = {
  flower: 'Flowers',
  sweets: 'Sweet Treats',
  teddy: 'Teddy Bear',
  magical: 'Magical',
  letter: 'Love Letter',
  memory: 'Memories',
}

/* ── MultiChip: slightly smaller on mobile, full size on sm+ ── */
function MultiChip({ imageSrc, label, selected, onClick }: {
  imageSrc: string; label: string; selected: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-2xl bg-white w-[90px] sm:w-[110px]
        transition-all duration-200
        ${selected
          ? 'shadow-[0_0_0_2px_#8b2a3e,0_6px_16px_rgba(139,42,62,0.2)] scale-105'
          : 'opacity-75 shadow-sm hover:opacity-100 hover:-translate-y-1 hover:shadow-md'
        }`}>
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose flex items-center justify-center z-10">
          <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5">
            <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      {/* Image slightly smaller on mobile */}
      <div className="w-12 h-12 sm:w-16 sm:h-16">
        <Image src={imageSrc} alt={label} width={64} height={64} className="w-full h-full object-contain" />
      </div>
      <span className="text-xs font-[family-name:var(--font-dm-sans)] text-text capitalize text-center leading-tight">
        {label}
      </span>
    </button>
  )
}

function RomanticInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 sm:px-5 py-3 bg-cream border-2 border-blush/30 rounded-2xl text-text placeholder:text-text-muted/50 placeholder:italic focus:outline-none focus:border-rose transition-all font-[family-name:var(--font-playfair)] italic text-sm" />
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-rose tracking-widest uppercase mb-2">{children}</label>
}

function MixSummary({ items }: { items: string[] }) {
  if (items.length === 0) return null
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return (
    <p className="mt-2 text-xs font-[family-name:var(--font-dm-sans)]" style={{ color: '#8b2a3e' }}>
      Selected: {items.map(cap).join(' + ')}
    </p>
  )
}

// ── FLOWER ────────────────────────────────────────────────────────────────────
function FlowerOptions({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const selected: string[] = content.styles || (content.style ? [content.style] : [])
  const toggle = (s: string) => {
    const updated = selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s]
    onChange({ ...content, styles: updated, style: updated[0] || '' })
  }
  return (
    <div className="space-y-4">
      <div>
        <Label>Bouquet Style</Label>
        <p className="text-[10px] text-text-muted mb-3 font-[family-name:var(--font-dm-sans)]">Pick one or mix multiple flowers!</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['rose', 'peony', 'wildflower', 'tulip', 'sunflower'].map((s) => (
            <MultiChip key={s} imageSrc={flowerImages[s]} label={s} selected={selected.includes(s)} onClick={() => toggle(s)} />
          ))}
        </div>
        <MixSummary items={selected} />
      </div>
      <div>
        <Label>Bouquet Note</Label>
        <RomanticInput value={content.note || ''} onChange={(v) => onChange({ ...content, styles: selected, note: v })} placeholder="A little note for the bouquet..." />
      </div>
    </div>
  )
}

// ── SWEETS ────────────────────────────────────────────────────────────────────
function SweetsOptions({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const selected: string[] = content.types || (content.type ? [content.type] : [])
  const toggle = (t: string) => {
    const updated = selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]
    onChange({ ...content, types: updated, type: updated[0] || '' })
  }
  return (
    <div className="space-y-4">
      <div>
        <Label>Sweet Type</Label>
        <p className="text-[10px] text-text-muted mb-3 font-[family-name:var(--font-dm-sans)]">Mix and match your treats!</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['chocolate box', 'cupcakes', 'macarons', 'cookie jar', 'cake'].map((t) => (
            <MultiChip key={t} imageSrc={sweetImages[t]} label={t} selected={selected.includes(t)} onClick={() => toggle(t)} />
          ))}
        </div>
        <MixSummary items={selected} />
      </div>
      <div>
        <Label>Sweet Message</Label>
        <RomanticInput value={content.message || ''} onChange={(v) => onChange({ ...content, types: selected, message: v })} placeholder="A sweet message..." />
      </div>
    </div>
  )
}

// ── TEDDY ─────────────────────────────────────────────────────────────────────
function TeddyOptions({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const selected: string[] = content.holdings || (content.holding ? [content.holding] : [])
  const toggle = (h: string) => {
    const updated = selected.includes(h) ? selected.filter(x => x !== h) : [...selected, h]
    onChange({ ...content, holdings: updated, holding: updated[0] || '' })
  }
  return (
    <div className="space-y-4">
      <div>
        <Label>Holding</Label>
        <p className="text-[10px] text-text-muted mb-3 font-[family-name:var(--font-dm-sans)]">Teddy can hold multiple things!</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['heart', 'flower', 'balloon', 'gift box'].map((h) => (
            <MultiChip key={h} imageSrc={holdingImages[h]} label={h} selected={selected.includes(h)} onClick={() => toggle(h)} />
          ))}
        </div>
        <MixSummary items={selected} />
      </div>
      <div>
        <Label>Tag Message</Label>
        <RomanticInput value={content.message || ''} onChange={(v) => onChange({ ...content, holdings: selected, message: v })} placeholder="Message on the tag..." />
      </div>
    </div>
  )
}

// ── MAGICAL ───────────────────────────────────────────────────────────────────
function MagicalOptions({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const selected: string[] = content.types || (content.type ? [content.type] : [])
  const toggle = (t: string) => {
    const updated = selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]
    onChange({ ...content, types: updated, type: updated[0] || '' })
  }
  return (
    <div className="space-y-4">
      <div>
        <Label>Magical Type</Label>
        <p className="text-[10px] text-text-muted mb-3 font-[family-name:var(--font-dm-sans)]">Add multiple magical items!</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['snow globe', 'floating balloons', 'wishing lantern', 'jar of stars'].map((t) => (
            <MultiChip key={t} imageSrc={magicalImages[t]} label={t} selected={selected.includes(t)} onClick={() => toggle(t)} />
          ))}
        </div>
        <MixSummary items={selected} />
      </div>
      <div>
        <Label>Wish or Message</Label>
        <RomanticInput value={content.message || ''} onChange={(v) => onChange({ ...content, types: selected, message: v })} placeholder="Make a wish..." />
      </div>
    </div>
  )
}

// ── LETTER ────────────────────────────────────────────────────────────────────
function LetterOptions({ content, onChange, toName, fromName }: {
  content: Record<string, any>; onChange: (c: Record<string, any>) => void; toName?: string; fromName?: string
}) {
  const selected: string[] = content.styles || (content.style ? [content.style] : [])
  const toggle = (s: string) => {
    const updated = selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s]
    onChange({ ...content, styles: updated, style: updated[0] || '' })
  }
  const activeColor = '#2d1f24'
  return (
    <div className="space-y-4">
      <div>
        <Label>Style</Label>
        <p className="text-[10px] text-text-muted mb-3 font-[family-name:var(--font-dm-sans)]">Pick one or multiple letter styles!</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['parchment scroll', 'sealed envelope', 'open letter'].map((s) => (
            <MultiChip key={s} imageSrc={letterStyleImages[s]} label={s} selected={selected.includes(s)} onClick={() => toggle(s)} />
          ))}
        </div>
        <MixSummary items={selected} />
      </div>
      <div className="relative rounded-2xl overflow-hidden shadow-md"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255,248,240,0.8) 0%, transparent 50%), #fdf3e3' }}>
        <div className="relative p-4 sm:p-6"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e8d5c4 27px, #e8d5c4 28px)', backgroundPosition: '0 20px', minHeight: '220px' }}>
          <p className="font-[family-name:var(--font-playfair)] italic text-base mb-1 leading-[28px]" style={{ color: activeColor }}>
            Dear {toName || 'Someone Special'},
          </p>
          <textarea value={content.text || ''} onChange={(e) => onChange({ ...content, styles: selected, text: e.target.value })}
            placeholder="Write your heart out..."
            className="w-full bg-transparent border-none resize-none font-[family-name:var(--font-playfair)] italic text-sm leading-[28px] placeholder:text-text-muted/40 focus:outline-none focus:ring-0"
            style={{ color: activeColor, lineHeight: '28px', minHeight: '120px' }} />
          <div className="text-right">
            <p className="font-[family-name:var(--font-playfair)] italic text-sm leading-[28px]" style={{ color: activeColor }}>
              With love, {fromName || 'Me'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MEMORY — single layout, max 6 photos ─────────────────────────────────────
function MemoryOptions({ content, onChange, photos, captions, onPhotoChange }: {
  content: Record<string, any>; onChange: (c: Record<string, any>) => void
  photos: File[]
  captions: string[]
  onPhotoChange: (files: File[], captions: string[]) => void
}) {
  const selectedLayout: string = content.layouts?.[0] || content.layout || ''
  const selectLayout = (l: string) => {
    onChange({ ...content, layouts: [l], layout: l })
  }

  const MAX_PHOTOS = 6
  const remaining = MAX_PHOTOS - photos.length
  const isFull = photos.length >= MAX_PHOTOS

  return (
    <div className="space-y-4">
      {/* Layout — single select */}
      <div>
        <Label>Layout Style</Label>
        <p className="text-[10px] text-text-muted mb-3 font-[family-name:var(--font-dm-sans)]">Pick one layout style</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['polaroid wall', 'photo strip', 'scrapbook page', 'memory jar'].map((l) => (
            <MultiChip key={l} imageSrc={memoryLayoutImages[l]} label={l}
              selected={selectedLayout === l} onClick={() => selectLayout(l)} />
          ))}
        </div>
        {selectedLayout && (
          <p className="mt-2 text-xs font-[family-name:var(--font-dm-sans)]" style={{ color: '#8b2a3e' }}>
            Selected: {selectedLayout.charAt(0).toUpperCase() + selectedLayout.slice(1)}
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <Label>Title</Label>
        <RomanticInput value={content.title || ''} onChange={(v) => onChange({ ...content, layouts: selectedLayout ? [selectedLayout] : [], title: v })} placeholder="Our Memories..." />
      </div>

      {/* Photos */}
      <div>
        <Label>Photos ({photos.length}/{MAX_PHOTOS})</Label>

        {/* Upload area */}
        {!isFull ? (
          <label className={`block w-full p-4 sm:p-5 border-2 border-dashed rounded-2xl transition-all text-center
            ${!selectedLayout
              ? 'border-rose/20 bg-cream/70 cursor-not-allowed opacity-60'
              : 'border-rose/30 bg-cream hover:bg-blush/20 hover:border-rose/50 cursor-pointer'
            }`}>
            <div className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9 opacity-50">
                <rect x="8" y="12" width="32" height="24" rx="4" stroke="#8b2a3e" strokeWidth="2" fill="none" />
                <circle cx="18" cy="22" r="4" stroke="#8b2a3e" strokeWidth="2" fill="none" />
                <path d="M8 32 L18 24 L28 32 L36 26 L40 30" stroke="#8b2a3e" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-text-muted text-sm">
                {!selectedLayout
                  ? 'Select a layout first'
                  : `Click to upload · ${remaining} spot${remaining === 1 ? '' : 's'} left`
                }
              </span>
            </div>
            <input type="file" accept="image/*" multiple className="hidden"
              disabled={!selectedLayout}
              onChange={(e) => {
                if (!selectedLayout) return
                const incoming = Array.from(e.target.files || [])
                const available = MAX_PHOTOS - photos.length
                const toAdd = incoming.slice(0, available)
                if (incoming.length > available) {
                  alert(`Only ${available} more photo${available === 1 ? '' : 's'} can be added (max ${MAX_PHOTOS} total).`)
                }
                const combined = [...photos, ...toAdd]
                const newCaptions = [...captions, ...Array(toAdd.length).fill('')]
                onPhotoChange(combined, newCaptions.slice(0, combined.length))
                e.target.value = ''
              }} />
          </label>
        ) : (
          <div className="p-4 text-center text-sm rounded-2xl border font-[family-name:var(--font-dm-sans)]"
            style={{ background: 'rgba(139,42,62,0.05)', borderColor: 'rgba(139,42,62,0.15)', color: '#8b2a3e' }}>
            ✓ Maximum 6 photos added
          </div>
        )}

        {/* Caption hint + photo grid */}
        {photos.length > 0 && (
          <>
            {/* ── Caption hint banner ── */}
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(139,42,62,0.06)', border: '1px dashed rgba(139,42,62,0.2)' }}>
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0" style={{ color: '#8b2a3e' }}>
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 7v5m0-7h.01" stroke="#8b2a3e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-[11px] font-[family-name:var(--font-dm-sans)]" style={{ color: '#8b2a3e' }}>
                You can add a caption below each photo <span className="opacity-60">(optional)</span>
              </p>
            </div>

            {/* Photo grid */}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              {photos.map((photo, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -2 : 2 }}
                  className="bg-white rounded-lg shadow-sm relative"
                  style={{ padding: '6px 6px 28px 6px' }}>
                  <div className="aspect-square bg-blush/20 rounded overflow-hidden">
                    <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => {
                      const newPhotos = photos.filter((_, idx) => idx !== i)
                      const newCaptions = captions.filter((_, idx) => idx !== i)
                      onPhotoChange(newPhotos, newCaptions)
                    }}
                    className="absolute top-1 left-1 w-5 h-5 rounded-full bg-rose/80 text-white flex items-center justify-center text-[10px] hover:bg-rose transition-all cursor-pointer">
                    ✕
                  </button>
                  {/* Caption input */}
                  <input
                    type="text"
                    value={captions[i] || ''}
                    onChange={(e) => {
                      const c = [...captions]
                      c[i] = e.target.value
                      onPhotoChange(photos, c)
                    }}
                    placeholder="✦ caption"
                    className="absolute bottom-1.5 left-1 right-1 text-center text-[10px] bg-transparent border-none focus:outline-none font-[family-name:var(--font-playfair)] italic"
                    style={{
                      color: captions[i] ? '#2a1a1f' : 'rgba(139,42,62,0.4)',
                      borderBottom: '1px dashed rgba(139,42,62,0.3)',
                      paddingBottom: '1px',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StepCustomize({ items, onUpdateItem, onUpdatePhotos, onRemoveItem, toName, fromName }: StepCustomizeProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (items.length === 0) return null
  const currentItem = items[Math.min(activeTab, items.length - 1)]

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-light italic text-text mb-1">
        Customize your gifts
      </h2>
      <p className="font-[family-name:var(--font-playfair)] italic text-sm text-text-muted mb-3">
        Make each gift uniquely special
      </p>

      {/* Tabs */}
      {items.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 flex-wrap">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-1">
              <button onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-[family-name:var(--font-dm-sans)] text-xs
                  ${activeTab === i ? 'text-white shadow-md' : 'bg-cream text-text hover:bg-blush/50'}`}
                style={activeTab === i ? { backgroundColor: '#8b2a3e' } : {}}>
                {typeLabels[item.type]}
              </button>
              {onRemoveItem && (
                <button onClick={() => {
                  onRemoveItem(item.id)
                  setActiveTab(Math.max(0, activeTab - 1))
                }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-rose hover:bg-rose/20 transition-all text-xs cursor-pointer">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      {(() => {
        const c = currentItem.content || {}
        const isEmpty =
          currentItem.type === 'flower' ? ((c.styles as string[]) || []).length === 0 :
            currentItem.type === 'sweets' ? ((c.types as string[]) || []).length === 0 :
              currentItem.type === 'teddy' ? ((c.holdings as string[]) || []).length === 0 :
                currentItem.type === 'magical' ? ((c.types as string[]) || []).length === 0 :
                  currentItem.type === 'letter' ? ((c.styles as string[]) || []).length === 0 :
                    currentItem.type === 'memory' ? ((c.layouts as string[]) || []).length === 0 || (currentItem.photos || []).length === 0 : false
        return isEmpty ? (
          <p className="text-xs mb-2 font-[family-name:var(--font-dm-sans)]" style={{ color: '#8b2a3e' }}>
            {currentItem.type === 'memory' && ((currentItem.content?.layouts as string[]) || []).length > 0
              ? '✦ Upload at least one photo to continue'
              : '✦ Pick at least one option to continue'
            }
          </p>
        ) : null
      })()}

      {/* Responsive padding: p-3 on mobile, p-5 on sm+ */}
      <motion.div key={currentItem.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-3 sm:p-5 shadow-md">
        {currentItem.type === 'flower' && <FlowerOptions content={currentItem.content} onChange={(c) => onUpdateItem(currentItem.id, c)} />}
        {currentItem.type === 'sweets' && <SweetsOptions content={currentItem.content} onChange={(c) => onUpdateItem(currentItem.id, c)} />}
        {currentItem.type === 'teddy' && <TeddyOptions content={currentItem.content} onChange={(c) => onUpdateItem(currentItem.id, c)} />}
        {currentItem.type === 'magical' && <MagicalOptions content={currentItem.content} onChange={(c) => onUpdateItem(currentItem.id, c)} />}
        {currentItem.type === 'letter' && <LetterOptions content={currentItem.content} onChange={(c) => onUpdateItem(currentItem.id, c)} toName={toName} fromName={fromName} />}
        {currentItem.type === 'memory' && (
          <MemoryOptions
            content={currentItem.content}
            onChange={(c) => onUpdateItem(currentItem.id, c)}
            photos={currentItem.photos || []}
            captions={currentItem.photoCaptions || []}
            onPhotoChange={(files, caps) => onUpdatePhotos(currentItem.id, files, caps)}
          />
        )}
      </motion.div>
    </div>
  )
}