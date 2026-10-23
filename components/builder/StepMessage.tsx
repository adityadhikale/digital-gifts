/**
 * Step 3 of the gift builder - Personal message form.
 * The form is the letter itself: the sender fills in the greeting, the message and the signature
 * directly on the card the recipient will read.
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

/** Underlined name field that sits inline on the card */
const nameField =
  'bg-transparent border-0 border-b-2 border-rose/30 focus:border-rose focus:outline-none ' +
  'placeholder:text-text-muted/50 placeholder:italic transition-colors min-w-0'

export default function StepMessage({
  toName,
  fromName,
  message,
  onToNameChange,
  onFromNameChange,
  onMessageChange,
}: StepMessageProps) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-light italic text-text mb-2">
        Write the letter
      </h2>
      <p className="text-sm text-text-muted mb-4 sm:mb-6">
        They read this before they see the gifts. Both names are required. The message is optional.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-rose/25 bg-[#fffaf3] p-5 sm:p-8 shadow-xl"
      >
        {/* Greeting */}
        <label className="flex items-baseline gap-2 font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl text-text mb-4">
          <span>Dear</span>
          <input
            type="text"
            value={toName}
            onChange={(e) => onToNameChange(e.target.value)}
            placeholder="Their name"
            aria-label="Their name"
            className={`${nameField} flex-1 px-1 text-rose`}
          />
          <span>,</span>
        </label>

        {/* Message */}
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Write your message"
          aria-label="Message"
          rows={8}
          className="w-full resize-none bg-transparent font-[family-name:var(--font-playfair)] text-lg sm:text-xl leading-8 text-text placeholder:text-text-muted/50 placeholder:italic focus:outline-none"
        />

        {/* Signature */}
        <div className="mt-4 flex flex-col items-end">
          <p className="font-[family-name:var(--font-dancing)] text-xl text-text-muted">With love,</p>
          <input
            type="text"
            value={fromName}
            onChange={(e) => onFromNameChange(e.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            className={`${nameField} w-48 px-1 text-right font-[family-name:var(--font-dancing)] text-3xl text-rose`}
          />
        </div>
      </motion.div>
    </div>
  )
}
