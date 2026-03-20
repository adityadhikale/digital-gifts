/**
 * Step 1 of the gift builder - Gift category picker.
 * Allows users to select one or more gift categories (flower, sweets, etc.)
 */

'use client'

import { motion } from 'framer-motion'
import { GiftType } from '@/lib/types'
import { GiftIcon } from '@/app/page'

interface StepPickerProps {
  selectedTypes: GiftType[]
  onToggle: (type: GiftType) => void
}

/** Category configuration with display information and styling */
interface CategoryConfig {
  type: GiftType
  name: string
  description: string
  gradient: string
}

/** Available gift categories with their metadata */
const CATEGORIES: CategoryConfig[] = [
  { type: 'flower',  name: 'Flowers & Plants',   description: 'A bouquet that never wilts',                gradient: 'bg-gradient-flower'  },
  { type: 'sweets',  name: 'Sweet Treats',        description: 'Sugar, spice and everything nice',          gradient: 'bg-gradient-sweets'  },
  { type: 'teddy',   name: 'Teddy Bears',         description: 'A hug they can keep forever',               gradient: 'bg-gradient-teddy'   },
  { type: 'magical', name: 'Magical & Whimsical', description: 'A little wonder, just for them',            gradient: 'bg-gradient-magical' },
  { type: 'letter',  name: 'Love Letters',        description: 'Words straight from your heart',            gradient: 'bg-gradient-letter'  },
  { type: 'memory',  name: 'Memories',            description: 'Your favorite moments, beautifully framed', gradient: 'bg-gradient-memory'  },
]

/**
 * Gift category picker component.
 * Displays a grid of selectable gift categories.
 */
export default function StepPicker({ selectedTypes, onToggle }: StepPickerProps) {
  return (
    /* Reduced margin on mobile, full margin on sm+ */
    <div className="m-2 sm:m-5">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-light italic text-text mb-2">
        What would you like to gift?
      </h2>
      <p className="font-[family-name:var(--font-playfair)] italic text-sm text-text-muted mb-4 sm:mb-6">
        Choose as many as your heart desires
      </p>

      {/* Category grid: 2 cols on mobile, 3 cols on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CATEGORIES.map((cat, index) => {
          const isSelected = selectedTypes.includes(cat.type)

          return (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(cat.type)}
              className={`
                ${cat.gradient} rounded-2xl p-3 sm:p-4 cursor-pointer
                transition-all duration-300 relative overflow-hidden border-2
                ${isSelected
                  ? 'border-rose shadow-lg shadow-rose/20 scale-[1.02]'
                  : 'border-transparent opacity-90 hover:opacity-100 hover:shadow-md'
                }
              `}
            >
              {/* Selection checkmark badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10"
                  style={{ backgroundColor: '#8b2a3e' }}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}

              {/* Decorative sparkle when not selected */}
              {!isSelected && (
                <div className="absolute top-2 left-2 opacity-25">
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                    <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#8b2a3e" />
                  </svg>
                </div>
              )}

              {/* Category illustration */}
              <div className="flex justify-center mb-2">
                <GiftIcon type={cat.type} size="md" />
              </div>

              {/* Category text */}
              <div className="text-center">
                <h3
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: '#2a1a1f',
                    lineHeight: '1.3',
                    marginBottom: '4px',
                  }}
                >
                  {cat.name}
                </h3>
                {/* Description hidden on very small screens to save space */}
                <p className="hidden sm:block font-[family-name:var(--font-dm-sans)] font-light text-text-muted text-xs leading-tight">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Selected categories summary */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 p-3 bg-white/60 rounded-xl" style={{ border: '1px solid rgba(139,42,62,0.1)' }}>
          <p className="text-xs font-[family-name:var(--font-dm-sans)] text-text-muted mb-2">
            Selected ({selectedTypes.length}) — click again to remove:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <span
                key={type}
                className="text-xs px-2 py-1 rounded-lg font-[family-name:var(--font-dm-sans)]"
                style={{ background: 'rgba(139,42,62,0.1)', color: '#8b2a3e' }}
              >
                {CATEGORIES.find((c) => c.type === type)?.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}