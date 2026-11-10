/**
 * Step 3 — write the tag. The form is the tag itself: To, message, From, on kraft paper,
 * so what the sender types is what the recipient reads.
 */

'use client'

import { motion } from 'framer-motion'

interface StepMessageProps {
  toName: string
  fromName: string
  message: string
  onToNameChange: (value: string) => void
  onFromNameChange: (value: string) => void
  onMessageChange: (value: string) => void
}

const hand =
  'w-full border-0 border-b-2 border-ink/30 bg-transparent px-1 font-hand text-3xl leading-tight text-ink ' +
  'placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-0 min-w-0'

export default function StepMessage({ toName, fromName, message, onToNameChange, onFromNameChange, onMessageChange }: StepMessageProps) {
  return (
    <section aria-labelledby="tag-h">
      <h1 id="tag-h" className="text-3xl sm:text-4xl">Write the tag</h1>
      <p className="mt-2 text-base text-ink-soft">They read this before they see the gifts. Both names are needed. The message is optional.</p>

      <motion.div
        initial={{ opacity: 0, y: 14, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="tag-hole relative mt-8 rounded-[1.5rem] border-2 border-ink bg-kraft px-5 pb-6 pt-12 sm:px-8"
      >
        <label className="block">
          <span className="text-sm font-semibold uppercase tracking-wider text-ink/70">To</span>
          <input
            type="text"
            value={toName}
            onChange={(e) => onToNameChange(e.target.value)}
            placeholder="Their name"
            autoComplete="off"
            maxLength={60}
            className={hand}
          />
        </label>

        <label className="mt-6 block">
          <span className="text-sm font-semibold uppercase tracking-wider text-ink/70">Message</span>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Write your message"
            rows={7}
            className="mt-1 w-full resize-y rounded-xl border-2 border-ink/20 bg-paper/60 p-3 font-hand text-[1.7rem] leading-[1.15] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-4 focus:ring-butter/70"
          />
        </label>

        <label className="mt-6 block">
          <span className="text-sm font-semibold uppercase tracking-wider text-ink/70">From</span>
          <input
            type="text"
            value={fromName}
            onChange={(e) => onFromNameChange(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            maxLength={60}
            className={hand}
          />
        </label>
      </motion.div>
    </section>
  )
}
