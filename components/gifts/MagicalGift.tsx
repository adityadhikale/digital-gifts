'use client'

import { motion } from 'framer-motion'

interface MagicalGiftProps {
  content: {
    types?: string[]
    type?: string
    colorTheme?: string
    message?: string
  }
  reveal?: boolean
}

function MagicalSVG({ type }: { type: string }) {
  if (type === 'floating balloons') {
    return (
      <svg viewBox="0 0 200 220" fill="none" className="w-full h-full">
        <ellipse cx="70" cy="60" rx="30" ry="38" fill="#f2a7b5" opacity="0.7" />
        <ellipse cx="65" cy="50" rx="8" ry="14" fill="white" opacity="0.2" />
        <path d="M70 98 L70 100 L68 100" fill="#e8899a" />
        <path d="M70 100 Q65 140 80 180" stroke="#8a6a72" strokeWidth="1" fill="none" />
        <ellipse cx="120" cy="50" rx="28" ry="35" fill="#e8dff5" opacity="0.7" />
        <ellipse cx="115" cy="42" rx="7" ry="12" fill="white" opacity="0.2" />
        <path d="M120 85 L120 87 L118 87" fill="#c4b5e0" />
        <path d="M120 87 Q115 130 100 180" stroke="#8a6a72" strokeWidth="1" fill="none" />
        <ellipse cx="95" cy="80" rx="25" ry="32" fill="#d8ead5" opacity="0.7" />
        <ellipse cx="90" cy="72" rx="7" ry="12" fill="white" opacity="0.2" />
        <path d="M95 112 L95 114 L93 114" fill="#a8c8a0" />
        <path d="M95 114 Q90 150 90 180" stroke="#8a6a72" strokeWidth="1" fill="none" />
        {/* Bow at bottom */}
        <circle cx="90" cy="180" r="3" fill="#f2a7b5" />
      </svg>
    )
  }

  if (type === 'wishing lantern') {
    return (
      <svg viewBox="0 0 200 220" fill="none" className="w-full h-full">
        {/* Lantern body */}
        <path d="M70 60 Q100 40 130 60 L125 160 Q100 175 75 160 Z" fill="#fce4d6" opacity="0.8" stroke="#e8c4a6" strokeWidth="1" />
        {/* Inner glow */}
        <ellipse cx="100" cy="110" rx="20" ry="40" fill="#f5c542" opacity="0.3" />
        <ellipse cx="100" cy="110" rx="12" ry="25" fill="#f5c542" opacity="0.4" />
        {/* Flame */}
        <path d="M100 90 Q94 100 100 115 Q106 100 100 90" fill="#f5c542" opacity="0.8" />
        <path d="M100 95 Q97 102 100 110 Q103 102 100 95" fill="#ff8c42" opacity="0.6" />
        {/* Top decoration */}
        <rect x="92" y="50" width="16" height="12" rx="2" fill="#e8c4a6" />
        <path d="M100 38 L100 50" stroke="#e8c4a6" strokeWidth="2" />
        <circle cx="100" cy="36" r="4" fill="#f2a7b5" opacity="0.6" />
        {/* Sparkles around */}
        <circle cx="55" cy="80" r="2" fill="#f5c542" opacity="0.4" />
        <circle cx="145" cy="75" r="1.5" fill="#f5c542" opacity="0.3" />
        <circle cx="50" cy="130" r="1.5" fill="#f5c542" opacity="0.3" />
        <circle cx="150" cy="120" r="2" fill="#f5c542" opacity="0.4" />
        <circle cx="60" cy="150" r="1" fill="#f5c542" opacity="0.3" />
        <circle cx="140" cy="155" r="1.5" fill="#f5c542" opacity="0.3" />
      </svg>
    )
  }

  if (type === 'jar of stars') {
    return (
      <svg viewBox="0 0 200 220" fill="none" className="w-full h-full">
        {/* Jar */}
        <path d="M65 50 L65 180 Q65 195 100 195 Q135 195 135 180 L135 50" fill="none" stroke="#c4b5e0" strokeWidth="2" />
        <rect x="65" y="50" width="70" height="145" rx="0" fill="#e8dff5" opacity="0.15" />
        {/* Jar bottom curve */}
        <path d="M65 180 Q65 195 100 195 Q135 195 135 180" stroke="#c4b5e0" strokeWidth="2" fill="#e8dff5" opacity="0.1" />
        {/* Lid */}
        <rect x="60" y="40" width="80" height="14" rx="4" fill="#c4b5e0" opacity="0.6" />
        <rect x="85" y="32" width="30" height="12" rx="4" fill="#c4b5e0" opacity="0.4" />
        {/* Stars inside */}
        {[
          { x: 85, y: 80, s: 8 },
          { x: 115, y: 90, s: 6 },
          { x: 95, y: 120, s: 10 },
          { x: 110, y: 150, s: 7 },
          { x: 80, y: 155, s: 5 },
          { x: 100, y: 100, s: 6 },
          { x: 120, y: 130, s: 5 },
          { x: 82, y: 130, s: 7 },
        ].map((star, i) => (
          <path
            key={i}
            d={`M${star.x} ${star.y - star.s} L${star.x + star.s * 0.3} ${star.y - star.s * 0.3} L${star.x + star.s} ${star.y} L${star.x + star.s * 0.3} ${star.y + star.s * 0.3} L${star.x} ${star.y + star.s} L${star.x - star.s * 0.3} ${star.y + star.s * 0.3} L${star.x - star.s} ${star.y} L${star.x - star.s * 0.3} ${star.y - star.s * 0.3} Z`}
            fill="#f5c542"
            opacity={0.4 + Math.random() * 0.4}
          />
        ))}
      </svg>
    )
  }

  // Default: snow globe
  return (
    <svg viewBox="0 0 200 220" fill="none" className="w-full h-full">
      {/* Base */}
      <rect x="55" y="170" width="90" height="25" rx="5" fill="#c4b5e0" opacity="0.6" />
      <rect x="50" y="165" width="100" height="12" rx="4" fill="#dbc8f0" opacity="0.8" />
      {/* Globe */}
      <circle cx="100" cy="105" r="62" fill="#e8dff5" opacity="0.2" stroke="#c4b5e0" strokeWidth="2" />
      {/* Scene inside - small tree/house */}
      <path d="M90 160 L100 130 L110 160 Z" fill="#8ab87a" opacity="0.6" />
      <rect x="96" y="145" width="8" height="15" fill="#d4a574" opacity="0.6" />
      {/* Snowflakes */}
      {[
        { x: 80, y: 70 }, { x: 120, y: 80 }, { x: 95, y: 55 },
        { x: 110, y: 100 }, { x: 75, y: 95 }, { x: 130, y: 65 },
        { x: 85, y: 115 }, { x: 115, y: 120 },
      ].map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={1.5 + Math.random()} fill="white" opacity={0.5 + Math.random() * 0.3} />
      ))}
    </svg>
  )
}

export default function MagicalGift({ content, reveal = false }: MagicalGiftProps) {
  const types: string[] = content.types || (content.type ? [content.type] : ['snow globe'])
  const { message = '' } = content

  return (
    <motion.div
      initial={reveal ? { opacity: 0, scale: 0.9 } : false}
      animate={reveal ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-lavender/60 to-light-blush/30 rounded-2xl p-6 h-full relative overflow-hidden"
    >
      {/* Sparkle effect */}
      {reveal && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
        </>
      )}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {types.map((t, i) => (
          <div key={i} className="w-40 aspect-square relative z-10">
            <MagicalSVG type={t} />
          </div>
        ))}
      </div>
      <div className="text-center relative z-10">
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
