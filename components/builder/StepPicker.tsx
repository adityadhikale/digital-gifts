/**
 * Step 1 of the gift builder - Gift category picker.
 * Each category is shown as its illustration, with no box around it.
 */

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { GiftType } from '@/lib/types'
import { categoryInfo } from '@/lib/giftCatalog'

interface StepPickerProps {
  selectedTypes: GiftType[]
  onToggle: (type: GiftType) => void
}

/** Categories in display order, with a one-line description */
const CATEGORIES: { type: GiftType; name: string; description: string }[] = [
  { type: 'flower',  name: 'Flowers',           description: "A bouquet that doesn't wilt" },
  { type: 'sweets',  name: 'Sweets',            description: 'Cakes, cupcakes, chocolates' },
  { type: 'teddy',   name: 'Teddy bear',        description: 'A teddy holding something' },
  { type: 'magical', name: 'Something magical', description: 'Snow globes, lanterns, balloons' },
  { type: 'letter',  name: 'Letter',            description: 'Your own words' },
  { type: 'memory',  name: 'Photos',            description: 'Up to 6 of your photos' },
]

export default function StepPicker({ selectedTypes, onToggle }: StepPickerProps) {
  return (
    <div className="m-2 sm:m-5">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-light italic text-text mb-2">
        What do you want to send?
      </h2>
      <p className="font-[family-name:var(--font-playfair)] italic text-sm text-text-muted mb-4 sm:mb-6">
        Pick one or more.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-6">
        {CATEGORIES.map((cat, index) => {
          const isSelected = selectedTypes.includes(cat.type)

          return (
            <motion.button
              type="button"
              key={cat.type}
              aria-pressed={isSelected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(cat.type)}
              className={`flex flex-col items-center text-center cursor-pointer transition-opacity duration-200 ${isSelected ? '' : 'opacity-75 hover:opacity-100'}`}
            >
              <div className="relative w-full max-w-[170px] aspect-square">
                {/* Soft glow behind a selected illustration */}
                <div className={`absolute inset-0 bg-[radial-gradient(circle,rgba(139,42,62,0.16),transparent_65%)] transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                <Image
                  src={categoryInfo[cat.type].image}
                  alt={cat.name}
                  width={240}
                  height={240}
                  priority={index < 3}
                  className={`relative w-full h-full object-contain drop-shadow-lg transition-transform duration-300 ${isSelected ? 'scale-105' : ''}`}
                />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-md z-10 bg-rose"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </div>

              <h3 className={`mt-1 font-[family-name:var(--font-dm-sans)] text-sm ${isSelected ? 'font-semibold text-rose' : 'font-medium text-text'}`}>
                {cat.name}
              </h3>
              <p className="hidden sm:block font-[family-name:var(--font-dm-sans)] font-light text-text-muted text-xs leading-tight mt-0.5">
                {cat.description}
              </p>
            </motion.button>
          )
        })}
      </div>

      {selectedTypes.length > 0 && (
        <p className="mt-6 text-xs font-[family-name:var(--font-dm-sans)] text-text-muted">
          Selected ({selectedTypes.length}): {selectedTypes.map((t) => CATEGORIES.find((c) => c.type === t)?.name).join(', ')}. Click one to remove it.
        </p>
      )}
    </div>
  )
}
