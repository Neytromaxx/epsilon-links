// vCard 3.0 for “save contact”: phones keep working even without the page.

export interface Contact {
  name: string
  organization?: string | undefined
  phones: string[]
  note?: string | undefined
  url: string
}

function escape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')
}

export function vcard(contact: Contact): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${escape(contact.name)};;;`,
    `FN:${escape(contact.name)}`,
    ...(contact.organization ? [`ORG:${escape(contact.organization)}`] : []),
    ...contact.phones.map((phone) => `TEL;TYPE=VOICE:${phone}`),
    `URL:${contact.url}`,
    ...(contact.note ? [`NOTE:${escape(contact.note)}`] : []),
    'END:VCARD',
  ]
  return lines.join('\r\n') + '\r\n'
}
