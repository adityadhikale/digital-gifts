/**
 * The recipient's note: kraft paper with a punched hole, the greeting, the message and the
 * sender's name. Long messages scroll inside the card so the page itself never has to.
 * `compact` is the smaller card tucked in front of the gifts on the reveal scene.
 */

'use client'

interface LetterCardProps {
  message: string
  fromName: string
  toName: string
  compact?: boolean
}

export default function LetterCard({ message, fromName, toName, compact }: LetterCardProps) {
  return (
    <div className="tag-hole relative mx-auto w-full max-w-lg rounded-[1.5rem] border-2 border-ink bg-kraft text-left text-ink shadow-[0_14px_30px_-12px_rgba(20,24,43,0.45)]">
      <div className={compact ? 'px-5 pb-4 pt-9 sm:px-7' : 'max-h-[46dvh] overflow-y-auto px-6 pb-7 pt-12 scroll-y-soft sm:px-9'}>
        <p className={`font-hand leading-tight ${compact ? 'text-3xl' : 'text-4xl'}`}>Dear {toName},</p>
        <p className={`whitespace-pre-wrap font-hand leading-[1.15] ${compact ? 'mt-2 line-clamp-3 text-[1.55rem]' : 'mt-4 text-[1.75rem] sm:text-3xl'}`}>{message}</p>
        {compact && <p className="mt-1 text-xs font-semibold text-ink/60">Tap to read the whole note</p>}
        <p className={`text-right font-hand leading-tight ${compact ? 'mt-4 text-2xl' : 'mt-7 text-3xl'}`}>
          With love,
          <span className={`mt-1 block ${compact ? 'text-4xl' : 'text-5xl'}`}>{fromName}</span>
        </p>
      </div>
    </div>
  )
}
