/**
 * Step 2 — choose: pick the exact things for each gift. One gift at a time, with a chip row showing which are done.
 * Every gift type shares the same option grid; each adds its own text field (and memories add photos).
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Art from '@/components/ui/Art'
import Button from '@/components/ui/Button'
import { FieldLabel, TextArea, TextInput } from '@/components/ui/Field'
import OptionTile from './OptionTile'
import { BasketIcon } from '@/components/shop/Basket'
import PhotoPicker from './PhotoPicker'
import { categoryInfo, optionImages, optionLists, typeTheme } from '@/lib/giftCatalog'
import { isItemComplete, missingFor } from '@/lib/builder'
import type { BuilderGiftItem, GiftItemContent, GiftType } from '@/lib/types'

interface StepCustomizeProps {
  items: BuilderGiftItem[]
  onUpdateItem: (id: string, content: GiftItemContent) => void
  onUpdatePhotos: (id: string, photos: File[], captions: string[]) => void
  onRemoveItem: (id: string) => void
  toName?: string
  /** Go back to the shop (shown when the basket has been emptied) */
  onBackToShop: () => void
}

/** [plural key, legacy singular key] — both are written so older readers keep working */
const KEYS: Record<GiftType, [string, string]> = {
  flower: ['styles', 'style'],
  sweets: ['types', 'type'],
  teddy: ['holdings', 'holding'],
  magical: ['types', 'type'],
  letter: ['styles', 'style'],
  memory: ['layouts', 'layout'],
}

const SINGLE: GiftType[] = ['letter', 'memory']

const COPY: Record<GiftType, { title: string; hint: string; field?: { key: string; label: string; placeholder: string; long?: boolean } }> = {
  flower: { title: 'Bouquet', hint: 'Pick one or mix several.', field: { key: 'note', label: 'Note', placeholder: 'A short note to go with the flowers' } },
  sweets: { title: 'Sweet treats', hint: 'Pick as many as you like.', field: { key: 'message', label: 'Card message', placeholder: 'What should the card say?' } },
  teddy: { title: 'What the teddy holds', hint: 'Pick one or more.', field: { key: 'message', label: 'Tag message', placeholder: 'What should the tag say?' } },
  magical: { title: 'Something magical', hint: 'Pick one or more.', field: { key: 'message', label: 'Wish or message', placeholder: 'Write a wish or a message' } },
  letter: { title: 'Letter style', hint: 'Pick one.', field: { key: 'text', label: 'Your letter', placeholder: 'Write what you want to say', long: true } },
  memory: { title: 'Photo layout', hint: 'Pick one.', field: { key: 'title', label: 'Title', placeholder: 'For example: Summer 2025' } },
}

export default function StepCustomize({ items, onUpdateItem, onUpdatePhotos, onRemoveItem, toName, onBackToShop }: StepCustomizeProps) {
  const [active, setActive] = useState(0)

  // Every gift was removed: say so and send them back to the shop
  if (items.length === 0) {
    return (
      <section aria-labelledby="fill-h" className="flex flex-col items-center py-10 text-center">
        <BasketIcon className="h-20 w-24" />
        <h1 id="fill-h" className="mt-5 text-3xl sm:text-4xl">Your basket is empty</h1>
        <p className="mt-2 max-w-sm text-base text-ink-soft">You took everything out. Go back to the shop and pick at least one gift.</p>
        <Button className="mt-6" onClick={onBackToShop}>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to the shop
        </Button>
      </section>
    )
  }

  const idx = Math.min(active, items.length - 1)
  const item = items[idx]
  const type = item.type
  const theme = typeTheme[type]
  const copy = COPY[type]
  const [plural, singular] = KEYS[type]
  const single = SINGLE.includes(type)
  const selected: string[] = (item.content[plural] as string[] | undefined) || (item.content[singular] ? [item.content[singular] as string] : [])
  const need = missingFor(item)
  const doneCount = items.filter(isItemComplete).length

  const select = (opt: string) => {
    const next = single ? [opt] : selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt]
    onUpdateItem(item.id, { ...item.content, [plural]: next, [singular]: next[0] || '' })
  }

  return (
    <section aria-labelledby="fill-h">
      <h1 id="fill-h" className="text-3xl sm:text-4xl">Choose your gifts</h1>
      <p className="mt-2 text-base text-ink-soft" aria-live="polite">{doneCount} of {items.length} ready</p>

      {/* One chip per gift */}
      <div role="tablist" aria-label="Your gifts" className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {items.map((it, i) => {
          const th = typeTheme[it.type]
          const done = isItemComplete(it)
          const on = i === idx
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => setActive(i)}
              className={`flex shrink-0 items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors ${on ? `${th.bg} ${th.text} border-ink` : 'border-ink/20 bg-white text-ink hover:border-ink/60'}`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-full ${on ? 'bg-white/45' : th.bg}`}>
                {done ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true"><path d="m3 8.5 3.2 3.2L13 4.8" stroke={th.hex === '#2f46e6' && !on ? '#fff' : '#14182b'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <Art src={categoryInfo[it.type].image} alt="" size={32} className="h-6 w-6" />
                )}
              </span>
              {th.name}
              {done && <span className="sr-only"> (ready)</span>}
            </button>
          )
        })}
      </div>

      <motion.div
        key={item.id}
        role="tabpanel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 rounded-[1.75rem] border-2 border-ink bg-paper p-4 sm:p-6"
      >
        <div className={`-mx-4 -mt-4 mb-5 flex items-center gap-3 rounded-t-[1.6rem] px-4 py-3 sm:-mx-6 sm:-mt-6 sm:px-6 ${theme.bg} ${theme.text}`}>
          <Art src={categoryInfo[type].image} alt="" size={56} className="h-12 w-12" />
          <div>
            <h2 className="text-2xl">{copy.title}</h2>
            <p className="text-sm opacity-85">{copy.hint}</p>
          </div>
        </div>

        <div
          {...(single ? { role: 'radiogroup', 'aria-label': copy.title } : { role: 'group', 'aria-label': copy.title })}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {optionLists[type].map((opt) => (
            <OptionTile
              key={opt}
              imageSrc={optionImages[type][opt]}
              label={opt}
              selected={selected.includes(opt)}
              single={single}
              tone={theme.bg}
              onClick={() => select(opt)}
            />
          ))}
        </div>

        {copy.field && (
          <div className="mt-6">
            <FieldLabel htmlFor={`f-${item.id}`} hint={copy.field.long ? undefined : 'Optional'}>{copy.field.label}</FieldLabel>
            {type === 'letter' && <p className="mb-2 font-hand text-2xl leading-none text-ink-soft">Dear {toName?.trim() || 'someone special'},</p>}
            {copy.field.long ? (
              <TextArea
                id={`f-${item.id}`}
                value={(item.content[copy.field.key] as string) || ''}
                onChange={(e) => onUpdateItem(item.id, { ...item.content, [copy.field!.key]: e.target.value })}
                placeholder={copy.field.placeholder}
                rows={7}
                className="min-h-44"
              />
            ) : (
              <TextInput
                id={`f-${item.id}`}
                value={(item.content[copy.field.key] as string) || ''}
                onChange={(e) => onUpdateItem(item.id, { ...item.content, [copy.field!.key]: e.target.value })}
                placeholder={copy.field.placeholder}
              />
            )}
          </div>
        )}

        {type === 'memory' && (
          <div className="mt-6">
            <FieldLabel>Photos ({(item.photos || []).length}/6)</FieldLabel>
            <PhotoPicker
              photos={item.photos || []}
              captions={item.photoCaptions || []}
              disabled={selected.length === 0}
              onChange={(files, caps) => onUpdatePhotos(item.id, files, caps)}
            />
            {selected.length === 0 && <p className="mt-1 text-sm text-ink-soft">Pick a layout first.</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-4">
          <p className={`text-sm font-semibold ${need ? 'text-ink' : 'text-ink-soft'}`} aria-live="polite">
            {need ?? 'This one is ready'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { onRemoveItem(item.id); setActive(Math.max(0, idx - 1)) }}
          >
            Remove {theme.name.toLowerCase()}
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
