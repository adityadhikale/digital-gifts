'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingLetterProps {
  message: string
  fromName: string
  toName: string
}

export default function FloatingLetter({ message, fromName, toName }: FloatingLetterProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -12, 0],
            rotateX: 0,
          }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 0.8, ease: 'easeOut' },
            rotateX: { duration: 1 },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          /* Reduced bottom margin on mobile, full on sm+ */
          className="relative max-w-xl mx-auto mb-8 sm:mb-16"
          style={{ perspective: '1000px' }}
        >
          {/* Card with realistic paper feel */}
          <div className="relative bg-[#fdf6ef] rounded-xl overflow-hidden"
            style={{
              boxShadow: `
                0 4px 6px -1px rgba(0, 0, 0, 0.05),
                0 10px 15px -3px rgba(0, 0, 0, 0.08),
                0 25px 50px -12px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.5)
              `,
            }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Decorative top border */}
            <div className="h-2 bg-gradient-to-r from-rose/20 via-rose/40 to-rose/20" />

            {/* Content area: tighter padding on mobile */}
            <div className="relative p-5 sm:p-8 md:p-10">
              {/* Paper lines */}
              <div className="absolute inset-x-5 sm:inset-x-8 top-20 bottom-8 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-px bg-rose/8 w-full"
                    style={{ marginTop: i === 0 ? 0 : 32 }}
                  />
                ))}
              </div>

              {/* Wax seal */}
              <motion.div
                className="absolute -top-1 left-1/2 -translate-x-1/2"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 60 60" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-xl">
                  {/* Seal drips */}
                  <ellipse cx="20" cy="45" rx="6" ry="8" fill="#c4637a" />
                  <ellipse cx="40" cy="42" rx="5" ry="6" fill="#c4637a" />
                  <ellipse cx="30" cy="48" rx="4" ry="5" fill="#c4637a" />
                  {/* Main seal */}
                  <circle cx="30" cy="30" r="26" fill="url(#waxOuter)" />
                  <circle cx="30" cy="30" r="22" fill="url(#waxInner)" />
                  <circle cx="30" cy="30" r="18" fill="url(#waxCenter)" />
                  {/* Heart emboss */}
                  <path
                    d="M30 20 Q22 14 22 22 Q22 30 30 38 Q38 30 38 22 Q38 14 30 20"
                    fill="#fde8ed"
                    opacity="0.85"
                  />
                  {/* Highlight */}
                  <ellipse cx="24" cy="24" rx="4" ry="3" fill="white" opacity="0.2" />
                  <defs>
                    <linearGradient id="waxOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#dc4a5e" />
                      <stop offset="100%" stopColor="#a03d4d" />
                    </linearGradient>
                    <linearGradient id="waxInner" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c4637a" />
                      <stop offset="100%" stopColor="#9e3a4a" />
                    </linearGradient>
                    <radialGradient id="waxCenter" cx="40%" cy="40%">
                      <stop offset="0%" stopColor="#dc4a5e" />
                      <stop offset="100%" stopColor="#a03d4d" />
                    </radialGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Close/minimize button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose/10 hover:bg-rose/20 flex items-center justify-center transition-colors group cursor-pointer"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#c4637a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Letter content */}
              <div className="relative z-10 pt-8">
                {/* To line */}
                <p className="font-[family-name:var(--font-dancing)] text-xl text-text mb-4 sm:mb-6">
                  Dear <span className="text-rose">{toName}</span>,
                </p>

                {/* Message: slightly smaller on mobile */}
                <p className="font-[family-name:var(--font-dancing)] text-xl sm:text-2xl md:text-3xl text-text leading-relaxed mb-6 sm:mb-8">
                  {message}
                </p>

                {/* Signature */}
                <div className="text-right">
                  <p className="font-[family-name:var(--font-dancing)] text-xl text-text-muted">
                    With love,
                  </p>
                  <p className="font-[family-name:var(--font-dancing)] text-2xl text-rose mt-1">
                    {fromName}
                  </p>
                </div>
              </div>

              {/* Decorative corner flourishes — hidden on very small screens */}
              <svg className="hidden sm:block absolute bottom-4 left-4 w-10 h-10 opacity-15" viewBox="0 0 40 40" fill="none">
                <path d="M5 35 Q5 15 25 15 Q35 15 35 5" stroke="#c4637a" strokeWidth="2" />
                <circle cx="35" cy="5" r="2.5" fill="#c4637a" />
                <circle cx="5" cy="35" r="2.5" fill="#c4637a" />
              </svg>
              <svg className="hidden sm:block absolute bottom-4 right-4 w-10 h-10 opacity-15" viewBox="0 0 40 40" fill="none">
                <path d="M35 35 Q35 15 15 15 Q5 15 5 5" stroke="#c4637a" strokeWidth="2" />
                <circle cx="5" cy="5" r="2.5" fill="#c4637a" />
                <circle cx="35" cy="35" r="2.5" fill="#c4637a" />
              </svg>
            </div>

            {/* Bottom decorative border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-rose/20 to-transparent" />
          </div>

          {/* Realistic layered shadows */}
          <div className="absolute -bottom-4 left-8 right-8 h-8 bg-black/10 rounded-[50%] blur-xl" />
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/8 rounded-[50%] blur-lg" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-10"
        >
          <motion.button
            onClick={() => setIsMinimized(false)}
            className="inline-flex items-center gap-3 px-5 sm:px-7 py-3 sm:py-3.5 bg-white rounded-full shadow-xl border border-rose/10 text-text-muted hover:text-rose transition-all group"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Envelope icon */}
            <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
              <rect x="2" y="6" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M2 9L14 17L26 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
              {/* Mini wax seal */}
              <circle cx="14" cy="4" r="3.5" fill="#e8859a" />
              <path d="M14 2.5 Q12 1.5 12 3 Q12 4.5 14 5.5 Q16 4.5 16 3 Q16 1.5 14 2.5" fill="#fde8ed" opacity="0.8" />
            </svg>
            <span className="font-[family-name:var(--font-dm-sans)] font-medium text-sm sm:text-base">Read the letter</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-rose"
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}