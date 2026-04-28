import { XMLParser } from 'fast-xml-parser';
import fallbackWritings from '@/data/fallback-writings.json';

export type Essay = {
  id: number;
  num: string;
  title: string;
  sub: string;
  tag: string;
  date: string;
  link: string;
};

export async function getEssays(): Promise<Essay[]> {
  try {
    const res = await fetch('https://thelifefolder.substack.com/feed', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Substack RSS ${res.status}`);

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const items: any[] = parsed?.rss?.channel?.item ?? [];
    const itemArray = Array.isArray(items) ? items : [items];

    return itemArray.map((item, idx) => ({
      id: idx + 1,
      num: String(idx + 1).padStart(3, '0'),
      title: item.title ?? 'Untitled',
      sub: stripHtml(item.description ?? ''),
      tag: 'Essay',
      date: formatDate(item.pubDate ?? ''),
      link: item.link ?? 'https://thelifefolder.substack.com',
    }));
  } catch (error) {
    console.error('Substack fetch failed — using fallback:', error);
    return fallbackWritings as Essay[];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim().slice(0, 120);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
