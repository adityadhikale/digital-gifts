/**
 * The photo gift: four layouts (polaroid wall, photo strip, scrapbook page, memory jar) and a
 * lightbox with keyboard support. Photos come from Supabase public URLs, so plain <img> is used.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GiftPhoto } from '@/lib/types'

type OpenFn = (index: number) => void

const TILT = [-5, 3, -2, 6, -4, 2]

function Pic({ photo, index, className = '' }: { photo: GiftPhoto; index: number; className?: string }) {
  return photo.publicUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo.publicUrl} alt={photo.caption || `Photo ${index + 1}`} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`h-full w-full bg-paper-deep ${className}`} role="img" aria-label={`Photo ${index + 1} unavailable`} />
  )
}

const openBtn = 'block text-left transition-transform duration-200 ease-[var(--ease-out-quint)] hover:z-10 hover:scale-[1.04] active:scale-[0.98]'

function PolaroidWall({ photos, open }: { photos: GiftPhoto[]; open: OpenFn }) {
  return (
    <ul className="flex flex-wrap justify-center gap-4 py-2">
      {photos.map((p, i) => (
        <li key={p.id || i} style={{ rotate: `${TILT[i % 6]}deg` }}>
          <button type="button" onClick={() => open(i)} aria-label={`Open photo ${i + 1}${p.caption ? `: ${p.caption}` : ''}`} className={`${openBtn} w-[min(40vw,150px)] bg-white p-2 pb-3 shadow-[0_6px_0_rgba(20,24,43,0.18)] ring-2 ring-ink`}>
            <div className="aspect-square overflow-hidden"><Pic photo={p} index={i} /></div>
            <p className="mt-2 min-h-6 truncate text-center font-hand text-xl leading-6 text-ink">{p.caption}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}

function PhotoStrip({ photos, open }: { photos: GiftPhoto[]; open: OpenFn }) {
  return (
    <ul className="mx-auto flex w-[min(62vw,210px)] flex-col gap-2 rounded-md bg-ink p-2.5 shadow-[0_8px_0_rgba(20,24,43,0.18)]">
      {photos.map((p, i) => (
        <li key={p.id || i}>
          <button type="button" onClick={() => open(i)} aria-label={`Open photo ${i + 1}${p.caption ? `: ${p.caption}` : ''}`} className={`${openBtn} w-full`}>
            <div className="aspect-[4/3] overflow-hidden"><Pic photo={p} index={i} /></div>
            {p.caption && <p className="truncate pt-1 text-center font-hand text-lg leading-5 text-paper">{p.caption}</p>}
          </button>
        </li>
      ))}
    </ul>
  )
}

function Scrapbook({ photos, open }: { photos: GiftPhoto[]; open: OpenFn }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 rounded-2xl border-2 border-ink bg-kraft p-4 sm:gap-x-5">
      {photos.map((p, i) => (
        <li key={p.id || i} className="relative" style={{ rotate: `${TILT[(i + 2) % 6]}deg` }}>
          <span aria-hidden="true" className={`absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-3 border border-ink/30 ${['bg-tomato', 'bg-butter', 'bg-mint', 'bg-pink'][i % 4]} opacity-90`} />
          <button type="button" onClick={() => open(i)} aria-label={`Open photo ${i + 1}${p.caption ? `: ${p.caption}` : ''}`} className={`${openBtn} w-full bg-white p-1.5 pb-2 ring-2 ring-ink`}>
            <div className="aspect-square overflow-hidden"><Pic photo={p} index={i} /></div>
            {p.caption && <p className="truncate pt-1 text-center font-hand text-lg leading-5 text-ink">{p.caption}</p>}
          </button>
        </li>
      ))}
    </ul>
  )
}

function MemoryJar({ photos, open }: { photos: GiftPhoto[]; open: OpenFn }) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="mx-auto h-8 w-[78%] rounded-t-xl border-2 border-b-0 border-ink bg-tomato" aria-hidden="true" />
      <ul className="grid grid-cols-3 gap-2.5 rounded-b-[2.5rem] rounded-t-md border-2 border-ink bg-[#cde8ff] p-4 pb-6">
        {photos.map((p, i) => (
          <li key={p.id || i} style={{ rotate: `${TILT[(i + 1) % 6]}deg` }}>
            <button type="button" onClick={() => open(i)} aria-label={`Open photo ${i + 1}${p.caption ? `: ${p.caption}` : ''}`} className={`${openBtn} w-full bg-white p-1 pb-2 ring-2 ring-ink`}>
              <div className="aspect-square overflow-hidden"><Pic photo={p} index={i} /></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Lightbox ── */
function Lightbox({ photos, index, onIndex, onClose }: { photos: GiftPhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const photo = photos[index]
  const prev = useCallback(() => onIndex((index - 1 + photos.length) % photos.length), [index, photos.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % photos.length), [index, photos.length, onIndex])

  useEffect(() => {
    const back = document.activeElement as HTMLElement | null
    ref.current?.focus()
    return () => back?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab') {
        const f = ref.current?.querySelectorAll<HTMLElement>('button')
        if (!f || f.length === 0) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [prev, next, onClose])

  const round = 'grid h-12 w-12 place-items-center rounded-full border-2 border-paper/70 text-paper hover:bg-paper hover:text-ink'

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      tabIndex={-1}
      className="on-dark fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink/95 p-4 outline-none"
      onClick={onClose}
    >
      <figure className="w-full max-w-md bg-white p-3 pb-4 ring-2 ring-paper/50" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square overflow-hidden"><Pic photo={photo} index={index} /></div>
        <figcaption className="mt-3 min-h-8 text-center font-hand text-3xl leading-8 text-ink">{photo.caption}</figcaption>
      </figure>

      <div className="mt-5 flex items-center gap-5" onClick={(e) => e.stopPropagation()}>
        {photos.length > 1 && (
          <button type="button" onClick={prev} aria-label="Previous photo" className={round}>
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none"><path d="m12 4-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <span className="min-w-14 text-center text-sm font-semibold text-paper" aria-hidden="true">{index + 1} / {photos.length}</span>
        {photos.length > 1 && (
          <button type="button" onClick={next} aria-label="Next photo" className={round}>
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none"><path d="m8 4 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close photo" className={round}>
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>,
    document.body,
  )
}

export default function MemoryView({ layout, photos }: { layout: string; photos: GiftPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open: OpenFn = (i) => setOpenIndex(i)
  const close = useCallback(() => setOpenIndex(null), [])

  if (photos.length === 0) {
    return <p className="py-10 text-center text-ink/70">No photos were added.</p>
  }

  return (
    <div>
      <p className="mb-4 text-center text-sm font-semibold text-ink/80">Tap a photo to see it larger</p>
      {layout === 'photo strip' ? <PhotoStrip photos={photos} open={open} />
        : layout === 'scrapbook page' ? <Scrapbook photos={photos} open={open} />
        : layout === 'memory jar' ? <MemoryJar photos={photos} open={open} />
        : <PolaroidWall photos={photos} open={open} />}
      {openIndex !== null && <Lightbox photos={photos} index={openIndex} onIndex={setOpenIndex} onClose={close} />}
    </div>
  )
}
