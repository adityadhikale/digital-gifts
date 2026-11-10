/** A selectable illustration option (multi-select = toggle button, single-select = radio). */

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
      className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-out-quint)] active:scale-[0.97]
        ${selected ? `${tone} border-ink` : 'border-ink/20 bg-white hover:border-ink/60'}`}
    >
      <span
        className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-ink transition-all duration-200 ${selected ? 'scale-100 bg-ink' : 'scale-0 bg-transparent'}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
          <path d="m3 8.5 3.2 3.2L13 4.8" stroke="#f4f5ef" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <Art src={imageSrc} alt="" size={140} className="h-auto w-full max-w-[104px]" />
      <span className={`text-sm font-semibold capitalize leading-tight ${selected && tone.includes('cobalt') ? 'text-white' : 'text-ink'}`}>{label}</span>
    </button>
  )
}
