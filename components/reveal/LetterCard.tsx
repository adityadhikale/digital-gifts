/**
 * The recipient's letter: a plain card with the greeting, the message and the sender's signature.
 * Long messages scroll inside the card so the page itself never has to.
 */

'use client'

import { motion } from 'framer-motion'

interface LetterCardProps {
  message: string
  fromName: string
  toName: string
}

export default function LetterCard({ message, fromName, toName }: LetterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full max-w-lg mx-auto rounded-2xl border border-rose/25 bg-[#fffaf3] text-left shadow-xl"
    >
      <div className="max-h-[50dvh] overflow-y-auto p-6 sm:p-10">
        <p className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl text-text mb-4">
          Dear <span className="text-rose">{toName}</span>,
        </p>
        <p className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl leading-8 text-text whitespace-pre-wrap">
          {message}
        </p>
        <div className="mt-8 text-right">
          <p className="font-[family-name:var(--font-dancing)] text-xl text-text-muted">With love,</p>
          <p className="font-[family-name:var(--font-dancing)] text-3xl text-rose">{fromName}</p>
        </div>
      </div>
    </motion.div>
  )
}
