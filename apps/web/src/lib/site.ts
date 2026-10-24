// The public address printed into QR codes. It is fixed here rather than taken from Vercel: Vercel's
// VERCEL_PROJECT_PRODUCTION_URL turned out to be the generated web-eight-liard-78.vercel.app, and a
// printed QR code can never change (L-012). PUBLIC_SITE_URL overrides it for a custom domain.
export const PRODUCTION_SITE = 'https://epsilon-links.vercel.app'

export function siteUrl(env: Record<string, string | undefined>): string {
  const explicit = env.PUBLIC_SITE_URL?.trim()
  return (explicit || PRODUCTION_SITE).replace(/\/+$/, '')
}

export function profileUrl(site: URL | string, slug: string): string {
  return `${String(site).replace(/\/+$/, '')}/${slug}`
}
