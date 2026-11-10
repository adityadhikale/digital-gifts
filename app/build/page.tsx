/**
 * Gift builder: a four-step wizard (Pick → Fill → Write the tag → Tie and send).
 * Desktop shows a live phone preview beside the steps; phones open it in a bottom sheet.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GiftType, BuilderGiftItem, GiftItemContent } from '@/lib/types'
import { DEFAULT_CONTENT, isItemComplete } from '@/lib/builder'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import Sheet from '@/components/ui/Sheet'
import StepPicker from '@/components/builder/StepPicker'
import StepCustomize from '@/components/builder/StepCustomize'
import StepMessage from '@/components/builder/StepMessage'
import StepShare, { ShareProgress } from '@/components/builder/StepShare'
import LivePreview from '@/components/builder/LivePreview'

const STEPS = ['Pick', 'Fill', 'Tag', 'Send'] as const

export default function BuildPage() {
  const [step, setStep] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<GiftType[]>([])
  const [items, setItems] = useState<BuilderGiftItem[]>([])

  const [toName, setToName] = useState('')
  const [fromName, setFromName] = useState('')
  const [message, setMessage] = useState('')

  // Which arrangement of the gifts the recipient will see (saved with the gift)
  const [arrangement, setArrangement] = useState(0)

  // Generation state. The gift id and uploaded photos are remembered so a retry resumes instead of duplicating.
  const [giftLink, setGiftLink] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ShareProgress | null>(null)
  const giftId = useRef<string | null>(null)
  const uploaded = useRef<Set<string>>(new Set())

  const [previewOpen, setPreviewOpen] = useState(false)
  const closePreview = useCallback(() => setPreviewOpen(false), [])

  // Move to the top and announce the new step to screen readers
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    window.scrollTo({ top: 0 })
    const h = document.querySelector('main h1') as HTMLElement | null
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }) }
  }, [step])

  const toggleType = useCallback((type: GiftType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes((prev) => prev.filter((t) => t !== type))
      setItems((prev) => prev.filter((item) => item.type !== type))
    } else {
      const newItem: BuilderGiftItem = {
        id: `${type}-${typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36)}`,
        type,
        content: { ...DEFAULT_CONTENT[type] },
        photos: [],
        photoCaptions: [],
      }
      setSelectedTypes((prev) => [...prev, type])
      setItems((prev) => [...prev, newItem])
    }
  }, [selectedTypes])

  const updateItem = useCallback((id: string, content: GiftItemContent) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, content } : item)))
  }, [])

  const updatePhotos = useCallback((id: string, photos: File[], captions: string[]) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, photos, photoCaptions: captions } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSelectedTypes((prev) => prev.filter((t) => t !== item.type))
  }, [items])

  /** Create the gift, then upload photos one by one. Safe to call again after a failure. */
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    try {
      if (!giftId.current) {
        setProgress({ done: 0, total: 0, label: 'Saving your gift…' })
        const itemsToSend = items.map((item) => ({ type: item.type, content: { ...item.content, arrangement } }))
        const response = await fetch('/api/gifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromName, toName, message, items: itemsToSend }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to create gift')
        if (!data.id) throw new Error(data.error || 'Failed to create gift')
        giftId.current = data.id as string
      }

      const jobs: { key: string; file: File; caption: string; position: number }[] = []
      for (const item of items) {
        if (item.type === 'memory') {
          (item.photos || []).forEach((file, i) =>
            jobs.push({ key: `${item.id}:${i}:${file.name}:${file.size}`, file, caption: item.photoCaptions?.[i] || '', position: i }))
        }
      }

      let done = jobs.filter((j) => uploaded.current.has(j.key)).length
      for (const job of jobs) {
        if (uploaded.current.has(job.key)) continue
        setProgress({ done, total: jobs.length, label: `Uploading photo ${done + 1} of ${jobs.length}…` })
        const formData = new FormData()
        formData.append('file', job.file)
        formData.append('giftId', giftId.current)
        formData.append('caption', job.caption)
        formData.append('position', String(job.position))
        const photoResponse = await fetch('/api/photos', { method: 'POST', body: formData })
        if (!photoResponse.ok) {
          const errorData = await photoResponse.json().catch(() => ({}))
          throw new Error(`Photo ${done + 1} didn't upload${errorData.error ? ` (${errorData.error})` : ''}`)
        }
        uploaded.current.add(job.key)
        done += 1
      }

      setProgress({ done: jobs.length, total: jobs.length, label: 'Done' })
      setGiftLink(`${window.location.origin}/gift/${giftId.current}`)
    } catch (e) {
      console.error('Error generating gift:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }, [items, fromName, toName, message, arrangement])

  /** Whether the current step is complete enough to move on */
  const canProceed = (() => {
    switch (step) {
      case 0: return items.length > 0
      case 1: return items.length > 0 && items.every(isItemComplete)
      case 2: return toName.trim() !== '' && fromName.trim() !== ''
      default: return true
    }
  })()

  const locked = isGenerating || !!giftLink
  const hint =
    step === 0 && !canProceed ? 'Pick at least one gift' :
    step === 1 && !canProceed ? 'Finish each gift to continue' :
    step === 2 && !canProceed ? 'Add both names to continue' : ''

  return (
    <div className="min-h-dvh bg-paper">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo compact />
          <nav aria-label="Progress">
            <ol className="flex items-center gap-1.5 sm:gap-2">
              {STEPS.map((label, i) => {
                const state = i === step ? 'current' : i < step ? 'done' : 'todo'
                const clickable = i < step && !locked
                return (
                  <li key={label}>
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => setStep(i)}
                      aria-current={state === 'current' ? 'step' : undefined}
                      className={`flex h-10 items-center gap-2 rounded-full border-2 px-3 text-sm font-semibold transition-colors
                        ${state === 'current' ? 'border-ink bg-ink text-paper' : state === 'done' ? 'border-ink bg-butter text-ink hover:bg-white disabled:hover:bg-butter' : 'border-ink/20 text-ink-soft'}`}
                    >
                      <span aria-hidden="true">{state === 'done' ? '✓' : i + 1}</span>
                      <span className={state === 'current' ? 'inline' : 'hidden sm:inline'}>{label}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        {/* ── Steps ── */}
        <main className="min-w-0 pt-6 sm:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pb-8"
            >
              {step === 0 && <StepPicker selectedTypes={selectedTypes} onToggle={toggleType} />}
              {step === 1 && (
                <StepCustomize items={items} onUpdateItem={updateItem} onUpdatePhotos={updatePhotos} onRemoveItem={removeItem} toName={toName} />
              )}
              {step === 2 && (
                <StepMessage
                  toName={toName} fromName={fromName} message={message}
                  onToNameChange={setToName} onFromNameChange={setFromName} onMessageChange={setMessage}
                />
              )}
              {step === 3 && (
                <StepShare
                  giftLink={giftLink} onGenerate={handleGenerate} isGenerating={isGenerating}
                  error={error} progress={progress} toName={toName} fromName={fromName} types={selectedTypes}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action bar */}
          <div className="sticky bottom-0 z-20 -mx-5 flex items-center gap-3 border-t-2 border-ink bg-paper px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
            {step > 0 && !giftLink && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isGenerating}>Back</Button>
            )}
            {step < 3 && (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed} arrow>
                {step === 2 ? 'Finish' : 'Next'}
              </Button>
            )}
            {hint && <p className="hidden min-w-0 flex-1 truncate text-sm text-ink-soft sm:block" aria-live="polite">{hint}</p>}
            <Button variant="light" className="ml-auto border-2 border-ink lg:hidden" onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
          </div>
          {hint && <p className="mt-2 text-sm text-ink-soft sm:hidden" aria-live="polite">{hint}</p>}
        </main>

        {/* ── Desktop preview ── */}
        <aside className="hidden lg:block" aria-label="Live preview">
          <div className="sticky top-24 pt-8">
            <LivePreview
              items={items} toName={toName} fromName={fromName} message={message}
              arrangement={arrangement} onArrangementChange={setArrangement}
            />
          </div>
        </aside>
      </div>

      {/* ── Phone preview ── */}
      <Sheet open={previewOpen} onClose={closePreview} title="What they'll see">
        <LivePreview
          hideLabel
          items={items} toName={toName} fromName={fromName} message={message}
          arrangement={arrangement} onArrangementChange={setArrangement}
        />
      </Sheet>
    </div>
  )
}
