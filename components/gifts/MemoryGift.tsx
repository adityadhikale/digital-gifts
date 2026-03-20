'use client'

import { motion } from 'framer-motion'

interface MemoryGiftProps {
  content: {
    layouts?: string[]
    layout?: string
    title?: string
  }
  photos?: { url: string; caption?: string }[]
  reveal?: boolean
}

export default function MemoryGift({ content, photos = [], reveal = false }: MemoryGiftProps) {
  const layouts: string[] = content.layouts || (content.layout ? [content.layout] : ['polaroid wall'])
  const { title = '' } = content

  const placeholderPhotos = photos.length > 0 ? photos : [
    { url: '', caption: 'Moment 1' },
    { url: '', caption: 'Moment 2' },
    { url: '', caption: 'Moment 3' },
  ]

  return (
    <motion.div
      initial={reveal ? { opacity: 0, scale: 0.9 } : false}
      animate={reveal ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-peach/30 to-lavender/20 rounded-2xl p-6 h-full"
    >
      {title && (
        <p className="font-[family-name:var(--font-playfair)] text-text-primary font-semibold text-center mb-4">
          {title}
        </p>
      )}

      {layouts.map((layout, layoutIdx) => (
        <div key={layoutIdx}>
      {layout === 'polaroid wall' && (
        <div className="grid grid-cols-2 gap-3">
          {placeholderPhotos.map((photo, i) => (
            <motion.div
              key={i}
              initial={reveal ? { opacity: 0, rotate: -5 + Math.random() * 10 } : false}
              animate={reveal ? { opacity: 1 } : undefined}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-white p-2 pb-6 shadow-md"
              style={{ transform: `rotate(${-3 + Math.random() * 6}deg)` }}
            >
              <div className="aspect-square bg-gradient-to-br from-light-blush to-lavender/40 rounded-sm flex items-center justify-center overflow-hidden">
                {photo.url ? (
                  <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 opacity-30">
                    <rect x="4" y="8" width="32" height="24" rx="2" stroke="#8a6a72" strokeWidth="1.5" fill="none" />
                    <circle cx="14" cy="17" r="3" stroke="#8a6a72" strokeWidth="1" fill="none" />
                    <path d="M4 28 L14 20 L22 26 L28 22 L36 28" stroke="#8a6a72" strokeWidth="1" fill="none" />
                  </svg>
                )}
              </div>
              {photo.caption && (
                <p className="font-[family-name:var(--font-dancing)] text-text-muted text-xs mt-2 text-center truncate">
                  {photo.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {layout === 'photo strip' && (
        <div className="max-w-[140px] mx-auto bg-white p-2 shadow-md rounded-sm">
          {placeholderPhotos.slice(0, 4).map((photo, i) => (
            <div key={i} className="mb-1 last:mb-0">
              <div className="aspect-[4/3] bg-gradient-to-br from-light-blush to-lavender/40 rounded-sm flex items-center justify-center overflow-hidden">
                {photo.url ? (
                  <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 40 30" fill="none" className="w-6 h-5 opacity-30">
                    <rect x="2" y="2" width="36" height="26" rx="2" stroke="#8a6a72" strokeWidth="1" fill="none" />
                    <circle cx="12" cy="12" r="3" stroke="#8a6a72" strokeWidth="1" fill="none" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === 'scrapbook page' && (
        <div className="bg-[#f5ecd7] rounded-lg p-4 shadow-inner">
          <div className="grid grid-cols-3 gap-2">
            {placeholderPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={reveal ? { opacity: 0, scale: 0.8 } : false}
                animate={reveal ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                className="relative"
              >
                <div className="aspect-square bg-white p-1 shadow-sm rotate-1">
                  <div className="w-full h-full bg-gradient-to-br from-light-blush to-lavender/30 flex items-center justify-center overflow-hidden">
                    {photo.url ? (
                      <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 opacity-30">
                        <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                          <circle cx="10" cy="10" r="6" stroke="#8a6a72" strokeWidth="1" fill="none" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {photo.caption && (
                  <p className="font-[family-name:var(--font-dancing)] text-[10px] text-text-muted text-center mt-1 truncate">
                    {photo.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {layout === 'memory jar' && (
        <div className="text-center">
          <div className="max-w-[160px] mx-auto">
            <svg viewBox="0 0 160 200" fill="none" className="w-full">
              <path d="M45 40 L45 170 Q45 185 80 185 Q115 185 115 170 L115 40" fill="none" stroke="#c4b5e0" strokeWidth="2" />
              <rect x="45" y="40" width="70" height="145" fill="#e8dff5" opacity="0.10" />
              <rect x="40" y="30" width="80" height="14" rx="4" fill="#c4b5e0" opacity="0.5" />
            </svg>
          </div>
          <p className="text-text-muted text-sm mt-2">
            {photos.length > 0 ? `${photos.length} photos` : 'Tap to reveal memories'}
          </p>
        </div>
      )}
        </div>
      ))}

      {!title && !photos.length && (
        <p className="text-text-muted text-sm text-center mt-2">
          Add your favorite memories
        </p>
      )}
    </motion.div>
  )
}
