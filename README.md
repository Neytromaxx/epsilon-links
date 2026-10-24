# Epsilon Links

taplinks.cc ga oʻxshash sayt: har bir loyiha yoki inson uchun bitta sahifa, unda barcha tarmoqlardagi havolalar. Sahifa manzili QR kod qilib chop etiladi. Birinchi sahifa — Ilgʻor Taxi: https://epsilon-links.vercel.app/ilgor-taxi

MVP faqat frontend: sahifalar repodagi JSON fayllardan statik HTML boʻlib yigʻiladi va Vercel ga qoʻyiladi. Backend, roʻyxatdan oʻtish va tahrirlash paneli yoʻq ([docs/BACKLOG.md](docs/BACKLOG.md)).

## Tuzilma (monorepo)

| Papka | Nima |
|---|---|
| `apps/web/` | Sayt: Astro 7, statik HTML, mijoz tomonida JavaScript yoʻq |
| `apps/web/src/content/profiles/` | Sahifalar: bitta JSON fayl = bitta sahifa |
| `apps/web/public/` | Rasmlar (avatar, logotip) |
| `docs/` | Qarorlar va backlog |

Keyin kerak boʻlsa, shu yerga `apps/api` (statistika, tahrirlash paneli) qoʻshiladi.

## Sahifalar

| Manzil | Nima |
|---|---|
| `/` | Barcha sahifalar roʻyxati |
| `/<sahifa>` | Havolalar sahifasi, masalan `/ilgor-taxi` |
| `/<sahifa>/qr` | QR kod: koʻrish, SVG va PNG yuklab olish, chop etish |
| `/<sahifa>/qr.svg`, `/<sahifa>/qr.png` | QR fayllari (PNG 1024 × 1024) |
| `/<sahifa>/contact.vcf` | Telefon kontaktlariga saqlash (agar `contact` berilgan boʻlsa) |

QR kod build paytida saytning asosiy manzilidan yasaladi: `https://epsilon-links.vercel.app` (`apps/web/src/lib/site.ts` dagi `PRODUCTION_SITE`). Oʻz domeningiz boʻlsa — Vercel da `PUBLIC_SITE_URL`. Preview deploy larda ham QR asosiy manzilga olib boradi ([L-012](docs/DECISIONS.md)).

## Yangi sahifa qoʻshish yoki tahrirlash

1. `apps/web/src/content/profiles/` ga `<manzil>.json` faylini qoʻshing. Fayl nomi — sahifa manzili: kichik lotin harflari, raqamlar va `-` (masalan `ilgor-taxi.json` → `/ilgor-taxi`).
2. Avatar boʻlsa, kvadrat rasmni (kamida 256 × 256, PNG yoki JPEG) `apps/web/public/avatars/` ga qoʻying.
3. `npm run check` va `npm run build` — xato boʻlsa, qaysi fayl va qaysi maydon notoʻgʻri ekanini aytadi.
4. Commit → Vercel oʻzi yangilaydi.

Misol:

```json
{
  "name": "Ilgʻor Taxi",
  "bio": "Oltiariq va Toshkent boʻylab taksi.",
  "avatar": "/avatars/ilgor-taxi.png",
  "links": [
    { "type": "phone", "value": "+998901234567", "label": "Taksi chaqirish", "highlight": true },
    { "type": "telegram", "value": "epsilon_taxi_bot", "label": "Telegram orqali buyurtma" },
    { "type": "instagram", "value": "epsilon.taxi" },
    { "type": "map", "value": "https://yandex.uz/maps/-/CDabc123", "label": "Ofis manzili" }
  ],
  "socials": [{ "type": "telegram", "value": "epsilon_taxi" }],
  "contact": { "name": "Ilgʻor Taxi", "phones": ["+998901234567"] }
}
```

| Maydon | Majburiy | Nima |
|---|---|---|
| `name` | ha | Sarlavha (60 belgigacha) |
| `bio` | yoʻq | Qisqa tavsif (200 belgigacha), havola koʻrinishida (Telegram) ham chiqadi |
| `avatar` | yoʻq | `public/` ichidagi rasm yoʻli. Boʻlmasa, ism bosh harflari koʻrsatiladi |
| `links` | ha | Katta tugmalar (1–20). `highlight: true` — asosiy tugma (rangli) |
| `socials` | yoʻq | Pastdagi dumaloq ikonkalar |
| `contact` | yoʻq | “Kontaktni saqlash” tugmasi: `name`, `phones`, ixtiyoriy `organization`, `note` |
| `draft` | yoʻq | `true` — namuna: havolalar bosilmaydi, ogohlantirish chiqadi, qidiruv tizimlari indekslamaydi |
| `listed` | yoʻq | `false` — bosh sahifadagi roʻyxatda koʻrinmaydi |

Havola turlari (`type`) va `value`:

| `type` | `value` | Tugma nomi (`label` boʻlmasa) |
|---|---|---|
| `phone` | `+998XXXXXXXXX` yoki qisqa raqam (`1133`) | Qoʻngʻiroq qilish |
| `whatsapp` | `+998XXXXXXXXX` | WhatsApp |
| `telegram` | username (`epsilon_taxi`) yoki `https://t.me/...` | Telegram |
| `instagram` | username yoki `https://instagram.com/...` | Instagram |
| `facebook`, `youtube`, `tiktok` | toʻliq `https://` havola | Facebook, YouTube, TikTok |
| `website` | `https://` havola | Veb-sayt |
| `map` | Yandex yoki Google xarita havolasi | Xaritada koʻrish |
| `email` | `info@example.uz` | E-pochta |
| `download` | fayl havolasi (masalan APK) | Yuklab olish |
| `link` | istalgan `https://` havola | Havola |

Faqat `https://` havolalar qabul qilinadi. Oʻzbekcha matnda `oʻ`, `gʻ` uchun `ʻ` (U+02BB), tutuq belgisi uchun `ʼ` (U+02BC) ishlatiladi.

## Lokal ishga tushirish

Node.js 24 kerak (`apps/web/.nvmrc`).

```bash
cd apps/web
npm ci
npm run dev        # http://localhost:4321/ilgor-taxi
npm run check      # turlar (astro check) va testlar (vitest)
npm run build      # dist/ — Vercel ham shuni qiladi
```

## Vercel

Vercel → **Add New → Project** → `Neytromaxx/epsilon-links` ni import qiling.

| Sozlama | Qiymat |
|---|---|
| Root Directory | `apps/web` |
| Framework Preset | Astro (`vercel.json` da ham yozilgan) |
| Install / Build / Output | `npm ci` / `npm run build` / `dist` |
| Node.js | 24.x (`package.json` → `engines`) |
| Environment Variables | Kerak emas. Oʻz domeningiz ulansa: `PUBLIC_SITE_URL=https://links.epsilon.uz` |

Deploy tugagach, manzilni (masalan `https://epsilon-links.vercel.app/ilgor-taxi`) tekshiring. QR — `/ilgor-taxi/qr` sahifasida.

> QR koddagi manzil keyin oʻzgarmasligi kerak: chop etilgan QR larni qaytarib boʻlmaydi. Oʻz domeningiz boʻlsa, uni ommaviy chop etishdan **oldin** ulang. `vercel.app` manzili ham loyiha oʻchirilmaguncha ishlaydi.

## Qoidalar

- Kod, izohlar va commit xabarlari inglizcha; hujjatlar va sayt matnlari oʻzbekcha (lotin). Sayt matnlari faqat `apps/web/src/texts/uz.ts` da.
- Kutubxonalar aniq versiyada (`--save-exact`, `package-lock.json`).
- Qarorlar — [docs/DECISIONS.md](docs/DECISIONS.md), doiradan tashqari gʻoyalar — [docs/BACKLOG.md](docs/BACKLOG.md).
