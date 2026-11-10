/**
 * Photo upload for memory gifts: add up to six, reorder, caption and remove.
 * Photos are shrunk in the browser first, and problems are shown inline (no alert()).
 */

'use client'

import { useEffect, useState } from 'react'
import { MAX_PHOTOS } from '@/lib/builder'
import { MAX_UPLOAD_BYTES, shrinkPhoto } from '@/lib/image'
import { TextInput } from '@/components/ui/Field'

interface PhotoPickerProps {
  photos: File[]
  captions: string[]
  onChange: (files: File[], captions: string[]) => void
  disabled?: boolean
}

function Thumb({ file, alt }: { file: File; alt: string }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    const u = URL.createObjectURL(file)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])
  if (!url) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className="h-full w-full object-cover" />
}

const iconBtn =
  'grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-paper text-ink hover:bg-butter disabled:opacity-30 disabled:pointer-events-none'

export default function PhotoPicker({ photos, captions, onChange, disabled }: PhotoPickerProps) {
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const full = photos.length >= MAX_PHOTOS

  async function add(list: FileList | null) {
    if (!list || list.length === 0) return
    setNotice(null)
    setBusy(true)
    const room = MAX_PHOTOS - photos.length
    const incoming = Array.from(list)
    const problems: string[] = []
    const accepted: File[] = []
    for (const file of incoming.slice(0, room)) {
      if (!file.type.startsWith('image/')) { problems.push(`${file.name} isn't an image`); continue }
      const small = await shrinkPhoto(file)
      if (small.size > MAX_UPLOAD_BYTES) { problems.push(`${file.name} is too large (max 4 MB)`); continue }
      accepted.push(small)
    }
    if (incoming.length > room) problems.push(`Only ${MAX_PHOTOS} photos fit, so ${incoming.length - room} weren't added`)
    if (accepted.length) {
      onChange([...photos, ...accepted], [...captions, ...accepted.map(() => '')].slice(0, photos.length + accepted.length))
    }
    setNotice(problems.length ? problems.join('. ') + '.' : null)
    setBusy(false)
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length) return
    const p = [...photos]; const c = photos.map((_, i) => captions[i] || '')
    ;[p[from], p[to]] = [p[to], p[from]]
    ;[c[from], c[to]] = [c[to], c[from]]
    onChange(p, c)
  }

  return (
    <div>
      {!full && (
        <label
          className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-ink/40 bg-white px-4 py-7 text-center transition-colors hover:border-ink hover:bg-butter/30 focus-within:ring-4 focus-within:ring-butter/70 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden="true">
            <rect x="6" y="11" width="36" height="27" rx="5" stroke="#14182b" strokeWidth="3" />
            <circle cx="17" cy="22" r="4" stroke="#14182b" strokeWidth="3" />
            <path d="m8 35 10-9 8 7 6-5 10 8" stroke="#14182b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-semibold">{busy ? 'Getting your photos ready…' : photos.length === 0 ? 'Add photos' : 'Add more photos'}</span>
          <span className="text-sm text-ink-soft">{MAX_PHOTOS - photos.length} spot{MAX_PHOTOS - photos.length === 1 ? '' : 's'} left</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled || busy}
            onChange={(e) => { void add(e.target.files); e.target.value = '' }}
            className="sr-only"
          />
        </label>
      )}

      <p className="mt-2 min-h-5 text-sm text-tomato" role="status" style={{ color: '#b3200c' }}>{notice}</p>

      {photos.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <li key={`${photo.name}-${photo.lastModified}-${i}`} className="rounded-2xl border-2 border-ink bg-white p-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-paper-deep">
                <Thumb file={photo} alt={captions[i] || `Photo ${i + 1}`} />
                <span className="absolute left-1.5 top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs font-bold text-paper">{i + 1}</span>
              </div>
              <TextInput
                value={captions[i] || ''}
                onChange={(e) => { const c = photos.map((_, k) => captions[k] || ''); c[i] = e.target.value; onChange(photos, c) }}
                placeholder="Caption (optional)"
                aria-label={`Caption for photo ${i + 1}`}
                maxLength={80}
                className="mt-2 !h-10 !rounded-lg !px-3 text-sm"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <button type="button" className={iconBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}>
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d="m12 5-5 5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button type="button" className={iconBtn} onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} aria-label={`Move photo ${i + 1} later`}>
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
                <button
                  type="button"
                  className={iconBtn}
                  onClick={() => onChange(photos.filter((_, k) => k !== i), photos.map((_, k) => captions[k] || '').filter((_, k) => k !== i))}
                  aria-label={`Remove photo ${i + 1}`}
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
