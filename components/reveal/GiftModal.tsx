/**
 * Dialog that opens one gift. Accessible: role="dialog", labelled, focus moves in and is trapped,
 * Escape and the backdrop close it, and focus returns to the gift that opened it.
 */

'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Art from '@/components/ui/Art'
import MemoryView from './MemoryView'
import { GiftItem, GiftPhoto } from '@/lib/types'
import { categoryInfo, getSelections, optionImages, typeTheme } from '@/lib/giftCatalog'

type ModalItem = GiftItem & { photos?: GiftPhoto[] }

interface GiftModalProps {
  item: ModalItem | null
  onClose: () => void
  fromName?: string
  toName?: string
  /** Heading override (e.g. for the sender's note); defaults to the gift category name */
  title?: string
  /** Header colour classes override (bg + text); defaults to the gift category's tissue colour */
  tone?: string
}

function Pills({ labels }: { labels: string[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {labels.map((l) => (
        <li key={l} className={`rounded-full border-2 px-3.5 py-1 text-sm font-semibold capitalize border-ink bg-white text-ink`}>{l}</li>
      ))}
    </ul>
  )
}

function ArtRow({ item }: { item: ModalItem }) {
  const picked = getSelections(item.type, item.content)
  // Fewer picks get bigger art; five picks still fit in two short rows
  const width = picked.length <= 2 ? 'w-[min(36vw,190px)]' : picked.length <= 3 ? 'w-[min(26vw,140px)]' : 'w-[min(22vw,112px)]'
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {picked.map((s) => (
        <Art key={s} src={optionImages[item.type][s]} alt={s} size={400} className={`h-auto ${width} drop-shadow-[0_8px_10px_rgba(20,24,43,0.25)]`} />
      ))}
    </div>
  )
}

function Body({ item, fromName, toName }: { item: ModalItem; fromName?: string; toName?: string }) {
  const c = item.content as Record<string, unknown>
  const picked = getSelections(item.type, item.content)
  const text = (k: string) => (typeof c[k] === 'string' ? (c[k] as string) : '')

  if (item.type === 'memory') {
    const layout = picked[0] || 'polaroid wall'
    const title = text('title')
    return (
      <div>
        {title && <h3 className="mb-4 text-center text-3xl sm:text-4xl">{title}</h3>}
        <MemoryView layout={layout} photos={item.photos || []} />
      </div>
    )
  }

  if (item.type === 'letter') {
    return (
      <div className="relative">
        <div className="tag-hole relative rounded-2xl border-2 border-ink bg-kraft px-5 pb-6 pt-11 sm:px-8">
          <p className="font-hand text-3xl leading-tight">Dear {toName || 'you'},</p>
          <p className="mt-3 whitespace-pre-wrap font-hand text-[1.7rem] leading-[1.2] sm:text-3xl">{text('text') || '…'}</p>
          <p className="mt-6 text-right font-hand text-3xl leading-tight">With love,<span className="block text-4xl">{fromName || 'someone special'}</span></p>
        </div>
      </div>
    )
  }

  const note = item.type === 'flower' ? text('note') : text('message')
  const holder = item.type === 'teddy' && text('color') ? [`${text('color')} bear`] : []
  return (
    <div className="text-center">
      <Pills labels={[...holder, ...picked.map((p) => (item.type === 'teddy' ? `Holding ${p}` : p))]} />
      {note && (
        item.type === 'teddy' ? (
          <div className="tag-hole relative mx-auto mt-6 max-w-sm -rotate-1 rounded-2xl border-2 border-ink bg-kraft px-5 pb-5 pt-10">
            <p className="font-hand text-3xl leading-[1.1]">{note}</p>
          </div>
        ) : (
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-white px-5 py-4 font-hand text-3xl leading-[1.15] ring-2 ring-ink sm:text-4xl">
            &ldquo;{note}&rdquo;
          </p>
        )
      )}
    </div>
  )
}

export default function GiftModal({ item, onClose, fromName, toName, title, tone }: GiftModalProps) {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Keep the latest onClose without re-running the focus effect on every parent render
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  const isOpen = item !== null

  // Lock page scroll, move focus in, trap Tab, close on Escape, restore focus
  useEffect(() => {
    if (!isOpen) return
    const back = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeRef.current(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
      if (f.length === 0) return
      const a = f[0], z = f[f.length - 1]
      if (e.shiftKey && (document.activeElement === a || document.activeElement === panel.current)) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      back?.focus?.()
    }
  }, [isOpen])

  if (!mounted) return null
  const theme = item ? typeTheme[item.type] : null

  return createPortal(
    <AnimatePresence>
      {item && theme && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-ink/70 sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            className="relative flex max-h-[92dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-t-[2rem] border-2 border-ink bg-paper outline-none sm:rounded-[2rem]"
          >
            {/* Stays put while the dialog content scrolls under it */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_var(--color-ink)] hover:bg-butter"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
            {/* The whole dialog scrolls (header art included), so many gifts never push the content out of reach */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-y-soft">
            <div className={`relative px-5 pb-4 pt-4 text-center sm:px-7 ${tone ?? `${theme.bg} ${theme.text}`}`}>
              {item.type !== 'memory' && item.type !== 'letter' && <div className="pt-6"><ArtRow item={item} /></div>}
              {(item.type === 'memory' || item.type === 'letter') && (
                <Art src={categoryInfo[item.type].image} alt="" size={200} className="mx-auto h-20 w-20 object-contain drop-shadow-[0_6px_8px_rgba(20,24,43,0.25)]" />
              )}
              <h2 id={titleId} className="mt-2 text-2xl sm:text-3xl">{title ?? theme.name}</h2>
            </div>
            <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-8">
              <Body item={item} fromName={fromName} toName={toName} />
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
