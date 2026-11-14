/**
 * A selectable option as a small product card: illustration on top (tinted when picked),
 * a paper label strip below. Multi-select = toggle button, single-select = radio.
 */

'use client'

import Art from '@/components/ui/Art'

interface OptionTileProps {
  imageSrc: string
  label: string
  selected: boolean
  onClick: () => void
  /** Tailwind background class for the selected state */
  tone: string
  /** Single-choice (radio) instead of multi-choice (toggle) */
  single?: boolean
}

export default function OptionTile({ imageSrc, label, selected, onClick, tone, single }: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...(single ? { role: 'radio', 'aria-checked': selected } : { 'aria-pressed': selected })}
      className={`relative flex flex-col overflow-hidden rounded-[1.25rem] border-2 border-ink bg-paper text-left focus-visible:outline-ink transition-[box-shadow,transform] duration-200 ease-[var(--ease-out-quint)] active:scale-[0.97]
        ${selected ? 'shadow-[0_0_0_3px_var(--color-paper),0_0_0_6px_var(--color-ink)]' : 'hover:-translate-y-0.5 hover:shadow-[0_3px_0_var(--color-ink)]'}`}
    >
      <span className={`relative block aspect-square transition-colors duration-200 ${selected ? tone : 'bg-white'}`}>
        <Art src={imageSrc} alt="" size={140} className="absolute inset-0 m-auto h-[80%] w-[80%] object-contain" />
        <span
          className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-ink transition-all duration-200 ${selected ? 'scale-100 bg-ink' : 'scale-0'}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
            <path d="m3 8.5 3.2 3.2L13 4.8" stroke="#f4f5ef" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <span className="border-t-2 border-ink px-3 py-2 text-sm font-bold capitalize leading-tight text-ink">{label}</span>
    </button>
  )
}
