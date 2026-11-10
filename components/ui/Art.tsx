/**
 * Illustration image. The illustrations are small flat SVGs, so they skip the image optimizer.
 */

import Image from 'next/image'

interface ArtProps {
  src: string
  alt: string
  size?: number
  className?: string
  priority?: boolean
}

export default function Art({ src, alt, size = 200, className = '', priority }: ArtProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      priority={priority}
      draggable={false}
      className={`select-none ${className}`}
    />
  )
}
