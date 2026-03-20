'use client'

import { motion } from 'framer-motion'

interface FlowerGiftProps {
  content: {
    styles?: string[]
    style?: string
    color?: string
    note?: string
  }
  reveal?: boolean
}

const bouquetColors: Record<string, { primary: string; secondary: string; bg: string }> = {
  pink: { primary: '#f2a7b5', secondary: '#fde8ed', bg: 'from-pink-50 to-rose-50' },
  red: { primary: '#dc4a5e', secondary: '#fde8ed', bg: 'from-red-50 to-rose-50' },
  white: { primary: '#f0e6e0', secondary: '#faf5f2', bg: 'from-stone-50 to-amber-50' },
  mixed: { primary: '#f2a7b5', secondary: '#e8dff5', bg: 'from-pink-50 to-purple-50' },
  purple: { primary: '#c4a6e0', secondary: '#e8dff5', bg: 'from-purple-50 to-indigo-50' },
}

function BouquetSVG({ style, color }: { style: string; color: string }) {
  const colors = bouquetColors[color] || bouquetColors.pink

  if (style === 'sunflower') {
    return (
      <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
        {/* Stems */}
        <path d="M100 140 L100 220" stroke="#6d9b5a" strokeWidth="3" strokeLinecap="round" />
        <path d="M80 160 L80 220" stroke="#6d9b5a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M120 155 L120 220" stroke="#6d9b5a" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M100 180 Q85 170 75 178" stroke="#6d9b5a" strokeWidth="2" fill="#8ab87a" opacity="0.6" />
        <path d="M100 190 Q115 185 125 192" stroke="#6d9b5a" strokeWidth="2" fill="#8ab87a" opacity="0.6" />
        {/* Sunflower 1 - center */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <ellipse key={`p1-${angle}`} cx={100 + Math.cos(angle * Math.PI/180) * 22} cy={100 + Math.sin(angle * Math.PI/180) * 22} rx="10" ry="6" fill="#f5c542" transform={`rotate(${angle} ${100 + Math.cos(angle * Math.PI/180) * 22} ${100 + Math.sin(angle * Math.PI/180) * 22})`} opacity="0.9" />
        ))}
        <circle cx="100" cy="100" r="14" fill="#8B6914" />
        <circle cx="100" cy="100" r="10" fill="#6B4F12" />
        {/* Sunflower 2 - left */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse key={`p2-${angle}`} cx={75 + Math.cos(angle * Math.PI/180) * 16} cy={120 + Math.sin(angle * Math.PI/180) * 16} rx="8" ry="4.5" fill="#f5c542" transform={`rotate(${angle} ${75 + Math.cos(angle * Math.PI/180) * 16} ${120 + Math.sin(angle * Math.PI/180) * 16})`} opacity="0.85" />
        ))}
        <circle cx="75" cy="120" r="10" fill="#8B6914" />
        {/* Sunflower 3 - right */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse key={`p3-${angle}`} cx={125 + Math.cos(angle * Math.PI/180) * 16} cy={115 + Math.sin(angle * Math.PI/180) * 16} rx="8" ry="4.5" fill="#f5c542" transform={`rotate(${angle} ${125 + Math.cos(angle * Math.PI/180) * 16} ${115 + Math.sin(angle * Math.PI/180) * 16})`} opacity="0.85" />
        ))}
        <circle cx="125" cy="115" r="10" fill="#8B6914" />
        {/* Wrapping paper */}
        <path d="M60 200 Q100 185 140 200 L135 230 Q100 220 65 230 Z" fill="#fce4d6" stroke="#e8c4a6" strokeWidth="1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
      {/* Stems */}
      <path d="M100 130 L100 220" stroke="#6d9b5a" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 140 L80 220" stroke="#6d9b5a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M115 138 L120 220" stroke="#6d9b5a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M90 170 Q75 160 68 168" stroke="#6d9b5a" strokeWidth="2" fill="#8ab87a" opacity="0.5" />
      <path d="M110 175 Q125 168 130 176" stroke="#6d9b5a" strokeWidth="2" fill="#8ab87a" opacity="0.5" />
      {/* Bouquet top flowers */}
      <circle cx="100" cy="80" r="18" fill={colors.primary} opacity="0.7" />
      <circle cx="78" cy="95" r="16" fill={colors.primary} opacity="0.6" />
      <circle cx="122" cy="95" r="16" fill={colors.primary} opacity="0.6" />
      <circle cx="88" cy="110" r="15" fill={colors.primary} opacity="0.5" />
      <circle cx="112" cy="108" r="15" fill={colors.primary} opacity="0.5" />
      <circle cx="100" cy="100" r="12" fill={colors.secondary} opacity="0.8" />
      {/* Inner details */}
      <circle cx="90" cy="85" r="4" fill={colors.secondary} opacity="0.6" />
      <circle cx="110" cy="88" r="3.5" fill={colors.secondary} opacity="0.6" />
      <circle cx="82" cy="100" r="3" fill={colors.secondary} opacity="0.5" />
      <circle cx="118" cy="100" r="3" fill={colors.secondary} opacity="0.5" />
      {/* Wrapping paper */}
      <path d="M60 195 Q100 180 140 195 L135 230 Q100 218 65 230 Z" fill={colors.secondary} stroke={colors.primary} strokeWidth="1" opacity="0.8" />
      <path d="M85 195 Q100 190 115 195" stroke={colors.primary} strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  )
}

export default function FlowerGift({ content, reveal = false }: FlowerGiftProps) {
  const styles: string[] = content.styles || (content.style ? [content.style] : ['rose'])
  const { color = 'pink', note = '' } = content
  const colors = bouquetColors[color] || bouquetColors.pink

  return (
    <motion.div
      initial={reveal ? { opacity: 0, scale: 0.9 } : false}
      animate={reveal ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 h-full`}
    >
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {styles.map((s, i) => (
          <div key={i} className="w-40 aspect-[5/6]">
            <BouquetSVG style={s} color={color} />
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="font-[family-name:var(--font-playfair)] text-text-primary font-semibold mb-1 capitalize">
          {styles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' + ')} Bouquet
        </p>
        {note && (
          <p className="font-[family-name:var(--font-dancing)] text-text-muted text-lg mt-2">
            &ldquo;{note}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  )
}
