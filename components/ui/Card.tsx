'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  selected?: boolean
  gradient?: 'flower' | 'sweets' | 'teddy' | 'magical' | 'letter' | 'memory'
}

const gradients = {
  flower: 'bg-gradient-flower',
  sweets: 'bg-gradient-sweets',
  teddy: 'bg-gradient-teddy',
  magical: 'bg-gradient-magical',
  letter: 'bg-gradient-letter',
  memory: 'bg-gradient-memory',
}

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  selected = false,
  gradient,
}: CardProps) {
  const bgClass = gradient ? gradients[gradient] : 'bg-white'

  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        rounded-3xl p-6 transition-all duration-300
        shadow-layered
        ${bgClass}
        ${hover ? 'cursor-pointer hover:shadow-layered-lg' : ''}
        ${selected
          ? 'ring-2 ring-rose shadow-lg shadow-rose/20 scale-[1.02]'
          : ''
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
