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

export async function getArchivePosts(): Promise<ArchiveItem[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    console.log('No Instagram token — using fallback data');
    return fallbackArchive as ArchiveItem[];
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Instagram API ${res.status}`);

    const data = await res.json();

    return (data.data as any[]).map((post) => ({
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
  } catch (error) {
    console.error('Instagram fetch failed — using fallback:', error);
    return fallbackArchive as ArchiveItem[];
  }
}

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
