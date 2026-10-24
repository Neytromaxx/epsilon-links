// Link kinds of a profile: how a value from the JSON file is checked, turned into an href and shown.

export const LINK_TYPES = [
  'phone',
  'whatsapp',
  'telegram',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'website',
  'map',
  'email',
  'download',
  'link',
] as const

export type LinkType = (typeof LINK_TYPES)[number]

const UZ_PHONE = /^\+998\d{9}$/
const SHORT_NUMBER = /^\d{3,5}$/
const INTERNATIONAL_PHONE = /^\+\d{8,15}$/
const TELEGRAM_USERNAME = /^[A-Za-z][A-Za-z0-9_]{4,31}$/
const INSTAGRAM_USERNAME = /^[A-Za-z0-9._]{1,30}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const URL_HOSTS: Partial<Record<LinkType, readonly string[]>> = {
  telegram: ['t.me', 'telegram.me'],
  instagram: ['instagram.com', 'www.instagram.com'],
  facebook: ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com'],
  youtube: ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
}

function httpsUrl(value: string): URL | null {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.includes('.') ? url : null
  } catch {
    return null
  }
}

function urlOnHost(type: LinkType, value: string): boolean {
  const url = httpsUrl(value)
  const hosts = URL_HOSTS[type]
  return url !== null && (hosts === undefined || hosts.includes(url.hostname))
}

/** Why the value does not fit its type, or null when it is fine. */
export function linkProblem(type: LinkType, raw: string): string | null {
  const value = raw.trim()
  switch (type) {
    case 'phone':
      return UZ_PHONE.test(value) || SHORT_NUMBER.test(value)
        ? null
        : 'phone: +998XXXXXXXXX or a 3–5 digit short number'
    case 'whatsapp':
      return INTERNATIONAL_PHONE.test(value) ? null : 'whatsapp: a number like +998901234567'
    case 'telegram':
      return TELEGRAM_USERNAME.test(value.replace(/^@/, '')) || urlOnHost(type, value)
        ? null
        : 'telegram: a username (5–32 characters) or a https://t.me/... link'
    case 'instagram':
      return INSTAGRAM_USERNAME.test(value.replace(/^@/, '')) || urlOnHost(type, value)
        ? null
        : 'instagram: a username or a https://instagram.com/... link'
    case 'facebook':
    case 'youtube':
    case 'tiktok':
      return urlOnHost(type, value) ? null : `${type}: a https:// link to ${URL_HOSTS[type]?.[0]}`
    case 'email':
      return EMAIL.test(value) ? null : 'email: an address like info@example.uz'
    case 'website':
    case 'map':
    case 'download':
    case 'link':
      return httpsUrl(value) ? null : `${type}: a https:// link`
  }
}

/** The href of a valid value (see linkProblem). */
export function linkHref(type: LinkType, raw: string): string {
  const value = raw.trim()
  switch (type) {
    case 'phone':
      return `tel:${value}`
    case 'whatsapp':
      return `https://wa.me/${value.slice(1)}`
    case 'telegram':
      return httpsUrl(value) ? value : `https://t.me/${value.replace(/^@/, '')}`
    case 'instagram':
      return httpsUrl(value) ? value : `https://instagram.com/${value.replace(/^@/, '')}`
    case 'email':
      return `mailto:${value}`
    default:
      return value
  }
}

/** A short text under the label: the number or the username, when that helps. */
export function linkDetail(type: LinkType, raw: string): string | null {
  const value = raw.trim()
  switch (type) {
    case 'phone':
    case 'whatsapp':
      return formatPhone(value)
    case 'telegram':
    case 'instagram':
      return httpsUrl(value) ? null : `@${value.replace(/^@/, '')}`
    case 'email':
      return value
    default:
      return null
  }
}

/** +998901234567 → +998 90 123 45 67; short and foreign numbers stay as they are. */
export function formatPhone(value: string): string {
  const match = /^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(value)
  return match ? `+998 ${match.slice(1).join(' ')}` : value
}
