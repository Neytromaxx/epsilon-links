import { expect, it } from 'vitest'

import { profileUrl, siteUrl } from './site'

it('prefers PUBLIC_SITE_URL, then the Vercel production domain', () => {
  expect(siteUrl({ PUBLIC_SITE_URL: 'https://links.epsilon.uz/', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' })).toBe(
    'https://links.epsilon.uz',
  )
  expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'epsilon-links.vercel.app', VERCEL_URL: 'preview-1.vercel.app' })).toBe(
    'https://epsilon-links.vercel.app',
  )
  expect(siteUrl({})).toBe('http://localhost:4321')
  expect(profileUrl(new URL('https://epsilon-links.vercel.app'), 'epsilon-taxi')).toBe(
    'https://epsilon-links.vercel.app/epsilon-taxi',
  )
})
