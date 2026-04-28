# TheLifeFolder — Editorial Site

Next.js rebuild of [thelifefolder.com](https://thelifefolder.com), deployed at [editorial.thelifefolder.com](https://editorial.thelifefolder.com).

## Dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Design changes

All design tokens live in one place: [`app/globals.css`](app/globals.css) under the `:root` block.  
Change colors, fonts, or spacing there — the entire site updates.

## Content changes

| What | Where |
|------|-------|
| Archive items (fallback) | `data/fallback-archive.json` |
| Essays (fallback) | `data/fallback-writings.json` |
| Ticker text | `components/Ticker.tsx` → `TICKER_ITEMS` |
| Nav links | `components/Nav.tsx` → `NAV_LINKS` |
| Hero copy | `components/Hero.tsx` → `HERO_COPY` |
| Manifesto text | `components/Manifesto.tsx` → `MANIFESTO_COPY` |
| Shop teaser text | `components/ShopTeaser.tsx` → `COPY` |
| About page body | `app/about/page.tsx` → `ABOUT_COPY` |

## Adding the Instagram token

1. Get a long-lived Instagram Graph API token for `@thelifefolder`
2. Open `.env.local` and set: `INSTAGRAM_ACCESS_TOKEN=your_token_here`
3. In Netlify → Site settings → Environment variables → set `INSTAGRAM_ACCESS_TOKEN`
4. The site switches to live data automatically — no code changes needed

Token expires after ~60 days. Refresh via the Instagram API before expiry.

## Essays (Substack)

Essays auto-pull from the public RSS feed at `https://thelifefolder.substack.com/feed` and cached for 1 hour.  
No configuration needed — publish on Substack, it appears on the site within an hour.

If the feed is unreachable, the site falls back to `data/fallback-writings.json`.

## Deployment (Netlify)

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | 18+ |
| Environment variable | `INSTAGRAM_ACCESS_TOKEN` (blank until token ready) |

**Branch:** `editorial`  
After deploying, point DNS: `editorial.thelifefolder.com → Netlify domain`.

## File structure

```
app/
  layout.tsx          — fonts, metadata, root HTML
  page.tsx            — homepage (server component, fetches data)
  globals.css         — ALL design tokens and CSS classes
  about/
    page.tsx          — /about page

components/
  Ticker.tsx          — top marquee
  Nav.tsx             — sticky navigation
  Hero.tsx            — large typographic hero
  ArchiveGrid.tsx     — masonry grid + filter tabs + card component
  ArchiveModal.tsx    — right-side drawer modal
  WritingSection.tsx  — essay list
  Manifesto.tsx       — two-column manifesto section
  ShopTeaser.tsx      — minimal shop teaser
  Footer.tsx          — site footer

lib/
  instagram.ts        — Instagram Graph API fetch with fallback
  substack.ts         — Substack RSS parse with fallback

data/
  fallback-archive.json   — archive items when no IG token
  fallback-writings.json  — essays when Substack is unreachable

public/
  images/             — archive images
```
