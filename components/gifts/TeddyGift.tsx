'use client'

import { motion } from 'framer-motion'

interface TeddyGiftProps {
  content: {
    color?: string
    holdings?: string[]
    holding?: string
    message?: string
  }
  reveal?: boolean
}

const teddyColors: Record<string, { body: string; accent: string }> = {
  brown: { body: '#d4a574', accent: '#deb887' },
  white: { body: '#f0e6dc', accent: '#faf5f0' },
  pink: { body: '#f2b5c0', accent: '#fde8ed' },
  grey: { body: '#b0a8a0', accent: '#ccc5be' },
}

function HoldingItem({ item }: { item: string }) {
  if (item === 'heart') {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path
          d="M20 35l-1.8-1.6C10 26 5 21.5 5 16c0-4.4 3.4-8 7.5-8 2.3 0 4.5 1.1 5.9 2.8L20 12.9l1.6-2.1C23 9.1 25.2 8 27.5 8 31.6 8 35 11.6 35 16c0 5.5-5 10-13.2 17.4L20 35z"
          fill="#dc4a5e"
        />
      </svg>
    )
  }
  if (item === 'flower') {
    return (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <circle cx="20" cy="14" r="5" fill="#f2a7b5" opacity="0.8" />
        <circle cx="15" cy="18" r="4.5" fill="#e8899a" opacity="0.7" />
        <circle cx="25" cy="18" r="4.5" fill="#e8899a" opacity="0.7" />
        <circle cx="20" cy="16" r="3" fill="#fce4d6" />
        <path d="M20 22 L20 36" stroke="#6d9b5a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (item === 'balloon') {
    return (
      <svg viewBox="0 0 40 50" fill="none" className="w-full h-full">
        <ellipse cx="20" cy="14" rx="12" ry="14" fill="#f2a7b5" opacity="0.8" />
        <ellipse cx="17" cy="10" rx="3" ry="5" fill="white" opacity="0.3" />
        <path d="M20 28 L18 30 L22 30 Z" fill="#e8899a" />
        <path d="M20 30 Q16 38 20 48" stroke="#8a6a72" strokeWidth="1" fill="none" />
      </svg>
    )
  }
  // gift box
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect x="6" y="16" width="28" height="20" rx="3" fill="#e8dff5" stroke="#c4b5e0" strokeWidth="1" />
      <rect x="6" y="16" width="28" height="6" rx="2" fill="#c4b5e0" opacity="0.5" />
      <rect x="18" y="16" width="4" height="20" fill="#f2a7b5" opacity="0.7" />
      <path d="M20 14 Q14 8 16 14" stroke="#f2a7b5" strokeWidth="1.5" fill="none" />
      <path d="M20 14 Q26 8 24 14" stroke="#f2a7b5" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function TeddyGift({ content, reveal = false }: TeddyGiftProps) {
  const { color = 'brown', message = '' } = content
  const holdings: string[] = content.holdings || (content.holding ? [content.holding] : ['heart'])
  const colors = teddyColors[color] || teddyColors.brown

  return (
    <motion.div
      initial={reveal ? { opacity: 0, scale: 0.9 } : false}
      animate={reveal ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-peach/40 to-cream rounded-2xl p-6 h-full"
    >
      <div className="w-full max-w-[180px] mx-auto mb-4 aspect-square relative">
        <svg viewBox="0 0 200 220" fill="none" className="w-full h-full">
          {/* Ears */}
          <circle cx="65" cy="42" r="22" fill={colors.body} opacity="0.9" />
          <circle cx="65" cy="42" r="13" fill={colors.accent} opacity="0.6" />
          <circle cx="135" cy="42" r="22" fill={colors.body} opacity="0.9" />
          <circle cx="135" cy="42" r="13" fill={colors.accent} opacity="0.6" />
          {/* Head */}
          <circle cx="100" cy="70" r="42" fill={colors.body} />
          <circle cx="100" cy="75" r="30" fill={colors.accent} opacity="0.5" />
          {/* Eyes */}
          <circle cx="85" cy="62" r="5" fill="#3a2a2e" />
          <circle cx="83" cy="60" r="1.5" fill="white" opacity="0.7" />
          <circle cx="115" cy="62" r="5" fill="#3a2a2e" />
          <circle cx="113" cy="60" r="1.5" fill="white" opacity="0.7" />
          {/* Nose */}
          <ellipse cx="100" cy="78" rx="8" ry="5" fill={colors.body} stroke="#a08060" strokeWidth="1" />
          <ellipse cx="100" cy="76" rx="4" ry="3" fill="#3a2a2e" />
          {/* Mouth */}
          <path d="M94 82 Q100 88 106 82" stroke="#3a2a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="100" cy="155" rx="50" ry="55" fill={colors.body} />
          <ellipse cx="100" cy="150" rx="35" ry="35" fill={colors.accent} opacity="0.4" />
          {/* Arms */}
          <ellipse cx="52" cy="140" rx="16" ry="30" fill={colors.body} transform="rotate(-15 52 140)" />
          <ellipse cx="148" cy="140" rx="16" ry="30" fill={colors.body} transform="rotate(15 148 140)" />
          {/* Feet */}
          <ellipse cx="75" cy="200" rx="22" ry="12" fill={colors.body} />
          <ellipse cx="75" cy="198" rx="14" ry="7" fill={colors.accent} opacity="0.5" />
          <ellipse cx="125" cy="200" rx="22" ry="12" fill={colors.body} />
          <ellipse cx="125" cy="198" rx="14" ry="7" fill={colors.accent} opacity="0.5" />
        </svg>
        {/* Holding items */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-10%] flex gap-4">
          {holdings.map((item, i) => (
            <div key={i} className="w-12 h-12">
              <HoldingItem item={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="font-[family-name:var(--font-playfair)] text-text-primary font-semibold mb-1 capitalize">
          {color} Teddy Bear {holdings.length > 1 ? '(with ' + holdings.map(h => h.charAt(0).toUpperCase() + h.slice(1)).join(' + ') + ')' : ''}
        </p>
        {message && (
          <div className="mt-2 bg-white/50 rounded-lg px-3 py-2 inline-block">
            <p className="font-[family-name:var(--font-dancing)] text-text-muted text-base">
              {message}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
