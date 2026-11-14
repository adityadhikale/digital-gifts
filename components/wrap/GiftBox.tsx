/**
 * The wrapped gift box, drawn in the app's outlined style and coloured by the sender's
 * paper and ribbon. Split into base and lid so the unwrap screen can lift the lid on its own.
 */

'use client'

import { useId } from 'react'
import { paperById, ribbonById } from '@/lib/wrap'

const INK = '#14182b'

/** Fill reference for the paper: plain colour, or a pattern defined in <PaperDefs> */
function usePaper(paperId: string) {
  const raw = useId()
  const id = `paper-${raw.replace(/[^a-zA-Z0-9]/g, '')}`
  const paper = paperById(paperId)
  const fill = paper.pattern ? `url(#${id})` : paper.fill
  const defs = paper.pattern ? (
    <defs>
      <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform={paper.pattern === 'stripes' ? 'rotate(35)' : undefined}>
        <rect width="22" height="22" fill={paper.fill} />
        {paper.pattern === 'dots'
          ? <><circle cx="5.5" cy="5.5" r="3.4" fill={paper.accent} /><circle cx="16.5" cy="16.5" r="3.4" fill={paper.accent} /></>
          : <rect width="9" height="22" fill={paper.accent} />}
      </pattern>
    </defs>
  ) : null
  return { fill, defs }
}

/** Ribbon with a thin outline that stays visible on white ribbons */
const ribbonStroke = INK

interface PartProps { paper: string; ribbon: string; className?: string }

/** The box body and its shadow. viewBox 0 0 280 280 */
export function BoxBase({ paper, ribbon, className = '' }: PartProps) {
  const { fill, defs } = usePaper(paper)
  const r = ribbonById(ribbon).fill
  return (
    <svg viewBox="0 0 280 280" className={`overflow-visible ${className}`} aria-hidden="true">
      {defs}
      <ellipse cx="140" cy="254" rx="106" ry="11" fill={INK} opacity="0.14" />
      <rect x="44" y="118" width="192" height="16" rx="8" fill={INK} />
      <rect x="36" y="124" width="208" height="124" rx="20" fill={fill} stroke={INK} strokeWidth="5.5" strokeLinejoin="round" />
      <rect x="118" y="124" width="44" height="124" fill={r} stroke={ribbonStroke} strokeWidth="5.5" strokeLinejoin="round" />
      <rect x="39" y="126.5" width="202" height="14" fill={INK} opacity="0.14" />
      <path d="M54 156v42" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <circle cx="54" cy="212" r="3" fill="#ffffff" opacity="0.9" />
    </svg>
  )
}

/** The lid with its bow. viewBox 0 22 280 118 (sits over the top of the base) */
export function BoxLid({ paper, ribbon, className = '' }: PartProps) {
  const { fill, defs } = usePaper(paper)
  const r = ribbonById(ribbon).fill
  return (
    <svg viewBox="0 22 280 118" className={`overflow-visible ${className}`} aria-hidden="true">
      {defs}
      <rect x="22" y="84" width="236" height="50" rx="15" fill={fill} stroke={INK} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M36 112v-11a5 5 0 0 1 5-5h28" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.92" />
      <rect x="118" y="84" width="44" height="50" fill={r} stroke={ribbonStroke} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M132 82 105 112l13-3 6 9 14-31Z" fill={r} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M148 82 175 112l-13-3-6 9-14-31Z" fill={r} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M134 78c-24 0-54-2-58-24-3-18 20-26 38-12 10 8 18 22 22 32Z" fill={r} stroke={INK} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M146 78c24 0 54-2 58-24 3-18-20-26-38-12-10 8-18 22-22 32Z" fill={r} stroke={INK} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M126 72c-12-4-22-10-29-16" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M154 72c12-4 22-10 29-16" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M87 53c0-8 7-13 15-11" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <rect x="128" y="65" width="24" height="22" rx="9" fill={r} stroke={INK} strokeWidth="5.5" strokeLinejoin="round" />
      <circle cx="136" cy="72" r="2.5" fill="#ffffff" opacity="0.85" />
    </svg>
  )
}

/** Closed box, for previews. Square; size it with the className (width). */
export default function GiftBox({ paper, ribbon, className = '' }: PartProps) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <BoxBase paper={paper} ribbon={ribbon} className="absolute inset-0 h-full w-full" />
      <BoxLid paper={paper} ribbon={ribbon} className="absolute inset-x-0 top-[7.8%] h-[42.2%] w-full" />
    </div>
  )
}
