/**
 * The recipient's tag: kraft paper with a punched hole, the greeting, the message and the
 * sender's name. Long messages scroll inside the card so the page itself never has to.
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
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: -1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="tag-hole relative mx-auto w-full max-w-lg rounded-[1.5rem] border-2 border-ink bg-kraft text-left text-ink"
    >
      <div className="max-h-[46dvh] overflow-y-auto px-6 pb-7 pt-12 sm:px-9 scroll-y-soft">
        <p className="font-hand text-4xl leading-none">Dear {toName},</p>
        <p className="mt-4 whitespace-pre-wrap font-hand text-[1.75rem] leading-[1.15] sm:text-3xl">{message}</p>
        <p className="mt-7 text-right font-hand text-3xl leading-none">
          With love,
          <span className="mt-1 block text-5xl">{fromName}</span>
        </p>
      </div>
    </motion.div>
  )
}
