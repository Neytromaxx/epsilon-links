import { describe, expect, it } from 'vitest'

import { formatPhone, linkDetail, linkHref, linkProblem, type LinkType } from './links'

describe('links', () => {
  const valid: [LinkType, string, string][] = [
    ['phone', '+998901234567', 'tel:+998901234567'],
    ['phone', '1133', 'tel:1133'],
    ['whatsapp', '+998901234567', 'https://wa.me/998901234567'],
    ['telegram', 'epsilon_taxi', 'https://t.me/epsilon_taxi'],
    ['telegram', '@epsilon_taxi', 'https://t.me/epsilon_taxi'],
    ['telegram', 'https://t.me/+AbCdEf123', 'https://t.me/+AbCdEf123'],
    ['instagram', 'epsilon.taxi', 'https://instagram.com/epsilon.taxi'],
    ['facebook', 'https://www.facebook.com/epsilon', 'https://www.facebook.com/epsilon'],
    ['youtube', 'https://youtu.be/abc', 'https://youtu.be/abc'],
    ['tiktok', 'https://www.tiktok.com/@epsilon', 'https://www.tiktok.com/@epsilon'],
    ['email', 'info@epsilon.uz', 'mailto:info@epsilon.uz'],
    ['map', 'https://yandex.uz/maps/-/CDabc', 'https://yandex.uz/maps/-/CDabc'],
    ['download', 'https://example.uz/app.apk', 'https://example.uz/app.apk'],
  ]

  it.each(valid)('%s %s → %s', (type, value, href) => {
    expect(linkProblem(type, value)).toBeNull()
    expect(linkHref(type, value)).toBe(href)
  })

  it.each([
    ['phone', '901234567'],
    ['phone', '+99890123456'],
    ['whatsapp', '1133'],
    ['telegram', 'abc'],
    ['telegram', 'https://evil.example/t.me'],
    ['instagram', 'https://instagram.evil.uz/x'],
    ['facebook', 'epsilon'],
    ['website', 'http://epsilon.uz'],
    ['link', 'javascript:alert(1)'],
    ['email', 'info@'],
  ] as [LinkType, string][])('refuses %s %s', (type, value) => {
    expect(linkProblem(type, value)).toMatch(new RegExp(`^${type}:`))
  })

  it('shows numbers and usernames under the label', () => {
    expect(formatPhone('+998901234567')).toBe('+998 90 123 45 67')
    expect(formatPhone('1133')).toBe('1133')
    expect(linkDetail('telegram', 'epsilon_taxi')).toBe('@epsilon_taxi')
    expect(linkDetail('telegram', 'https://t.me/+AbCdEf123')).toBeNull()
    expect(linkDetail('website', 'https://epsilon.uz')).toBeNull()
  })
})
