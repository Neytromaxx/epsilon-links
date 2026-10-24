import { expect, it } from 'vitest'

import { PRODUCTION_SITE, profileUrl, siteUrl } from './site'

it('uses the fixed production address unless PUBLIC_SITE_URL is set', () => {
  expect(siteUrl({})).toBe('https://epsilon-links.vercel.app')
  expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'web-eight-liard-78.vercel.app' })).toBe(PRODUCTION_SITE)
  expect(siteUrl({ PUBLIC_SITE_URL: ' https://links.epsilon.uz/ ' })).toBe('https://links.epsilon.uz')
  expect(siteUrl({ PUBLIC_SITE_URL: '' })).toBe(PRODUCTION_SITE)
  expect(profileUrl(new URL(PRODUCTION_SITE), 'ilgor-taxi')).toBe('https://epsilon-links.vercel.app/ilgor-taxi')
})
