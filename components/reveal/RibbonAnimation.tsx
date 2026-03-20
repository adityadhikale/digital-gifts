'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RibbonAnimationProps {
  onComplete: () => void
}

export default function RibbonAnimation({ onComplete }: RibbonAnimationProps) {
  const [phase, setPhase] = useState<'ribbon' | 'done'>('ribbon')

  const petals = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      x: `${5 + (i * 8.1 + 3) % 90}vw`,
      duration: 4 + (i % 5) * 0.5,
    })),
    []
  )

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-hero-gradient"
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Floating petals during reveal */}
          {petals.map((petal, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: petal.x, opacity: 0 }}
              animate={{
                y: '110vh',
                opacity: [0, 0.5, 0.5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: petal.duration,
                delay: 0.8 + i * 0.15,
                ease: 'linear',
              }}
              className="absolute z-10"
            >
              <svg viewBox="0 0 24 32" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                <path
                  d="M12 0C6 0 0 8 0 16c0 10 6 16 12 16s12-6 12-16C24 8 18 0 12 0z"
                  fill="url(#fallingPetalGrad)"
                />
                <defs>
                  <linearGradient id="fallingPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f9c8d4" />
                    <stop offset="100%" stopColor="#e8859a" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          ))}

          <div className="relative z-20 px-4">
            {/* Gift box animation: already has sm: sizing */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative flex justify-center"
            >
              <svg
                viewBox="0 0 300 320"
                fill="none"
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
              >
                {/* Gift box body with gradient */}
                <defs>
                  <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde8ed" />
                    <stop offset="100%" stopColor="#f9c8d4" />
                  </linearGradient>
                  <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f9c8d4" />
                    <stop offset="100%" stopColor="#fde8ed" />
                  </linearGradient>
                  <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e8859a" />
                    <stop offset="100%" stopColor="#c4637a" />
                  </linearGradient>
                  <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c4637a" />
                    <stop offset="100%" stopColor="#e8859a" />
                  </linearGradient>
                </defs>

                {/* Box body */}
                <motion.rect
                  x="50" y="150" width="200" height="140" rx="12"
                  fill="url(#boxGradient)"
                  stroke="#e8859a"
                  strokeWidth="3"
                />

                {/* Box inner shadow effect */}
                <motion.rect
                  x="60" y="160" width="180" height="120" rx="8"
                  fill="none"
                  stroke="#c4637a"
                  strokeWidth="1"
                  opacity="0.2"
                />

                {/* Lid */}
                <motion.g
                  initial={{ y: 0 }}
                  animate={{ y: [0, -30, -100], opacity: [1, 1, 0] }}
                  transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
                >
                  <rect
                    x="35" y="125" width="230" height="35" rx="10"
                    fill="url(#lidGradient)"
                    stroke="#e8859a"
                    strokeWidth="3"
                  />
                  <rect
                    x="45" y="135" width="210" height="15" rx="6"
                    fill="none"
                    stroke="#c4637a"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                </motion.g>

                {/* Vertical ribbon */}
                <motion.rect
                  x="138" y="125" width="24" height="165"
                  fill="url(#ribbonGradient)"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0] }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />

                {/* Horizontal ribbon */}
                <motion.rect
                  x="50" y="208" width="200" height="24"
                  fill="url(#ribbonGradient)"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0] }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />

                {/* Bow - left loop */}
                <motion.path
                  d="M150 125 Q100 70 110 105 Q95 135 150 125"
                  fill="url(#bowGradient)"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{
                    scale: [1, 1.15, 0],
                    opacity: [1, 1, 0],
                    x: [-30, -60],
                    y: [0, -30],
                    rotate: [-10, -30],
                  }}
                  transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
                />

                {/* Bow - right loop */}
                <motion.path
                  d="M150 125 Q200 70 190 105 Q205 135 150 125"
                  fill="url(#bowGradient)"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{
                    scale: [1, 1.15, 0],
                    opacity: [1, 1, 0],
                    x: [30, 60],
                    y: [0, -30],
                    rotate: [10, 30],
                  }}
                  transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
                />

                {/* Bow - tails */}
                <motion.path
                  d="M145 130 Q130 150 125 180"
                  stroke="#c4637a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0], y: [0, 20] }}
                  transition={{ delay: 1, duration: 1 }}
                />
                <motion.path
                  d="M155 130 Q170 150 175 180"
                  stroke="#c4637a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0], y: [0, 20] }}
                  transition={{ delay: 1, duration: 1 }}
                />

                {/* Bow center knot */}
                <motion.ellipse
                  cx="150" cy="123" rx="12" ry="10"
                  fill="#c4637a"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0], scale: [1, 1.3, 0] }}
                  transition={{ delay: 1, duration: 1.2 }}
                />

                {/* Hearts and sparkles */}
                {[
                  { x: 110, delay: 1.6, type: 'heart' },
                  { x: 150, delay: 1.8, type: 'sparkle' },
                  { x: 190, delay: 1.7, type: 'heart' },
                  { x: 130, delay: 1.9, type: 'sparkle' },
                  { x: 170, delay: 2.0, type: 'heart' },
                ].map((item, i) => (
                  <motion.g key={i}>
                    {item.type === 'heart' ? (
                      <motion.path
                        d={`M${item.x} 155 Q${item.x - 8} 145 ${item.x - 8} 152 Q${item.x - 8} 162 ${item.x} 170 Q${item.x + 8} 162 ${item.x + 8} 152 Q${item.x + 8} 145 ${item.x} 155`}
                        fill="#e8859a"
                        initial={{ y: 0, opacity: 0, scale: 0.5 }}
                        animate={{ y: [-30, -120], opacity: [0, 1, 1, 0], scale: [0.5, 1, 1] }}
                        transition={{ delay: item.delay, duration: 1.4, ease: 'easeOut' }}
                      />
                    ) : (
                      <motion.path
                        d={`M${item.x} 145 L${item.x + 3} 155 L${item.x + 12} 155 L${item.x + 5} 162 L${item.x + 8} 172 L${item.x} 165 L${item.x - 8} 172 L${item.x - 5} 162 L${item.x - 12} 155 L${item.x - 3} 155 Z`}
                        fill="#ffd700"
                        initial={{ y: 0, opacity: 0, scale: 0.3 }}
                        animate={{ y: [-30, -100], opacity: [0, 1, 1, 0], scale: [0.3, 0.8, 0.8], rotate: [0, 180] }}
                        transition={{ delay: item.delay, duration: 1.3, ease: 'easeOut' }}
                      />
                    )}
                  </motion.g>
                ))}
              </svg>
            </motion.div>

            {/* Text: slightly smaller on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mt-4 sm:mt-6"
            >
              <p className="font-[family-name:var(--font-playfair)] text-text text-lg sm:text-xl">
                Opening your gift...
              </p>
              <p className="font-[family-name:var(--font-dancing)] text-rose text-base sm:text-lg mt-1">
                Hold on tight
              </p>
            </motion.div>
          </div>

          {/* Timer to complete */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3 }}
            onAnimationComplete={() => {
              setPhase('done')
              onComplete()
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}