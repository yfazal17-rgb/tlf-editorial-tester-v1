import fallbackArchive from '@/data/fallback-archive.json';

export type ArchiveItem = {
  id: number | string;
  title: string;
  tag: string;
  cat: string;
  desc: string;
  era: string;
  medium: string;
  image: string;
  iglink: string;
};

/**
 * Fetch priority:
 *  1. INSTAGRAM_ACCESS_TOKEN  — official Graph API token
 *  2. BEHOLD_FEED_ID          — Behold.so public feed (no Meta developer account needed)
 *  3. Fallback JSON           — data/fallback-archive.json
 *
 * See README.md for setup instructions for each option.
 */
export async function getArchivePosts(): Promise<ArchiveItem[]> {
  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    return fetchViaGraphAPI(process.env.INSTAGRAM_ACCESS_TOKEN);
  }

  if (process.env.BEHOLD_FEED_ID) {
    return fetchViaBehold(process.env.BEHOLD_FEED_ID);
  }

  console.log('No Instagram source configured — using fallback data');
  return fallbackArchive as ArchiveItem[];
}

// ─── Source 1: Official Instagram Graph API ───────────────────────────────────

async function fetchViaGraphAPI(token: string): Promise<ArchiveItem[]> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Instagram Graph API ${res.status}`);

    const { data } = await res.json();

    return (data as any[])
      .filter((p) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM')
      .map((post) => ({
        id: post.id,
        title: extractTitle(post.caption),
        tag: extractTag(post.caption),
        desc: extractDesc(post.caption),
        cat: extractCat(post.caption),
        image: post.media_url,
        iglink: post.permalink,
        era: new Date(post.timestamp).getFullYear().toString(),
        medium: 'Reference',
      }));
  } catch (err) {
    console.error('Instagram Graph API failed — using fallback:', err);
    return fallbackArchive as ArchiveItem[];
  }
}

// ─── Source 2: Behold.so public feed ─────────────────────────────────────────
//
// Setup (2 minutes, no Meta developer account):
//   1. Go to behold.so → sign up free
//   2. "Create a feed" → connect @thelifefolder via Instagram OAuth
//   3. Copy the Feed ID from the dashboard
//   4. Add to .env.local:  BEHOLD_FEED_ID=your_feed_id_here
//   5. Same variable in Netlify environment settings
//
// Behold refreshes posts every 24 hours on the free tier (hourly on paid).
// Public feed endpoint: https://feeds.behold.so/{feedId}

async function fetchViaBehold(feedId: string): Promise<ArchiveItem[]> {
  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Behold.so ${res.status}`);

    // Response shape: { posts: BeholdPost[], username, biography, ... }
    const body: BeholdResponse = await res.json();
    const posts = Array.isArray(body) ? body : (body.posts ?? []);

    return posts
      .filter((p) => p.mediaType === 'IMAGE' || p.mediaType === 'CAROUSEL_ALBUM')
      .map((post, idx) => ({
        id: post.id ?? idx,
        title: extractTitle(post.caption),
        tag: extractTag(post.caption),
        desc: extractDesc(post.caption),
        cat: extractCat(post.caption, post.hashtags),
        // Behold CDN (behold.pictures) for medium-res; Instagram CDN as fallback
        image: post.sizes?.medium?.mediaUrl ?? post.sizes?.large?.mediaUrl ?? post.mediaUrl,
        iglink: post.permalink,
        era: post.timestamp
          ? new Date(post.timestamp).getFullYear().toString()
          : new Date().getFullYear().toString(),
        medium: 'Reference',
      }));
  } catch (err) {
    console.error('Behold.so fetch failed — using fallback:', err);
    return fallbackArchive as ArchiveItem[];
  }
}

type BeholdSize = { mediaUrl: string; width: number; height: number };

type BeholdPost = {
  id: string;
  caption: string;
  prunedCaption?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  hashtags?: string[];
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
    full?: BeholdSize;
  };
};

// Behold wraps the posts array: { posts: BeholdPost[], username, ... }
type BeholdResponse = BeholdPost[] | { posts: BeholdPost[]; [key: string]: unknown };

// ─── Caption parsing helpers ──────────────────────────────────────────────────

function extractTitle(caption: string): string {
  return caption?.split('\n')[0]?.trim() || 'Untitled';
}

function extractTag(caption: string): string {
  const match = caption?.match(/#(\w+)/);
  return match ? match[1] : 'Archive';
}

function extractDesc(caption: string): string {
  const lines = caption?.split('\n').slice(1) ?? [];
  return lines.filter((l) => !l.startsWith('#')).join(' ').trim();
}

// ─── Category classification ───────────────────────────────────────────────────
//
// Priority order:
//   1. Explicit hashtag on the post (#vintage / #moodboard / #popculture)
//   2. Keyword scan of the caption text
//   3. Default → 'all' (shows in All tab only)
//
// To explicitly override a post's category from Instagram, add one of:
//   #vintage  #moodboard  #popculture
// to its caption. Keyword matching handles posts that don't use hashtags.

const CATEGORY_RULES: { cat: string; hashtags: string[]; keywords: string[] }[] = [
  {
    cat: 'vintage',
    hashtags: ['vintage', 'archive', 'retro', 'classic', 'antique', 'thrift', 'foundobject'],
    keywords: [
      'vintage', 'archive', 'retro', 'classic', 'antique', 'thrift', 'found object',
      'old school', 'old-school', 'relic', 'artefact', 'artifact',
      '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s',
    ],
  },
  {
    cat: 'moodboard',
    hashtags: ['moodboard', 'mood', 'aesthetic', 'inspo', 'inspiration', 'vibes'],
    keywords: [
      'moodboard', 'mood board', 'aesthetic', 'atmosphere', 'vibe', 'vibes',
      'texture', 'composition', 'still life', 'colour palette', 'color palette',
    ],
  },
  {
    cat: 'popculture',
    hashtags: [
      'popculture', 'pop', 'culture', 'comics', 'comic', 'film', 'movie', 'music',
      'anime', 'manga', 'games', 'gaming', 'tv', 'series',
    ],
    keywords: [
      // Comics & superheroes
      'comic', 'comics', 'batman', 'marvel', 'dc ', 'dc comics', 'spider-man', 'spiderman',
      'captain america', 'superman', 'graphic novel', 'manga', 'anime',
      // Film & TV
      'film', 'movie', 'director', 'series', 'season', 'episode', 'show', 'cinema',
      'last of us', 'breaking bad', 'sopranos', 'euphoria', 'succession',
      // Music
      'album', 'song', 'track', 'band', 'musician', 'artist', 'concert', 'tour',
      'buckley', 'kendrick', 'kanye', 'tyler', 'rocky', 'asap', 'frank ocean',
      // Games
      'game', 'gaming', 'playstation', 'xbox', 'nintendo', 'ps5', 'ps4',
      // Sports & culture
      'formula 1', 'formula one', 'f1', 'schumacher', 'leclerc',
      'football', 'basketball', 'nba', 'nfl', 'nfl', 'tennis',
      // Art & design
      'illustration', 'artwork', 'art work', 'mazzucchelli', 'mazzuchelli',
    ],
  },
];

function extractCat(caption: string, hashtags?: string[]): string {
  const lower = (caption ?? '').toLowerCase();
  const postTags = (hashtags ?? []).map((t) => t.toLowerCase());

  for (const rule of CATEGORY_RULES) {
    // Check explicit hashtags first (fastest, most reliable)
    if (postTags.some((t) => rule.hashtags.includes(t))) return rule.cat;
    // Fall back to keyword scan of the caption
    if (rule.keywords.some((kw) => lower.includes(kw))) return rule.cat;
  }

  return 'all';
}
