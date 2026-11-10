/**
 * Shrinks a photo in the browser before upload: phone photos are often 5–10 MB, and the
 * upload endpoint is a serverless function with a small request-size limit.
 * Falls back to the original file whenever the browser can't decode it.
 */

const MAX_EDGE = 1600
const QUALITY = 0.85

export async function shrinkPhoto(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    // Already small enough: keep the original bytes
    if (scale === 1 && file.size < 900_000) { bitmap.close(); return file }
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) { bitmap.close(); return file }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', QUALITY))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

/** Upload ceiling after shrinking, in bytes */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
