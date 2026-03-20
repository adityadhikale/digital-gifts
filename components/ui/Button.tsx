/**
 * Reusable Button component with multiple variants and sizes.
 * Includes hover and tap animations via Framer Motion.
 */

'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

/** Available button style variants */
type ButtonVariant = 'primary' | 'outline' | 'ghost'

/** Available button size presets */
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

/** Base styles applied to all buttons */
const BASE_STYLES =
  'inline-flex items-center justify-center rounded-full font-[family-name:var(--font-dm-sans)] font-medium transition-all duration-200 ease-out cursor-pointer relative overflow-hidden'

/** Variant-specific styles */
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-rose to-rose-dark text-white shadow-lg shadow-rose/25 hover:shadow-xl hover:shadow-rose/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
  outline:
    'border-2 border-rose text-rose bg-transparent hover:bg-rose/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  ghost:
    'text-text-muted hover:text-text hover:bg-blush/50 active:scale-[0.98]',
}

/** Size-specific styles */
const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm tracking-wide',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-9 py-4 text-lg',
}

/**
 * Animated button component with customizable variants and sizes.
 * Uses Framer Motion for hover/tap animations.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`${BASE_STYLES} ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
