import { getArchivePosts } from '@/lib/instagram';
import { getEssays } from '@/lib/substack';
import Ticker from '@/components/Ticker';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ArchiveGrid from '@/components/ArchiveGrid';
import Manifesto from '@/components/Manifesto';
import WritingSection from '@/components/WritingSection';
import ShopTeaser from '@/components/ShopTeaser';
import Footer from '@/components/Footer';

export default async function Home() {
  const [archive, essays] = await Promise.all([getArchivePosts(), getEssays()]);

  return (
    <>
      <Ticker />
      <Nav />
      <Hero archiveCount={archive.length} essayCount={essays.length} />
      <ArchiveGrid items={archive} />
      <Manifesto />
      <WritingSection essays={essays} />
      <ShopTeaser />
      <Footer />
    </>
  );
}
