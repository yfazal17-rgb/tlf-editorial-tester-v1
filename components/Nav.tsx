// Sticky navigation bar. Edit NAV_LINKS to change nav items.
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Archive', href: '/#archive' },
  { label: 'Manifesto', href: '/#manifesto' },
  { label: 'Writing', href: '/#writings' },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
          <Image
            src="/images/tlf-logo.png"
            alt="TLF"
            width={28}
            height={28}
            className="nav-logo-img"
            priority
          />
          <span className="nav-wordmark">TheLifeFolder</span>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <button
          className="nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
