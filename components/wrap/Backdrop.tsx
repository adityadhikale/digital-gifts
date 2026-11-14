/** Quiet paper backdrop behind the gift arrangement: a soft circle on paper. Fills its parent. */

export default function Backdrop() {
  return (
    <div className="absolute inset-0 bg-paper" aria-hidden="true">
      <div className="absolute left-1/2 top-[47%] aspect-square w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper-deep" />
      <div className="absolute left-1/2 top-[47%] aspect-square w-[47%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0f1e8]" />
    </div>
  )
}
