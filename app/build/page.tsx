/**
 * Gift Builder page - a multi-step wizard for creating digital gifts.
 * Steps: Pick categories → Customize items → Add message → Generate & Share
 */

'use client'

import { useState, useCallback, ReactElement } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GiftType, BuilderGiftItem, GiftItemContent } from '@/lib/types'
import Button from '@/components/ui/Button'
import StepPicker from '@/components/builder/StepPicker'
import StepCustomize from '@/components/builder/StepCustomize'
import StepMessage from '@/components/builder/StepMessage'
import StepShare from '@/components/builder/StepShare'
import LivePreview from '@/components/builder/LivePreview'

/** Default content structure for each gift type */
const DEFAULT_CONTENT: Record<GiftType, GiftItemContent> = {
  flower: { styles: [], note: '' },
  sweets: { types: [], message: '' },
  teddy: { holdings: [], message: '' },
  magical: { types: [], message: '' },
  letter: { styles: [], text: '', inkColor: 'black' },
  memory: { layouts: [], title: '' },
}

/** Step indicator configuration */
const STEPS = [
  { label: 'Pick', icon: 'gift' },
  { label: 'Customize', icon: 'sparkle' },
  { label: 'Message', icon: 'letter' },
  { label: 'Share', icon: 'send' },
] as const

type StepIconType = 'gift' | 'sparkle' | 'letter' | 'send'

interface StepIconProps {
  type: StepIconType
  active?: boolean
}

/**
 * Icon component for step indicators.
 * Changes color based on active state.
 */
function StepIcon({ type, active }: StepIconProps) {
  const color = active ? 'white' : '#7a5560'
  const icons: Record<StepIconType, ReactElement> = {
    gift: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <rect x="3" y="9" width="14" height="9" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
        <rect x="2" y="6" width="16" height="4" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M10 6 L10 18" stroke={color} strokeWidth="1.5" />
        <path d="M6 6 Q10 2 10 6" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M14 6 Q10 2 10 6" stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    sparkle: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <path d="M10 2 L11.5 8 L18 10 L11.5 12 L10 18 L8.5 12 L2 10 L8.5 8 Z" stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    letter: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M2 6 L10 12 L18 6" stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    send: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <path d="M2 10 L18 2 L14 18 L10 12 Z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M10 12 L18 2" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
  }
  return icons[type] || null
}

/**
 * Main gift builder page component.
 * Manages the multi-step wizard state and gift creation flow.
 */
export default function BuildPage() {
  // Wizard step state
  const [step, setStep] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<GiftType[]>([])
  const [items, setItems] = useState<BuilderGiftItem[]>([])

  // Gift metadata state
  const [toName, setToName] = useState('')
  const [fromName, setFromName] = useState('')
  const [message, setMessage] = useState('')

  // Generation state
  const [giftLink, setGiftLink] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Mobile/tablet preview toggle state
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  /**
   * Toggle gift type selection.
   * Clicking an already selected type removes it, otherwise adds it.
   */
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

  /** Update a gift item's content by ID */
  const updateItem = useCallback((id: string, content: GiftItemContent) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, content } : item)))
  }, [])

  /** Update a gift item's photos and captions by ID */
  const updatePhotos = useCallback((id: string, photos: File[], captions: string[]) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, photos, photoCaptions: captions } : item))
  }, [])

  /** Remove a gift item by ID */
  const removeItem = useCallback((id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSelectedTypes((prev) => prev.filter((t) => t !== item.type))
  }, [items])

  /**
   * Generate the gift link by creating the gift in the database.
   * Uploads any photos for memory items after gift creation.
   */
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const itemsToSend = items.map((item) => ({ type: item.type, content: item.content }))
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromName, toName, message, items: itemsToSend }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to create gift')

      if (data.id) {
        // Upload photos for memory items
        for (const item of items) {
          if (item.type === 'memory' && item.photos && item.photos.length > 0) {
            for (let i = 0; i < item.photos.length; i++) {
              const formData = new FormData()
              formData.append('file', item.photos[i])
              formData.append('giftId', data.id)
              formData.append('caption', item.photoCaptions?.[i] || '')
              formData.append('position', String(i))

              const photoResponse = await fetch('/api/photos', { method: 'POST', body: formData })
              if (!photoResponse.ok) {
                const errorData = await photoResponse.json()
                throw new Error(`Failed to upload photo: ${errorData.error}`)
              }
            }
          }
        }
        setGiftLink(`${window.location.origin}/gift/${data.id}`)
      } else if (data.error) {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error generating gift:', error)
      alert(`Error creating gift: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }, [items, fromName, toName, message])

  /**
   * Check if the user can proceed to the next step.
   * Each step has different validation requirements.
   */
  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return items.length > 0
      case 1: {
        if (items.length === 0) return false
        return items.every((item) => {
          const c = item.content || {}
          switch (item.type) {
            case 'flower': return (c.styles as string[] || []).length > 0
            case 'sweets': return (c.types as string[] || []).length > 0
            case 'teddy': return (c.holdings as string[] || []).length > 0
            case 'magical': return (c.types as string[] || []).length > 0
            case 'letter': return (c.styles as string[] || []).length > 0
            case 'memory': return (c.layouts as string[] || []).length > 0 && (item.photos || []).length > 0
            default: return true
          }
        })
      }
      case 2:
        return toName.trim() !== '' && fromName.trim() !== ''
      default:
        return true
    }
  }, [step, items, toName, fromName])

  return (
    /* ── Mobile/tablet: min-h-screen scrollable; Desktop: fixed h-screen ── */
    <main className="min-h-screen lg:h-screen bg-cream flex flex-col">

      {/* Navigation bar */}
      <nav className="bg-cream/90 backdrop-blur-md border-b border-rose/10 flex-shrink-0">
        <div className="flex items-center px-3 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 group-hover:rotate-12 transition-transform">
              <path d="M12 2C8 2 4 6 4 12c0 4 4 10 8 10s8-6 8-10c0-6-4-10-8-10z" fill="#8b2a3e" />
            </svg>
            <span className="font-[family-name:var(--font-playfair)] text-xl italic text-rose">
              Digital Gifts
            </span>
          </Link>
        </div>
      </nav>

      {/* Step indicator */}
      <div className="flex items-center justify-center py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-white rounded-full shadow-md">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <motion.div
                animate={{ scale: i === step ? 1 : 0.95 }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-sm
                  transition-all duration-300 cursor-pointer
                  ${i === step
                    ? 'text-white shadow-lg'
                    : i < step ? 'bg-sage/40 text-text' : 'bg-transparent text-text-muted'
                  }`}
                style={i === step ? { backgroundColor: '#8b2a3e', boxShadow: '0 4px 12px rgba(139,42,62,0.3)' } : {}}
                onClick={() => {
                  if (i < step && !giftLink && !isGenerating) setStep(i)
                }}
              >
                {i < step ? (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="#6b9b5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <StepIcon type={s.icon} active={i === step} />
                )}
                <span className="hidden sm:inline font-[family-name:var(--font-dm-sans)] font-medium text-sm">
                  {s.label}
                </span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className="mx-0.5 sm:mx-2">
                  <div className={`w-3 sm:w-6 h-0.5 rounded-full transition-colors ${i < step ? 'bg-sage' : 'bg-blush/20'}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column on desktop, stacked on mobile/tablet ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 px-3 sm:px-4 lg:px-6 pb-4 gap-4 lg:gap-6">

        {/* Left panel - wizard steps */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 lg:h-[calc(100vh-10rem)]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <StepPicker selectedTypes={selectedTypes} onToggle={toggleType} />
                )}
                {step === 1 && (
                  <StepCustomize
                    items={items}
                    onUpdateItem={updateItem}
                    onUpdatePhotos={updatePhotos}
                    onRemoveItem={removeItem}
                    toName={toName}
                    fromName={fromName}
                  />
                )}
                {step === 2 && (
                  <StepMessage
                    toName={toName}
                    fromName={fromName}
                    message={message}
                    onToNameChange={setToName}
                    onFromNameChange={setFromName}
                    onMessageChange={setMessage}
                  />
                )}
                {step === 3 && (
                  <StepShare
                    giftLink={giftLink}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          {step < 3 && (
            <div className="flex gap-3 pt-3 flex-shrink-0 border-t border-rose/10 flex-wrap items-center">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              )}
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                {step === 2 ? 'Review & Share' : 'Next'}
              </Button>

              {/* Preview toggle — only visible on mobile/tablet */}
              <button
                className="lg:hidden ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-rose/30 text-rose font-[family-name:var(--font-dm-sans)] transition-colors hover:bg-rose/5"
                onClick={() => setShowMobilePreview((v) => !v)}
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2" fill="currentColor" />
                </svg>
                {showMobilePreview ? 'Hide Preview' : 'Live Preview'}
              </button>
            </div>
          )}

          {/* Preview toggle for step 3 (no nav buttons row) */}
          {step === 3 && (
            <div className="lg:hidden pt-3 flex-shrink-0 border-t border-rose/10">
              <button
                className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-rose/30 text-rose font-[family-name:var(--font-dm-sans)] transition-colors hover:bg-rose/5"
                onClick={() => setShowMobilePreview((v) => !v)}
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2" fill="currentColor" />
                </svg>
                {showMobilePreview ? 'Hide Preview' : 'Show Live Preview'}
              </button>
            </div>
          )}
        </div>

        {/* Right panel - live preview
            Desktop: always visible (lg:flex)
            Mobile/tablet: toggled via showMobilePreview */}
        <div
          className={`w-full lg:w-1/2 flex-col min-h-0 lg:h-[calc(100vh-10rem)]
            ${showMobilePreview ? 'flex' : 'hidden'} lg:flex`}
        >
          <LivePreview
            items={items}
            toName={toName}
            fromName={fromName}
            message={message}
          />
        </div>
      </div>
    </main>
  )
}