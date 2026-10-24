import type { APIRoute, GetStaticPaths } from 'astro'

import { allProfiles } from '../../lib/profiles'
import { qrPng } from '../../lib/qr'
import { profileUrl } from '../../lib/site'

export const getStaticPaths = (async () =>
  (await allProfiles()).map((profile) => ({ params: { slug: profile.id } }))) satisfies GetStaticPaths

export const GET: APIRoute = async ({ params, site }) =>
  new Response(new Uint8Array(await qrPng(profileUrl(site ?? '', params.slug ?? ''))), {
    headers: { 'Content-Type': 'image/png' },
  })
