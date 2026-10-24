# Epsilon Links — Claude Code guide

A link-in-bio site like taplinks.cc: one page per project or person with all of its links, printed as a
QR code. First page: Epsilon Taxi (sister repo `Neytromaxx/t51`). Repo: `Neytromaxx/epsilon-links`.

**Read before any change:** `README.md`, `docs/DECISIONS.md` (L-xxx), `docs/BACKLOG.md`.

## Layout

| Path | What |
|---|---|
| `apps/web/` | Astro 7 static site (Node 24, own `package.json` and lockfile; Vercel Root Directory) |
| `apps/web/src/content/profiles/*.json` | One file = one page; the file name is the address. Schema in `src/content.config.ts` |
| `apps/web/src/lib/` | Pure logic: `links.ts` (link rules), `qr.ts`, `vcard.ts`, `site.ts` (production URL), `profiles.ts` |
| `apps/web/src/pages/` | `/`, `/[slug]`, `/[slug]/qr`, `qr.svg`, `qr.png`, `contact.vcf`, `404` |
| `apps/web/src/texts/uz.ts` | Every user-facing string |
| `docs/` | Decisions and backlog (Uzbek) |

## Commands (in `apps/web`)

```bash
npm ci
npm run dev      # http://localhost:4321
npm run check    # astro check + vitest; must be green before every commit
npm run build    # static dist/
```

## Rules

- MVP is frontend only: no backend, accounts, cookies or analytics (L-001, L-009). Ideas go to `docs/BACKLOG.md`.
- Pages are static HTML with no client-side framework; keep JavaScript out of pages unless a feature needs it.
- Every link value is validated by `linkProblem` in `src/lib/links.ts`; a new link type needs a rule,
  an href builder, an icon, a label in `texts/uz.ts` and tests.
- QR codes and vCards use the production URL from `src/lib/site.ts`, never the preview URL: printed
  QR codes cannot change.
- Profiles with `draft: true` hold sample data: never make their links clickable.
- **Language:** code, comments and commit messages in English; docs, README and site text in Uzbek (Latin)
  with `ʻ` (U+02BB) in `oʻ`/`gʻ` and `ʼ` (U+02BC) for the tutuq sign, never ASCII `'`.
- **Dependencies:** exact versions (`npm install --save-exact`), check the licence, give the reason in the
  commit message and `docs/DECISIONS.md`.
- **Secrets:** none are needed; never commit `.env`.

## Git workflow

- Work on a `claude/<topic>` branch; the owner (Neytromaxx) merges into `main`, which Vercel deploys.
- Conventional Commits, authored by Claude, ending with the `Co-Authored-By` trailer.

## Current status

- **MVP:** profile page, QR page with SVG/PNG, vCard, home list, 404; Epsilon Taxi page is a draft
  until the owner sends the real links.
- **Next:** real Epsilon Taxi links and logo, Vercel project, then the final QR files.
