/**
 * What the recipient sees after unwrapping: the gifts laid out the way the sender arranged them,
 * with the sender's note tucked in front. Reading the note comes first; "See your gifts" slides
 * it away so every gift can be tapped open, and "Read the note" brings it back.
 */

'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrangementScene, savedVariant } from './GiftArrangement'
import GiftModal from './GiftModal'
import LetterCard from './LetterCard'
import Backdrop from '@/components/wrap/Backdrop'
import type { FullGift } from '@/lib/types'

type RevealItem = FullGift['items'][number]

/** Scene width that leaves room for the heading above and the buttons below */
const SCENE_WIDTH = 'min(92vw, 600px, calc((100dvh - 15rem) * 1.25))'
const EASE = [0.22, 1, 0.36, 1] as const

export default function GiftReveal({ gift, giftId }: { gift: FullGift; giftId: string }) {
  const reduce = useReducedMotion()
  const { from_name: from, to_name: to, message } = gift.gift
  const [noteOpen, setNoteOpen] = useState(Boolean(message))
  const [selected, setSelected] = useState<RevealItem | null>(null)
  const [noteView, setNoteView] = useState(false)

  // The sender's note shown in the same dialog as the gifts, as a letter
  const noteItem: RevealItem | null = message
    ? { id: 'note', gift_id: giftId, type: 'letter', position: -1, content: { text: message, styles: [] } }
    : null

  const variant = savedVariant(gift.items, giftId)

  return (
    <div className="flex w-full flex-col items-center">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-4"
      >
        <h1 className="text-3xl text-ink sm:text-4xl">Hi {to}, this is for you</h1>
        <p className="mt-1 font-hand text-2xl leading-none text-ink-soft sm:text-3xl">made with love by {from}</p>
      </motion.header>

      <div className="relative" style={{ width: SCENE_WIDTH, minWidth: 'min(92vw, 300px)' }}>
        {/* Scene + gifts */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative isolate z-0 overflow-hidden rounded-[1.75rem] border-2 border-ink"
          style={{ aspectRatio: '5 / 4' }}
        >
          <Backdrop />
          <div className="absolute inset-[4%]">
            <ArrangementScene
              items={gift.items}
              variant={variant}
              width="100%"
              onItemClick={(id) => setSelected(gift.items.find((i) => i.id === id) ?? null)}
            />
          </div>
        </motion.div>

        {/* The note, tucked in front of the bottom of the scene */}
        <AnimatePresence initial={!reduce}>
          {noteOpen && message && (
            <motion.div
              key="note"
              className="relative z-20 mx-[5%] -mt-[20%]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 80, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: -1.5 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 120, rotate: 6 }}
              transition={{ duration: 0.65, ease: EASE, delay: reduce ? 0 : 0.5 }}
            >
              <button
                type="button"
                onClick={() => setNoteView(true)}
                aria-label="Open the note"
                className="group block w-full cursor-pointer rounded-[1.5rem] text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-ink"
              >
                <LetterCard compact message={message} fromName={from} toName={to} />
              </button>
              <button
                type="button"
                onClick={() => setNoteOpen(false)}
                aria-label="Close the note and see your gifts"
                className="absolute -right-2 -top-3 z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_var(--color-ink)] transition-colors hover:bg-butter focus-visible:outline-ink active:scale-95"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        {noteOpen && message ? (
          <button
            type="button"
            onClick={() => setNoteOpen(false)}
            className="flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-base font-bold text-paper transition-colors hover:bg-ink/85 active:scale-[0.97]"
          >
            See your gifts
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ) : (
          <>
            <p className="font-hand text-3xl leading-none text-ink">Tap a gift to open it</p>
            {message && (
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="h-11 rounded-full border-2 border-ink px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper active:scale-[0.97]"
              >
                Read the note again
              </button>
            )}
          </>
        )}
      </div>

      <GiftModal item={selected} onClose={() => setSelected(null)} fromName={from} toName={to} />
      <GiftModal item={noteView ? noteItem : null} onClose={() => setNoteView(false)} fromName={from} toName={to} title="A note for you" tone="bg-blush text-ink" />
    </div>
  )
}
