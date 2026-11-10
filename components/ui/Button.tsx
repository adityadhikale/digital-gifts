/**
 * Button / link-button. Pill shaped; renders a Next <Link> when given an href so we never
 * nest a <button> inside an <a>.
 */

import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'light'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: Variant
  size?: Size
  /** Show a trailing arrow */
  arrow?: boolean
  /** Renders a link instead of a button */
  href?: string
  target?: string
  rel?: string
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-cobalt',
  accent: 'bg-butter text-ink hover:bg-white',
  light: 'bg-paper text-ink hover:bg-butter',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink hover:bg-ink/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm gap-2',
  md: 'h-12 px-6 text-base gap-2.5',
  lg: 'h-14 px-8 text-lg gap-3',
}

const base =
  'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none ' +
  'transition-[background-color,color,transform,opacity] duration-200 ease-[var(--ease-out-quint)] ' +
  'active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none'

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  arrow,
  href,
  target,
  rel,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={cls} aria-label={rest['aria-label']} onClick={rest.onClick as never}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  )
}
