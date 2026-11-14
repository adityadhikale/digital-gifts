# Digital Gifts — Handover

Read this first. It says what the app is, what was changed in the redesign, the current state, and what is still open.

## What the app is
Users build a digital gift (flowers, sweets, teddy, magical item, letter, photo memories), add a message, and share a link. The recipient opens the link and "unwraps" it.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 (theme in `app/globals.css`), Framer Motion, Supabase (tables `gifts`, `gift_items`, `gift_photos`; public bucket `digitalgifts-photos`). Env: `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_DOMAIN`, `SUPABASE_SERVICE_ROLE_KEY`.

Git: all work is on branch `redesign/wrapping-counter`. The user committed the redesign as "Redesigning whole UI" (4973609); later edits may be uncommitted, so run `git status`. Do not commit or push unless asked. `.agents/`, `.claude/`, `.codex/` and `skills-lock.json` are installed AI skills (impeccable, emil-kowalski, taste-skill) and are untracked tooling, not app source.

## Do not change (product contract)
- Routes `/`, `/build`, `/gift/[id]`; APIs `POST /api/gifts`, `POST /api/photos` (`app/api/**` untouched).
- `lib/types.ts`, `lib/supabase.ts`, `lib/nanoid.ts` untouched.
- Gift content keys: plural (`styles`, `types`, `holdings`, `layouts`) plus legacy singular (`style`, `type`, `holding`, `layout`). `getSelections()` in `lib/giftCatalog.ts` reads both. The builder writes both. Keep this so old gifts still open.
- `content.arrangement` (0–5) is saved on each item; gifts without it fall back to a seed from the gift id.
- Memory gift: 1–6 photos with optional captions. One item per gift type.
- Step validation lives in `lib/builder.ts` (`missingFor`, `isItemComplete`) and `canProceed` in `app/build/page.tsx`.

## Design direction: "the wrapping counter"
- Cold paper ground `#f4f5ef`, ink navy text `#14182b`, kraft `#e3c9a0`.
- One tissue colour per gift type: flowers pink `#ff8fb8`, sweets butter `#ffd23f`, teddy lilac `#b8a4ff`, magical cobalt `#2f46e6`, letters tomato `#f0452d`, photos mint `#5fd3a6`. Tokens are in `@theme` in `app/globals.css`; type colours/names are in `typeTheme` in `lib/giftCatalog.ts`.
- Fonts: Figtree (display + UI), Caveat (handwritten tag text). Set in `app/layout.tsx`.
- Style: thick navy outlines (`border-2 border-ink`), pill buttons, rounded 1.5–2rem cards. Builder = light; reveal page = dark ink background (recipient at night).
- Signature interaction: the unwrap screen (`components/reveal/UnwrapScreen.tsx`): butter-yellow field, pink gift box with a cobalt ribbon; drag the lid up, or tap / press Enter. Lid pops off, confetti in the app colours. Reduced motion skips it.
- Reveal page is **light and colourful** (the earlier dark navy look was replaced): unwrap = butter, tag screen = pink, gifts scene = paper. Lightbox for photos stays dark on purpose; the photo-strip layout is white with dark captions (user request).

## User's explicit preferences (from feedback)
- Dislikes realistic images; wants flat illustrated style matching the UI.
- Dislikes oversized text and pages that don't fit the screen; keep headings and tiles compact.
- Landing page = hero only plus a minimal footer. The footer has **no background, no line, no icon**: just small centred "Digital Gifts · Built with love". Do not re-add sections, dots or colour bands.
- Logo icon is a gift box (pink box, yellow ribbon and bow). Favicon is the same (`app/icon.svg`). Icon is vertically centred with the text; keep it aligned.
- User wants honest status and short answers.

## File map
- `app/page.tsx` landing; `app/build/page.tsx` wizard shell (state, generate/upload with retry, preview sheet); `app/gift/[id]/page.tsx` reveal.
- `components/builder/`: `StepPicker`, `StepCustomize` (one gift at a time), `OptionTile`, `PhotoPicker` (shrinks photos in-browser via `lib/image.ts`, reorder/caption/remove), `StepMessage` (kraft tag), `StepShare` (progress, inline errors, copy/Share/WhatsApp/Preview), `LivePreview`.
- `components/reveal/`: `UnwrapScreen`, `LetterCard` (kraft tag), `GiftArrangement` (slot layouts; each gift is a free-standing image with a soft tint circle, drop shadow and an always-visible name label; image width factor `0.82` of the slot), `GiftModal` (accessible dialog: coloured header with large image + close button, paper body), `MemoryView` (4 photo layouts + keyboard lightbox).
- `components/ui/`: `Button` (renders Link when `href`), `Field`, `Sheet` (mobile bottom sheet), `Logo` (props `light`, `compact`, `small`, `noIcon`), `Art` (illustration `<Image unoptimized>`).
- `components/landing/HeroStack.tsx` cycling category cards.
- `lib/giftCatalog.ts` image paths, `typeTheme`, `optionLists`, `GIFT_ORDER`, selection helpers. `lib/builder.ts` defaults and validation.

## Images
- The user supplied 31 transparent PNGs (1254px) in `public/illustrations/`. These are the **originals, kept untouched**. Optimised 640px WebP copies are in `public/art/` (1.3 MB total), and `lib/giftCatalog.ts` points at `/art/...webp`.
- `public/illustrations/memories/cat-memories.png` duplicates `categories/cat-memories.png`; ignored.
- To add or replace an image: put the PNG in `public/illustrations/<folder>/`, convert with `sharp` (trim, resize to 640, webp quality 86) into `public/art/`, keep the same filename.
- Earlier SVG illustrations were deleted and replaced by the user's images.
- Open: `public/illustrations/` still ships ~33 MB. Moving it out of `public/` is recommended (user's call; I did not delete their originals).

## Reveal redesign (latest change)
The user later redrew the opening box themselves (SVG lid with a plush bow, dark inner rim, ground shadow) and tightened reveal spacing; those edits are current and not yet re-checked in the browser. The user had asked for the opening animation, gift scene, dialogs and colours to be reworked because the old discs looked off with the new images. All four were redone (see above). Verified on a temporary harness page with fake data (since deleted): unwrap, tag screen, scene, and the cake, teddy, snow globe, letter, photo and flowers dialogs open and close (Escape works). The scene overlap was reduced after the last look and not re-viewed. Not checked on a phone.

## State of verification
Verified in the browser: landing, builder pick/fill steps, mobile preview sheet, reveal flow (unwrap → tag → arrangement → dialogs, keyboard open, Escape, lightbox arrows) using fake data, at 360px, 1280×620 and desktop. `npx tsc --noEmit` and `npx eslint app components lib` passed after the reveal redesign. A production build was **not** re-run since the WebP switch and the reveal redesign.

Not verified: an old pre-redesign gift; tablet width (~768px); builder steps 3–4 on a phone; the reveal on phones and very short screens; the builder preview with the new images; Lighthouse accessibility/performance. A real gift was created by the user locally (`/gift/PZ9QLx79` loaded fine in their dev log).

Known environment issue: creating a gift once failed with `fetch failed / ECONNRESET` from the server to Supabase. That is a network/VPN/antivirus problem, not app code (the host is reachable from curl). The send step now retries safely without duplicating the gift.

## Open work, in order
1. Run `npm run lint`, `npx tsc --noEmit`, `npm run build`. Then test a real gift end to end, and an old gift.
2. View the reveal scene with 1, 3 and 6 gifts after the overlap change; check the builder `LivePreview` (it reuses `ArrangementScene`) with the new images.
3. Check the other pages at ~768px and on a landscape phone.
4. Decide what to do with `public/illustrations/` (see above).
5. Not done from the original plan: impeccable finish review, `DESIGN.md`/`PRODUCT.md`, README screenshots refresh (README structure section was updated), per-gift OG metadata/image.
6. Commit only when the user says so.

## Gotchas
- **Only one `next dev` per project folder, and never `npm run build` while it runs.** All of them share `.next`; two servers (e.g. ports 3000 and 3100) or a build alongside dev corrupt the Turbopack cache (errors: `ENOENT ... build-manifest.json`, "corrupted database", "Unable to write SST file"). This crashed the user's server twice. Fix: stop the server, delete `.next`, start one server. Test in the user's running server instead of starting another. If the dev server says it can't take the lock, delete `.next/dev/lock` and restart.
- In the browser tool, `element.click()` in JS does not trigger Framer Motion `onTap`; use a real click (the `computer` tool) on the element. Screenshots from the browser pane can look cropped/zoomed; trust DOM measurements (`innerWidth`, `scrollWidth`).
- The Windows shell: PowerShell or Git Bash both work; `sed -i` works in Bash.
- `sharp` is available (bundled with Next).
- Heading sizes were deliberately reduced to `text-3xl sm:text-4xl`; the landing h1 uses `clamp(2.25rem,5.6vw,4.25rem)`.
- Framer Motion entrances: `.rise` CSS animation on the landing page; reduced-motion handled globally in `globals.css`.

## Gift journey update (2026-11-14)
- Builder is now five steps: Shop → Choose → Wrap → Note → Send (`app/build/page.tsx`). New `components/builder/StepWrap.tsx`: scene picker, wrapping paper, ribbon, "Try a new arrangement" (moved out of `LivePreview`).
- Wrap choices live in `lib/wrap.ts` and are saved on every item as `content.wrap = { paper, ribbon, scene }` next to `arrangement`. `getWrap()` falls back to pink/cobalt/plain for older gifts (checked with `/gift/PZ9QLx79`).
- Shared visuals: `components/wrap/GiftBox.tsx` (box base + lid, coloured by paper/ribbon; used by the unwrap screen, Wrap step and preview) and `components/wrap/SceneBackdrop.tsx` (5 flat SVG scenes, 500×400).
- Reveal: unwrap (sender's paper/ribbon) → `components/reveal/GiftReveal.tsx`: scene + gifts with the note (`LetterCard compact`) tucked in front; "See your gifts" slides it away, "Read the note again" brings it back. The old `GiftArrangement` default export was replaced by `savedVariant()`.
- Labels use "and" instead of "+" (`naturalList` in `lib/giftCatalog.ts`); gift dialogs are titled by category ("Flowers").
- Landing: floating petals and the hero bob were tried and removed at the user's request ("annoying"). Do not add live/looping background motion to the landing page.
- Gift name labels in `ArrangementScene` render in their own layer above all gift art, capped to their gift's width (long names wrap to two lines) and kept inside the scene, so they no longer hide behind or run into each other.
- Shop look for the builder: striped awning under the header (`.awning` / `.awning-edge` in `globals.css`), items on shelves (`components/shop/Shelf.tsx`: `Shelf`, `ShelfItem`, and `CounterSign` eyebrows "The shop floor / Aisle by aisle / Wrapping counter / Card counter / Checkout"), kraft name tags on tiles, and a basket in the bottom bar (`components/shop/Basket.tsx`, shown from `sm` up on steps 1–2). Buying is only a metaphor: no prices anywhere.
- Reveal note is in normal flow with a negative top margin (no fixed spacer), and the scene is `isolate` so gift labels stay under the note.
- Browser-pane gotcha: the pane sometimes stops painting (0 requestAnimationFrame calls/sec), which freezes Framer Motion (unwrap looks "stuck"). Taking a screenshot wakes it. Not an app bug.

## Revisions after user feedback (2026-11-14, later)
Supersedes the scene/awning/shelf notes above:
- **Scenery removed.** No scene picker; `SceneBackdrop` deleted. `content.wrap` is now `{ paper, ribbon }` (older saved `scene` values are ignored). Arrangement sits on a plain paper backdrop (`components/wrap/Backdrop.tsx`).
- **Awning, shelves, kraft name tags and counter badges removed** (user disliked them). `components/shop/Shelf.tsx` deleted; only `components/shop/Basket.tsx` remains (bottom bar, `sm` and up, steps 1–2).
- Item tiles (`StepPicker`, `OptionTile`) are product cards in the gift-dialog style: tissue-colour (or white) image area, `border-t-2 border-ink` paper label strip, one thick ink outline, check/plus badge top-right, ink ring when picked.
- Reveal note has a round × close button on its top-right corner (closes the note like "See your gifts").
- Scene labels are short: category name + a count badge when more than one thing is picked ("Flowers 5"); the full list lives in the dialog and the button's aria-label. `ArrangementScene` takes `showLabels` (on everywhere, including `LivePreview`).
- `GiftModal`: the whole dialog scrolls (header art included) and the × is pinned outside the scroll area; art shrinks with the number of picks. Tested with a worst-case gift (`/gift/-6TFC6H4`, every option picked) at 375×812 and 375×520.
- Global focus ring is navy (`--color-ink`), not cobalt; the user dislikes the blue outline.
- Tapping the reveal note opens it in `GiftModal` (synthetic letter item, `title="A note for you"`); the tucked card no longer scrolls, it clamps the message to 3 lines with "Tap to read the whole note".
- Landing hero art is a gift-shop window (`HeroStack.tsx`): "Gift shop" sign, arched window with an "Open" tag, and a window display inside (featured gift on a white pedestal, the previous/next gifts on the floor either side, backdrop in the featured gift's tissue colour, kraft "for someone you love" label), kraft sill. The old card stack was removed because it clashed with the window. Hero CTA says "Start shopping". The tag pill uses one-word category names so it fits at 220px.
- `h1–h4` and `p` wrap rules live in `@layer base` in `globals.css`. Unlayered, `p { text-wrap: pretty }` silently overrode Tailwind's `whitespace-nowrap` (text-wrap sets the wrap mode too). Keep them layered.
- Builder action bar: `fixed` to the bottom on phones/tablets (`lg:sticky` on desktop). Preview on the left; Back and Next grouped on the right for right-thumb reach; the phone hint sits inside the bar above the buttons. `main` has bottom padding below `lg` so the bar never covers content.
