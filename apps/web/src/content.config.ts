// One JSON file in src/content/profiles = one page; the file name is the address (/ilgor-taxi).
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

import { LINK_TYPES, linkProblem } from './lib/links'

const link = z
  .object({
    type: z.enum(LINK_TYPES),
    value: z.string().trim().min(1),
    label: z.string().trim().min(1).max(60).optional(),
    highlight: z.boolean().default(false),
  })
  .superRefine((item, ctx) => {
    const problem = linkProblem(item.type, item.value)
    if (problem) ctx.addIssue({ code: 'custom', message: problem, path: ['value'] })
  })

const phone = z.string().refine((value) => linkProblem('phone', value) === null, 'phone: +998XXXXXXXXX or a short number')

const profiles = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/profiles' }),
  schema: z.object({
    name: z.string().trim().min(1).max(60),
    bio: z.string().trim().max(200).optional(),
    // A square image under public/, at least 256 × 256; without it the initials are shown.
    avatar: z
      .string()
      .regex(/^\/[\w./-]+\.(png|jpe?g|webp|svg)$/, 'avatar: a path under public/, e.g. /avatars/ilgor-taxi.png')
      .optional(),
    links: z.array(link).min(1).max(20),
    // Small round icons under the buttons.
    socials: z.array(link).max(10).default([]),
    // “Save contact” button and /<page>/contact.vcf
    contact: z
      .object({
        name: z.string().trim().min(1).max(60),
        organization: z.string().trim().max(60).optional(),
        phones: z.array(phone).min(1).max(5),
        note: z.string().trim().max(200).optional(),
      })
      .optional(),
    // Sample data: links are not clickable, a notice is shown and search engines skip the page.
    draft: z.boolean().default(false),
    // Shown on the home page.
    listed: z.boolean().default(true),
  }),
})

export const collections = { profiles }
