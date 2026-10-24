// The public address printed into QR codes: it must be the production domain even in previews.

export function siteUrl(env: Record<string, string | undefined>): string {
  const explicit = env.PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel}`
  return 'http://localhost:4321'
}

export function profileUrl(site: URL | string, slug: string): string {
  return `${String(site).replace(/\/+$/, '')}/${slug}`
}
