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

## Live Instagram posts — two options

The archive auto-falls back to `data/fallback-archive.json` when neither option is configured.

### Option A — Behold.so (recommended, no Meta developer account)

Behold.so is a free service that handles Instagram auth on your behalf.

1. Go to **behold.so** → sign up free
2. Click **"Create a feed"** → connect `@thelifefolder` via Instagram OAuth (their flow, not yours)
3. Copy the **Feed ID** from the dashboard (looks like `abc123xyz`)
4. In `.env.local`: `BEHOLD_FEED_ID=abc123xyz`
5. In Netlify → Environment variables: set `BEHOLD_FEED_ID`

Posts refresh every 24 hours on the free tier. No code changes needed when you post on Instagram.

### Option B — Official Instagram Graph API token

Requires a Meta developer app (more setup, more control, 60-day token).

1. Create a Meta developer app at developers.facebook.com
2. Get a long-lived Instagram Basic Display API token for `@thelifefolder`
3. In `.env.local`: `INSTAGRAM_ACCESS_TOKEN=your_token`
4. In Netlify → Environment variables: set `INSTAGRAM_ACCESS_TOKEN`

Token expires every ~60 days — set a calendar reminder to refresh it.

### Priority order

`INSTAGRAM_ACCESS_TOKEN` → `BEHOLD_FEED_ID` → fallback JSON

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
| Environment variables | `INSTAGRAM_ACCESS_TOKEN` and/or `BEHOLD_FEED_ID` (blank until ready) |

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
