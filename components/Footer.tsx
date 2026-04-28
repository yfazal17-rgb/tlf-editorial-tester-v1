// Site footer with brand, nav links, and copyright.
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div>
        <div className="footer-brand">
          <span className="footer-brand-name">TLF</span>
        </div>
        <div className="footer-tagline">everything that matters, filed.</div>
      </div>

      <ul className="footer-links">
        <li><Link href="/#archive">Archive</Link></li>
        <li><Link href="/#manifesto">Manifesto</Link></li>
        <li><Link href="/#writings">Writing</Link></li>
        <li><a href="https://www.instagram.com/thelifefolder" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://thelifefolder.substack.com" target="_blank" rel="noopener noreferrer">Substack</a></li>
      </ul>

      <div className="footer-copy">
        © 2025 TheLifeFolder<br />
        All rights filed.<br />
        Est. 2024
      </div>
    </footer>
  );
}
