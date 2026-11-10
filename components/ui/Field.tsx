/** Form primitives: label, single-line input and textarea with one consistent look. */

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

const control =
  'w-full rounded-2xl border-2 border-ink/20 bg-white px-4 text-ink placeholder:text-ink-faint ' +
  'transition-colors duration-150 hover:border-ink/40 focus:border-ink focus:outline-none ' +
  'focus-visible:outline-none focus:ring-4 focus:ring-butter/70'

export function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-ink-soft">{hint}</span>}
    </label>
  )
}

export function TextInput({ className = '', ...props }: ComponentPropsWithoutRef<'input'>) {
  return <input type="text" {...props} className={`${control} h-12 ${className}`} />
}

export function TextArea({ className = '', ...props }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea {...props} className={`${control} min-h-28 resize-y py-3 leading-relaxed ${className}`} />
}
