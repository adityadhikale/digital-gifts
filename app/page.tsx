/**
 * Landing page: the hero and a quiet footer, sized to fit one screen.
 */

import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import HeroStack from '@/components/landing/HeroStack'

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col overflow-x-clip">
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-5 py-4 sm:px-8">
        <Logo />
        <Button href="/build" size="sm" variant="outline" className="hidden sm:inline-flex">Make a gift</Button>
      </header>

      <section className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 items-center gap-8 px-5 py-6 sm:px-8 md:py-0 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div className="rise">
          <h1 className="text-[clamp(2.25rem,5.6vw,4.25rem)] text-ink">
            Send a gift
            <br />
            that <span className="relative inline-block">opens<svg viewBox="0 0 300 18" className="absolute -bottom-1.5 left-0 w-full text-tomato" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12c60-12 140-12 294-2" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" /></svg></span>.
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-soft sm:text-lg">
            Pick flowers, sweets, a teddy, a letter or photos, add a message, and send a link they can open on their phone.
          </p>
          <div className="mt-7">
            <Button href="/build" size="lg" arrow>Make a gift</Button>
          </div>
        </div>

        <div className="rise flex min-h-0 justify-center [animation-delay:150ms]">
          <HeroStack />
        </div>
      </section>

      <footer className="shrink-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-5 py-2">
          <Logo small noIcon />
          <span className="mx-2 text-xs text-ink-faint" aria-hidden="true">·</span>
          <p className="text-xs text-ink-soft">Built with love</p>
        </div>
      </footer>
    </main>
  )
}
