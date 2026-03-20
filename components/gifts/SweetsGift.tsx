'use client'

import { motion } from 'framer-motion'

interface SweetsGiftProps {
  content: {
    types?: string[]
    type?: string
    ribbonColor?: string
    message?: string
  }
  reveal?: boolean
}

function SweetsSVG({ type }: { type: string }) {
  if (type === 'cupcakes') {
    return (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        {/* Cupcake 1 */}
        <path d="M40 130 L55 180 L95 180 L110 130 Z" fill="#fce4d6" stroke="#e8c4a6" strokeWidth="1.5" />
        <path d="M45 130 Q75 95 105 130" fill="#f2a7b5" />
        <circle cx="75" cy="110" r="3" fill="#e8dff5" />
        <circle cx="65" cy="115" r="2" fill="#fce4d6" />
        <circle cx="85" cy="112" r="2.5" fill="#d8ead5" />
        <circle cx="75" cy="100" r="4" fill="#dc4a5e" />
        {/* Cupcake 2 */}
        <path d="M100 130 L115 180 L155 180 L170 130 Z" fill="#fce4d6" stroke="#e8c4a6" strokeWidth="1.5" />
        <path d="M105 130 Q135 95 165 130" fill="#e8dff5" />
        <circle cx="135" cy="110" r="3" fill="#f2a7b5" />
        <circle cx="125" cy="115" r="2" fill="#fce4d6" />
        <circle cx="145" cy="112" r="2.5" fill="#f2a7b5" />
        <circle cx="135" cy="100" r="4" fill="#dc4a5e" />
        {/* Lines on wrappers */}
        <path d="M48 140 L55 180" stroke="#e8c4a6" strokeWidth="0.5" opacity="0.5" />
        <path d="M60 135 L60 180" stroke="#e8c4a6" strokeWidth="0.5" opacity="0.5" />
        <path d="M90 135 L90 180" stroke="#e8c4a6" strokeWidth="0.5" opacity="0.5" />
        <path d="M108 140 L115 180" stroke="#e8c4a6" strokeWidth="0.5" opacity="0.5" />
        <path d="M120 135 L120 180" stroke="#e8c4a6" strokeWidth="0.5" opacity="0.5" />
        <path d="M150 135 L150 180" stroke="#e8c4a6" strokeWidth="0.5" opacity="0.5" />
      </svg>
    )
  }

  if (type === 'macarons') {
    return (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        {/* Macaron 1 - pink */}
        <ellipse cx="70" cy="100" rx="28" ry="12" fill="#f2a7b5" />
        <rect x="42" y="100" width="56" height="8" fill="#fde8ed" rx="2" />
        <ellipse cx="70" cy="108" rx="28" ry="12" fill="#f2a7b5" opacity="0.9" />
        {/* Macaron 2 - green */}
        <ellipse cx="130" cy="95" rx="24" ry="10" fill="#a8d5a0" />
        <rect x="106" y="95" width="48" height="7" fill="#d8ead5" rx="2" />
        <ellipse cx="130" cy="102" rx="24" ry="10" fill="#a8d5a0" opacity="0.9" />
        {/* Macaron 3 - purple */}
        <ellipse cx="90" cy="140" rx="26" ry="11" fill="#c4a6e0" />
        <rect x="64" y="140" width="52" height="7" fill="#e8dff5" rx="2" />
        <ellipse cx="90" cy="147" rx="26" ry="11" fill="#c4a6e0" opacity="0.9" />
        {/* Macaron 4 - peach */}
        <ellipse cx="145" cy="135" rx="22" ry="9" fill="#f5c4a1" />
        <rect x="123" y="135" width="44" height="6" fill="#fce4d6" rx="2" />
        <ellipse cx="145" cy="141" rx="22" ry="9" fill="#f5c4a1" opacity="0.9" />
      </svg>
    )
  }

  // Default: chocolate box
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      {/* Box */}
      <rect x="30" y="80" width="140" height="100" rx="6" fill="#8B4513" opacity="0.85" />
      <rect x="30" y="80" width="140" height="100" rx="6" stroke="#6d3410" strokeWidth="1.5" fill="none" />
      {/* Box lid accent */}
      <rect x="30" y="80" width="140" height="20" rx="6" fill="#6d3410" opacity="0.3" />
      {/* Ribbon horizontal */}
      <rect x="30" y="120" width="140" height="12" fill="#f2a7b5" opacity="0.8" />
      {/* Ribbon vertical */}
      <rect x="94" y="80" width="12" height="100" fill="#f2a7b5" opacity="0.8" />
      {/* Bow */}
      <path d="M100 110 Q80 95 90 110 Q80 125 100 110" fill="#f2a7b5" />
      <path d="M100 110 Q120 95 110 110 Q120 125 100 110" fill="#f2a7b5" />
      <circle cx="100" cy="110" r="4" fill="#e8899a" />
      {/* Chocolates peeking */}
      <circle cx="55" cy="95" r="8" fill="#3d1f0a" opacity="0.4" />
      <circle cx="75" cy="95" r="8" fill="#5c3317" opacity="0.4" />
      <circle cx="125" cy="95" r="8" fill="#3d1f0a" opacity="0.4" />
      <circle cx="145" cy="95" r="8" fill="#5c3317" opacity="0.4" />
    </svg>
  )
}

export default function SweetsGift({ content, reveal = false }: SweetsGiftProps) {
  const types: string[] = content.types || (content.type ? [content.type] : ['chocolate box'])
  const { message = '' } = content

  return (
    <motion.div
      initial={reveal ? { opacity: 0, scale: 0.9 } : false}
      animate={reveal ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-peach/60 to-light-blush/40 rounded-2xl p-6 h-full"
    >
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {types.map((t, i) => (
          <div key={i} className="w-40 aspect-square">
            <SweetsSVG type={t} />
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="font-[family-name:var(--font-playfair)] text-text-primary font-semibold mb-1 capitalize">
          {types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}
        </p>
        {message && (
          <p className="font-[family-name:var(--font-dancing)] text-text-muted text-lg mt-2">
            &ldquo;{message}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  )
}
