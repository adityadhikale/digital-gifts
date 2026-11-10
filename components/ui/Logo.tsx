/** Wordmark: a punched gift tag next to the name. */

import Link from 'next/link'

interface LogoProps {
  href?: string
  light?: boolean
  /** Icon only on phones */
  compact?: boolean
  /** Smaller mark, for the footer */
  small?: boolean
  /** Wordmark only */
  noIcon?: boolean
}

export default function Logo({ href = '/', light = false, compact = false, small = false, noIcon = false }: LogoProps) {
  return (
    <Link href={href} className={`group inline-flex items-center ${small ? 'gap-1.5' : 'gap-2.5'} ${light ? 'text-paper' : 'text-ink'}`} aria-label="Digital Gifts home">
      {!noIcon && <svg viewBox="0 1.4 28 28" className={`${small ? 'h-4 w-4' : 'h-7 w-7'} transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-rotate-12`} aria-hidden="true">
        <rect x="5.5" y="14" width="17" height="11" rx="1.8" fill="#ff8fb8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="3.5" y="9.5" width="21" height="5" rx="1.8" fill="#ff8fb8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="12.5" y="9.5" width="3" height="15.5" fill="#ffd23f" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 9.5C11 4.5 6.5 5.5 8 8.5c.8 1.4 3.6 1.2 6 1Zm0 0c3-5 7.500-4 6 -1-.8 1.4-3.600 1.200-6 1Z" fill="#ffd23f" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>}
      <span className={`font-display font-bold tracking-tight whitespace-nowrap ${small ? 'text-xs' : 'text-xl'} ${compact ? 'hidden sm:inline' : ''}`}>Digital Gifts</span>
    </Link>
  )
}
