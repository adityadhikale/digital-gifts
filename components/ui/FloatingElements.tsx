/**
 * Floating decorative elements that animate across the screen.
 * Creates an ambient background effect with petals, hearts, stars, sparkles, and bows.
 */

'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/** Available element shape types */
type ElementType = 'petal' | 'heart' | 'star' | 'sparkle' | 'bow'

/** Configuration for a single floating element */
interface FloatingElement {
  id: number
  x: number       // Initial x position (0-100 viewport width)
  delay: number   // Animation start delay in seconds
  duration: number // Animation duration in seconds
  size: number    // Element size in pixels
  type: ElementType
  opacity: number // Max opacity during animation
}

/** All available element types */
const ELEMENT_TYPES: readonly ElementType[] = ['petal', 'heart', 'star', 'sparkle', 'bow']

interface FloatingElementsProps {
  count?: number
}

/**
 * Generates random element configurations.
 * Elements float from bottom to top with varying properties.
 */
function generateElements(count: number): FloatingElement[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 12 + Math.random() * 15,
    size: 8 + Math.random() * 16,
    type: ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)],
    opacity: 0.3 + Math.random() * 0.3,
  }))
}

/**
 * Floating background elements component.
 * Renders animated decorative shapes that float upward infinitely.
 */
export default function FloatingElements({ count = 20 }: FloatingElementsProps) {
  const [elements, setElements] = useState<FloatingElement[]>([])

  // Generate elements on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    setElements(generateElements(count))
  }, [count])

  if (elements.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: '110vh', x: `${el.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, el.opacity, el.opacity, 0],
            rotate: el.type === 'sparkle' ? 0 : 180,
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute"
          style={{ width: el.size, height: el.size }}
        >
          {/* Rose petal shape */}
          {el.type === 'petal' && (
            <svg viewBox="0 0 24 32" fill="none" className="w-full h-full">
              <path
                d="M12 0C6 0 0 8 0 16c0 10 6 16 12 16s12-6 12-16C24 8 18 0 12 0z"
                fill="url(#petalGrad)"
              />
              <path
                d="M12 4C10 4 6 10 6 16c0 6 3 10 6 10"
                stroke="#e8859a"
                strokeWidth="0.5"
                opacity="0.5"
                fill="none"
              />
              <defs>
                <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9c8d4" />
                  <stop offset="100%" stopColor="#e8859a" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Heart shape */}
          {el.type === 'heart' && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="url(#heartGrad)"
              />
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8859a" />
                  <stop offset="100%" stopColor="#c4637a" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* 4-point sparkle */}
          {el.type === 'sparkle' && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                fill="url(#sparkleGrad)"
              />
              <defs>
                <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ede8f8" />
                  <stop offset="100%" stopColor="#c9bfee" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* 5-point star */}
          {el.type === 'star' && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"
                fill="url(#starGrad)"
              />
              <defs>
                <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fce4d6" />
                  <stop offset="100%" stopColor="#f5c4a8" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Bow/ribbon shape */}
          {el.type === 'bow' && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 10C8 6 4 8 4 10s2 4 6 4c-4 0-6 2-6 4s4 4 8 0"
                fill="url(#bowGrad1)"
              />
              <path
                d="M12 10c4-4 8-2 8 0s-2 4-6 4c4 0 6 2 6 4s-4 4-8 0"
                fill="url(#bowGrad2)"
              />
              <circle cx="12" cy="12" r="2" fill="#c4637a" />
              <defs>
                <linearGradient id="bowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9c8d4" />
                  <stop offset="100%" stopColor="#e8859a" />
                </linearGradient>
                <linearGradient id="bowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f9c8d4" />
                  <stop offset="100%" stopColor="#e8859a" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}
