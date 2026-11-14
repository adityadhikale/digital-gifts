/**
 * Step 5 — send it. Create the link (with visible progress and inline errors),
 * then copy it, share it or preview it.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Art from '@/components/ui/Art'
import { categoryInfo, typeTheme } from '@/lib/giftCatalog'
import type { GiftType } from '@/lib/types'

export interface ShareProgress { done: number; total: number; label: string }

interface StepShareProps {
  giftLink: string | null
  onGenerate: () => Promise<void>
  isGenerating: boolean
  error: string | null
  progress: ShareProgress | null
  toName: string
  fromName: string
  types: GiftType[]
}

export default function StepShare({ giftLink, onGenerate, isGenerating, error, progress, toName, fromName, types }: StepShareProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const copy = useCallback(async () => {
    if (!giftLink) return
    try {
      await navigator.clipboard.writeText(giftLink)
    } catch {
      input.current?.select()
      document.execCommand?.('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [giftLink])

  const shareText = `I made you a gift. Open it here: ${giftLink}`
  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 8

  /* ── Done ── */
  if (giftLink) {
    return (
      <section aria-labelledby="send-h">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h1 id="send-h" className="text-3xl sm:text-4xl">It&apos;s tied. Send it.</h1>
          <p className="mt-2 text-base text-ink-soft">Send this link to {toName.trim() || 'them'}. They open it on their phone.</p>

          <div className="mt-8 rounded-[1.75rem] border-2 border-ink bg-mint p-4 sm:p-6">
            <label htmlFor="gift-link" className="text-sm font-semibold">Your link</label>
            <input
              id="gift-link"
              ref={input}
              readOnly
              value={giftLink}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-2 h-12 w-full rounded-2xl border-2 border-ink bg-white px-4 font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-butter"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={copy} size="md" variant="primary" className="min-w-36">
                {copied ? 'Copied ✓' : 'Copy link'}
              </Button>
              {canShare && (
                <Button variant="light" onClick={() => navigator.share({ text: shareText, url: giftLink }).catch(() => {})}>Share…</Button>
              )}
              <Button
                variant="light"
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
              <Button variant="outline" href={giftLink} target="_blank" rel="noopener noreferrer">Preview</Button>
            </div>
            <p className="sr-only" role="status" aria-live="polite">{copied ? 'Link copied' : ''}</p>
          </div>
        </motion.div>
      </section>
    )
  }

  /* ── Ready / saving ── */
  return (
    <section aria-labelledby="send-h">
      <h1 id="send-h" className="text-3xl sm:text-4xl">Send it</h1>
      <p className="mt-2 text-base text-ink-soft">Check it over, then create the link to send.</p>

      <div className="mt-8 rounded-[1.75rem] border-2 border-ink bg-white p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Your basket</p>
        <p className="mt-2 font-display text-3xl font-bold leading-tight">
          For {toName.trim() || '—'}
          <span className="block text-xl font-semibold text-ink-soft">from {fromName.trim() || '—'}</span>
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {types.map((t) => (
            <li key={t} className={`${typeTheme[t].bg} ${typeTheme[t].text} flex items-center gap-1.5 rounded-full border-2 border-ink py-1 pl-1.5 pr-3 text-sm font-semibold`}>
              <Art src={categoryInfo[t].image} alt="" size={28} className="h-7 w-7" />
              {typeTheme[t].name}
            </li>
          ))}
        </ul>
      </div>

      {isGenerating ? (
        <div className="mt-6 rounded-[1.75rem] border-2 border-ink bg-butter p-5" role="status" aria-live="polite">
          <p className="font-semibold">{progress?.label ?? 'Saving your gift…'}</p>
          <div className="mt-3 h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
            <div className="h-full rounded-full bg-ink transition-[width] duration-500 ease-[var(--ease-out-quint)]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink/80">Keep this page open until it&apos;s done.</p>
        </div>
      ) : (
        <div className="mt-6">
          {error && (
            <p role="alert" className="mb-4 rounded-2xl border-2 border-ink bg-tomato px-4 py-3 text-sm font-semibold text-ink">
              Couldn&apos;t create the gift: {error}
            </p>
          )}
          <Button size="lg" onClick={() => void onGenerate()} arrow>{error ? 'Try again' : 'Create link'}</Button>
        </div>
      )}
    </section>
  )
}
