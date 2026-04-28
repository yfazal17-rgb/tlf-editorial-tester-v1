// Sticky navigation bar. Edit NAV_LINKS to change nav items.
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Archive', href: '/#archive' },
  { label: 'Manifesto', href: '/#manifesto' },
  { label: 'Writing', href: '/#writings' },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  return (
    <motion.nav
      className="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Link href="/" className="nav-logo">
        <span className="nav-wordmark">TheLifeFolder</span>
      </Link>
      <ul className="nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
