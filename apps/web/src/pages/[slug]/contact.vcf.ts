import type { APIRoute, GetStaticPaths } from 'astro'

import { allProfiles, type Profile } from '../../lib/profiles'
import { profileUrl } from '../../lib/site'
import { vcard } from '../../lib/vcard'

export const getStaticPaths = (async () =>
  (await allProfiles())
    .filter((profile) => profile.data.contact && !profile.data.draft)
    .map((profile) => ({ params: { slug: profile.id }, props: { profile } }))) satisfies GetStaticPaths

export const GET: APIRoute<{ profile: Profile }> = ({ props, site }) => {
  const { contact } = props.profile.data
  const card = vcard({
    name: contact?.name ?? props.profile.data.name,
    organization: contact?.organization,
    phones: contact?.phones ?? [],
    note: contact?.note,
    url: profileUrl(site ?? '', props.profile.id),
  })
  return new Response(card, { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } })
}
