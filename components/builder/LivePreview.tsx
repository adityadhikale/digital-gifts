/**
 * Live preview: the tag and the gifts as the recipient will see them, on a plain card.
 */

'use client'

import { motion } from 'framer-motion'
import { BuilderGiftItem } from '@/lib/types'
import { ArrangementScene, ARRANGEMENT_VARIANTS } from '@/components/reveal/GiftArrangement'

interface LivePreviewProps {
  items: BuilderGiftItem[]
  toName: string
  fromName: string
  message: string
  arrangement: number
  onArrangementChange: (variant: number) => void
  /** Hide the caption (when a surrounding title already says it) */
  hideLabel?: boolean
}

export default function LivePreview({ items, toName, fromName, message, arrangement, onArrangementChange, hideLabel }: LivePreviewProps) {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      {!hideLabel && <p className="mb-2 text-sm font-semibold text-ink">What they&apos;ll see</p>}

      <div className="rounded-3xl border-2 border-ink/15 bg-paper-deep p-4 sm:p-5">
        {(toName || fromName) && (
          <p className="text-center text-lg font-extrabold leading-tight">
            {fromName ? `From ${fromName}` : 'A gift'}
            {toName && <span className="block text-sm font-semibold text-ink-soft">for {toName}</span>}
          </p>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-3 rounded-xl bg-kraft px-4 py-3 text-ink"
          >
            <p className="font-hand text-2xl leading-none">{toName ? `Dear ${toName},` : 'Dear you,'}</p>
            <p className="mt-1 line-clamp-3 font-hand text-xl leading-[1.1]">{message}</p>
          </motion.div>
        )}

        <div className="mt-3">
          {items.length > 0 ? (
            <>
              <ArrangementScene items={items} variant={arrangement} width="100%" />
              {items.length > 1 && (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => onArrangementChange((arrangement + 1) % ARRANGEMENT_VARIANTS)}
                    className="h-9 rounded-full border-2 border-ink px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper active:scale-[0.97]"
                  >
                    Shuffle
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="py-10 text-center text-sm text-ink-soft">Your gifts appear here as you pick them.</p>
          )}
        </div>
      </div>
    </div>
  )
}
