import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';

// Edit ABOUT_COPY to update the About/Manifesto page content.
const ABOUT_COPY = {
  title: 'THE LIFE FOLDER',
  body: `TLF is a folder. Everything we find worth keeping — images, references, ideas, things that hit without explanation — lives here. Filed, not curated. Felt, not explained.

Est. 2024. Everything that matters, filed.`,
};

export default function About() {
  return (
    <>
      <Ticker />
      <Nav />
      <main className="about-page">
        <div className="about-page-inner">
          <div className="about-page-title">{ABOUT_COPY.title}</div>
          <div className="about-page-body" style={{ whiteSpace: 'pre-line' }}>
            {ABOUT_COPY.body}
          </div>
          <div className="about-page-links">
            <a
              className="about-page-link"
              href="https://www.instagram.com/thelifefolder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram — @thelifefolder
            </a>
            <a
              className="about-page-link"
              href="https://thelifefolder.substack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Substack — thelifefolder.substack.com
            </a>
          </div>
          <div className="about-page-est">Est. 2024</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
