import { getCollection, type CollectionEntry } from 'astro:content'

export type Profile = CollectionEntry<'profiles'>

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const RESERVED = new Set(['404', 'qr', 'api', 'favicon', 'robots'])

/** Every profile; a file name that cannot be an address stops the build. */
export async function allProfiles(): Promise<Profile[]> {
  const profiles = await getCollection('profiles')
  for (const profile of profiles) {
    if (!SLUG.test(profile.id) || RESERVED.has(profile.id)) {
      throw new Error(
        `profiles/${profile.id}.json: the file name is the address; use lowercase letters, digits and dashes`,
      )
    }
  }
  return profiles.sort((a, b) => a.data.name.localeCompare(b.data.name))
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
