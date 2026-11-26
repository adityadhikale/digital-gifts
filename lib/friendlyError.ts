/**
 * Turns a raw error into something a person can read.
 *
 * When Supabase is paused or unreachable, the upstream proxy answers with a whole HTML error
 * page (e.g. Cloudflare 521) and supabase-js puts it in `error.message`. Network failures
 * ("fetch failed", ECONNRESET) are just as unhelpful. Both become one short sentence; the
 * raw text should still go to the server log.
 */

export const SERVICE_DOWN_MESSAGE = "We can't reach the gift service right now. Please try again in a few minutes."

const MAX_LENGTH = 160
const HTML = /<\s*(!doctype|html|head|body|div|script)\b/i
const UNREACHABLE = /fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|network|web server is down|timed out|\b5(0[2-4]|2\d)\b/i

export function friendlyError(raw: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const text = typeof raw === 'string' ? raw : raw instanceof Error ? raw.message : ''
  const trimmed = text.trim()
  if (!trimmed) return fallback
  if (HTML.test(trimmed)) return SERVICE_DOWN_MESSAGE
  if (UNREACHABLE.test(trimmed)) return SERVICE_DOWN_MESSAGE
  if (trimmed.length > MAX_LENGTH) return fallback
  return trimmed
}
