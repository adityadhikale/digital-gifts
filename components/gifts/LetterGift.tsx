'use client'

import { motion } from 'framer-motion'

interface LetterGiftProps {
  content: {
    styles?: string[]
    style?: string
    text?: string
    inkColor?: string
  }
  reveal?: boolean
}

const inkColors: Record<string, string> = {
  black: '#3a2a2e',
  rose: '#dc4a5e',
  blue: '#4a7db5',
  gold: '#b8860b',
}

export default function LetterGift({ content, reveal = false }: LetterGiftProps) {
  const styles: string[] = content.styles || (content.style ? [content.style] : ['open letter'])
  const { text = '', inkColor = 'black' } = content
  const color = inkColors[inkColor] || inkColors.black

  return (
    <motion.div
      initial={reveal ? { opacity: 0, scale: 0.9 } : false}
      animate={reveal ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-peach/30 to-cream rounded-2xl p-6 h-full"
    >
      <div className="flex flex-wrap justify-center gap-4">
        {styles.map((style, i) => (
          <div key={i} className="w-full max-w-[280px]" >
      <div className="relative">
        {style === 'parchment scroll' && (
          <div className="bg-[#f5ecd7] rounded-lg p-6 shadow-inner border border-[#e0d5bc] min-h-[200px]">
            {/* Scroll top curl */}
            <div className="absolute top-0 left-4 right-4 h-4 bg-gradient-to-b from-[#ddd0b5] to-transparent rounded-t-lg" />
            <div className="pt-2">
              <p
                className="font-[family-name:var(--font-dancing)] text-lg leading-relaxed whitespace-pre-wrap"
                style={{ color }}
              >
                {text || 'Your letter will appear here...'}
              </p>
            </div>
            {/* Scroll bottom curl */}
            <div className="absolute bottom-0 left-4 right-4 h-4 bg-gradient-to-t from-[#ddd0b5] to-transparent rounded-b-lg" />
          </div>
        )}

        {style === 'sealed envelope' && (
          <div className="relative">
            <div className="bg-[#fff5ee] rounded-lg p-6 shadow-md border border-blush/20 min-h-[200px]">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <svg viewBox="0 0 40 30" fill="none" className="w-10 h-8">
                  <circle cx="20" cy="15" r="12" fill="#f2a7b5" opacity="0.6" />
                  <path d="M14 12 L20 18 L26 12" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <p
                className="font-[family-name:var(--font-dancing)] text-lg leading-relaxed mt-4 whitespace-pre-wrap"
                style={{ color }}
              >
                {text || 'Your letter will appear here...'}
              </p>
            </div>
          </div>
        )}

        {(style === 'open letter' || (!style)) && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-blush/10 min-h-[200px]">
            <div className="border-b border-blush/10 pb-3 mb-4">
              <div className="w-8 h-1 bg-blush/30 rounded-full" />
            </div>
            <p
              className="font-[family-name:var(--font-dancing)] text-lg leading-relaxed whitespace-pre-wrap"
              style={{ color }}
            >
              {text || 'Your letter will appear here...'}
            </p>
            <div className="mt-4 pt-3 border-t border-blush/10">
              <div className="w-12 h-1 bg-blush/20 rounded-full ml-auto" />
            </div>
          </div>
        )}
      </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
