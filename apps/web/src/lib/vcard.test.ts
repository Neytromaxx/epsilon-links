import { expect, it } from 'vitest'

import { vcard } from './vcard'

it('builds a vCard with escaped text and CRLF lines', () => {
  const card = vcard({
    name: 'Epsilon Taxi',
    organization: 'Epsilon; Oltiariq, Fargʻona',
    phones: ['1133', '+998901234567'],
    note: 'Kecha-yu kunduz\nishlaymiz',
    url: 'https://links.epsilon.uz/epsilon-taxi',
  })
  expect(card.split('\r\n')).toEqual([
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:;Epsilon Taxi;;;',
    'FN:Epsilon Taxi',
    'ORG:Epsilon\\; Oltiariq\\, Fargʻona',
    'TEL;TYPE=VOICE:1133',
    'TEL;TYPE=VOICE:+998901234567',
    'URL:https://links.epsilon.uz/epsilon-taxi',
    'NOTE:Kecha-yu kunduz\\nishlaymiz',
    'END:VCARD',
    '',
  ])
})
