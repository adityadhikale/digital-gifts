/**
 * Step 3 of the gift builder - Personal message form.
 * Allows users to enter sender/recipient names and a personal message.
 */

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface StepMessageProps {
  toName: string
  fromName: string
  message: string
  onToNameChange: (value: string) => void
  onFromNameChange: (value: string) => void
  onMessageChange: (value: string) => void
}

/** Number of paper lines to render in preview */
const PAPER_LINE_COUNT = 10

/**
 * Personal message form component.
 * Includes live preview of the letter as it's being written.
 */
export default function StepMessage({
  toName,
  fromName,
  message,
  onToNameChange,
  onFromNameChange,
  onMessageChange,
}: StepMessageProps) {
  // Memoize paper lines to avoid recreating array on each render
  const paperLines = useMemo(
    () => [...Array(PAPER_LINE_COUNT)].map((_, i) => i),
    []
  )

  return (
    <div>
      {/* Slightly smaller heading on mobile */}
      <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-light italic text-text mb-2">
        Add a personal message
      </h2>
      <p className="font-[family-name:var(--font-dancing)] text-lg text-text-muted mb-4 sm:mb-8">
        This will appear as a floating letter card
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-4 sm:p-6 shadow-layered space-y-5 sm:space-y-6"
      >
        {/* Name inputs: stacked on mobile, side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* To field */}
          <div>
            <label className="block text-sm font-medium text-rose tracking-wide uppercase mb-2 sm:mb-3">
              To
            </label>
            <input
              type="text"
              value={toName}
              onChange={(e) => onToNameChange(e.target.value)}
              placeholder="Their name..."
              className="
                w-full px-4 sm:px-5 py-3 sm:py-4 bg-cream border-2 border-blush/30 rounded-2xl
                text-text placeholder:text-text-muted/50 placeholder:italic
                focus:outline-none focus:border-rose focus:shadow-lg focus:shadow-rose/10
                transition-all
              "
            />
          </div>

          {/* From field */}
          <div>
            <label className="block text-sm font-medium text-rose tracking-wide uppercase mb-2 sm:mb-3">
              From
            </label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => onFromNameChange(e.target.value)}
              placeholder="Your name..."
              className="
                w-full px-4 sm:px-5 py-3 sm:py-4 bg-cream border-2 border-blush/30 rounded-2xl
                text-text placeholder:text-text-muted/50 placeholder:italic
                focus:outline-none focus:border-rose focus:shadow-lg focus:shadow-rose/10
                transition-all
              "
            />
          </div>
        </div>

        {/* Message textarea */}
        <div>
          <label className="block text-sm font-medium text-rose tracking-wide uppercase mb-2 sm:mb-3">
            Personal Message
          </label>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Write something from the heart..."
            rows={6}
            className="
              w-full px-4 sm:px-5 py-3 sm:py-4 bg-parchment border-2 border-peach-mid/30 rounded-2xl
              text-text placeholder:text-text-muted/50 placeholder:italic
              focus:outline-none focus:border-rose focus:shadow-lg focus:shadow-rose/10
              transition-all font-[family-name:var(--font-dancing)] text-xl
              resize-none paper-texture
            "
          />
        </div>

        {/* Live letter preview - shown when message has content */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative"
          >
            <div className="bg-parchment rounded-2xl p-5 sm:p-8 shadow-layered-lg border border-peach-mid/20 relative overflow-hidden">
              {/* Paper texture lines */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-50">
                {paperLines.map((i) => (
                  <div
                    key={i}
                    className="h-px bg-rose/10 w-full"
                    style={{ marginTop: i === 0 ? 48 : 28 }}
                  />
                ))}
              </div>

              {/* Decorative wax seal */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <circle cx="20" cy="20" r="18" fill="#e8859a" />
                  <circle cx="20" cy="20" r="14" fill="#c4637a" />
                  <path d="M20 12 Q14 8 14 12 Q14 18 20 24 Q26 18 26 12 Q26 8 20 12" fill="#fde8ed" />
                </svg>
              </div>

              <p className="text-xs text-rose uppercase tracking-widest mb-4 mt-4">Preview</p>

              {/* Greeting */}
              {toName && (
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-muted mb-4">
                  Dear <span className="text-text font-medium">{toName}</span>,
                </p>
              )}

              {/* Message body */}
              <p className="font-[family-name:var(--font-dancing)] text-xl sm:text-2xl text-text leading-relaxed relative z-10">
                {message}
              </p>

              {/* Signature */}
              {fromName && (
                <p className="font-[family-name:var(--font-dancing)] text-lg sm:text-xl text-rose mt-6 text-right">
                  With love, {fromName}
                </p>
              )}
            </div>

            {/* Drop shadow effect */}
            <div className="absolute -bottom-2 left-6 right-6 h-4 bg-black/5 rounded-full blur-md" />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}