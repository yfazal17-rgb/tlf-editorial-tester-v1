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

    const posts: BeholdPost[] = await res.json();

    return posts
      .filter((p) => p.mediaType === 'IMAGE' || p.mediaType === 'CAROUSEL_ALBUM')
      .map((post, idx) => ({
        id: post.id ?? idx,
        title: extractTitle(post.caption),
        tag: extractTag(post.caption),
        desc: extractDesc(post.caption),
        cat: extractCat(post.caption),
        // Prefer the medium-res thumbnail for performance; fall back to full URL
        image: post.sizes?.medium?.url ?? post.mediaUrl,
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

// Behold.so response shape (documented at behold.so/developers)
type BeholdPost = {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
  prunedAt: string | null;
  sizes?: {
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
};

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

function extractCat(caption: string): string {
  const lower = caption?.toLowerCase() ?? '';
  if (lower.includes('#vintage') || lower.includes('#archive')) return 'vintage';
  if (lower.includes('#moodboard')) return 'moodboard';
  if (lower.includes('#popculture') || lower.includes('#pop')) return 'popculture';
  if (lower.includes('#writing') || lower.includes('#essay')) return 'writing';
  return 'all';
}
