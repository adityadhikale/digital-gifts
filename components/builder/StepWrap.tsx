/**
 * Step 3 — wrap it up. The shop counter: the gifts laid out in a scene, a new arrangement on
 * request, and the paper and ribbon the box is wrapped in (the recipient unwraps that box).
 */

'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrangementScene, ARRANGEMENT_VARIANTS } from '@/components/reveal/GiftArrangement'
import Backdrop from '@/components/wrap/Backdrop'
import GiftBox from '@/components/wrap/GiftBox'
import { PAPERS, RIBBONS, type Paper, type WrapChoice } from '@/lib/wrap'
import type { BuilderGiftItem } from '@/lib/types'

interface StepWrapProps {
  items: BuilderGiftItem[]
  wrap: WrapChoice
  onWrapChange: (patch: Partial<WrapChoice>) => void
  arrangement: number
  onArrangementChange: (variant: number) => void
}

/** A labelled row of radio swatches */
function Choices<T extends { id: string; label: string }>({
  title, options, value, onChange, render, wide,
}: { title: string; options: T[]; value: string; onChange: (id: string) => void; render: (o: T) => ReactNode; wide?: boolean }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-ink">
        {title} <span className="font-normal text-ink-soft">· {options.find((o) => o.id === value)?.label}</span>
      </legend>
      <div role="radiogroup" aria-label={title} className={`no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 py-1.5 ${wide ? '' : 'flex-wrap'}`}>
        {options.map((o) => {
          const on = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={o.label}
              title={o.label}
              onClick={() => onChange(o.id)}
              className={`shrink-0 rounded-full transition-[box-shadow,transform] focus-visible:outline-ink duration-150 active:scale-95 ${wide ? 'rounded-xl' : ''}
                ${on ? 'shadow-[0_0_0_3px_var(--color-paper),0_0_0_6px_var(--color-ink)]' : 'hover:-translate-y-0.5'}`}
            >
              {render(o)}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Round swatch of a paper, showing its pattern */
function PaperDot({ p }: { p: Paper }) {
  return (
    <svg viewBox="0 0 40 40" className="block h-10 w-10" aria-hidden="true">
      <defs>
        <clipPath id={`clip-${p.id}`}><circle cx="20" cy="20" r="18" /></clipPath>
      </defs>
      <g clipPath={`url(#clip-${p.id})`}>
        <rect width="40" height="40" fill={p.fill} />
        {p.pattern === 'dots' && [[10, 10], [30, 10], [20, 22], [10, 32], [30, 32]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.2" fill={p.accent} />)}
        {p.pattern === 'stripes' && [0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 14 - 18} y="-10" width="6" height="60" fill={p.accent} transform="rotate(35 20 20)" />)}
      </g>
      <circle cx="20" cy="20" r="18" fill="none" stroke="#14182b" strokeWidth="2.5" />
    </svg>
  )
}

export default function StepWrap({ items, wrap, onWrapChange, arrangement, onArrangementChange }: StepWrapProps) {
  const set = onWrapChange

  return (
    <section aria-labelledby="wrap-h">
      <h1 id="wrap-h" className="text-3xl sm:text-4xl">Wrap it up</h1>
      <p className="mt-2 text-base text-ink-soft">Lay out your gifts, then choose the paper and ribbon they&apos;ll unwrap.</p>

      {/* The counter: the gifts laid out */}
      <div className="relative mt-6 overflow-hidden rounded-[1.75rem] border-2 border-ink" style={{ aspectRatio: '5 / 4' }}>
        <Backdrop />
        <div className="absolute inset-[4%]">
          <ArrangementScene items={items} variant={arrangement} width="100%" />
        </div>
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onArrangementChange((arrangement + 1) % ARRANGEMENT_VARIANTS)}
            className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold uppercase tracking-wide text-paper hover:bg-ink/85"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M3 10a7 7 0 0 1 12-5l2 2M17 3v4h-4M17 10a7 7 0 0 1-12 5l-2-2M3 17v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Try a new arrangement
          </motion.button>
        </div>
      )}

      <div className="mt-6 grid gap-6">
        <div className="grid items-center gap-5 rounded-[1.75rem] border-2 border-ink bg-white p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <div className="grid gap-5">
            <Choices title="Wrapping paper" options={PAPERS} value={wrap.paper} onChange={(paper) => set({ paper })} render={(p) => <PaperDot p={p} />} />
            <Choices
              title="Ribbon"
              options={RIBBONS}
              value={wrap.ribbon}
              onChange={(ribbon) => set({ ribbon })}
              render={(r) => <span className="block h-10 w-10 rounded-full border-[2.5px] border-ink" style={{ background: r.fill }} />}
            />
          </div>
          <div className="flex flex-col items-center gap-1 sm:w-40">
            <motion.div key={`${wrap.paper}-${wrap.ribbon}`} initial={{ scale: 0.92, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
              <GiftBox paper={wrap.paper} ribbon={wrap.ribbon} className="w-32" />
            </motion.div>
            <p className="text-center font-hand text-xl leading-tight text-ink-soft">This is the box they&apos;ll open</p>
          </div>
        </div>
      </div>
    </section>
  )
}
