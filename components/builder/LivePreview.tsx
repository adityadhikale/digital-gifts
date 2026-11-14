/**
 * Live preview: the note and the gifts, as the recipient will see them.
 */

'use client'

import { motion } from 'framer-motion'
import { BuilderGiftItem } from '@/lib/types'
import { ArrangementScene } from '@/components/reveal/GiftArrangement'
import Backdrop from '@/components/wrap/Backdrop'
import GiftBox from '@/components/wrap/GiftBox'
import type { WrapChoice } from '@/lib/wrap'

interface LivePreviewProps {
  items: BuilderGiftItem[]
  toName: string
  fromName: string
  message: string
  arrangement: number
  wrap: WrapChoice
  /** Hide the caption (when a surrounding title already says it) */
  hideLabel?: boolean
}

export default function LivePreview({ items, toName, fromName, message, arrangement, wrap, hideLabel }: LivePreviewProps) {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      {!hideLabel && <p className="mb-2 text-sm font-semibold text-ink">What they&apos;ll see</p>}

      <div className="rounded-3xl border-2 border-ink/15 bg-paper-deep p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <GiftBox paper={wrap.paper} ribbon={wrap.ribbon} className="w-14 shrink-0" />
          <p className="text-lg font-extrabold leading-tight">
            {toName ? `Hi ${toName},` : 'Hi,'}
            <span className="block text-sm font-semibold text-ink-soft">{fromName ? `${fromName} made this for you` : 'someone made this for you'}</span>
          </p>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-2xl border-2 border-ink" style={{ aspectRatio: '5 / 4' }}>
          <Backdrop />
          {items.length > 0 ? (
            <div className="absolute inset-[4%]">
              <ArrangementScene items={items} variant={arrangement} width="100%" />
            </div>
          ) : (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm font-semibold text-ink">Your gifts appear here as you pick them.</p>
          )}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mx-auto -mt-6 w-[88%] -rotate-1 rounded-xl border-2 border-ink bg-kraft px-4 py-3 text-ink"
          >
            <p className="font-hand text-2xl leading-none">{toName ? `Dear ${toName},` : 'Dear you,'}</p>
            <p className="mt-1 line-clamp-3 font-hand text-xl leading-[1.1]">{message}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
