// @ts-check
import { defineConfig } from 'astro/config'

import { siteUrl } from './src/lib/site.ts'

export default defineConfig({
  site: siteUrl(process.env),
  // Pages are plain HTML: no client-side JavaScript framework, fast on slow mobile networks.
  output: 'static',
  trailingSlash: 'ignore',
})
