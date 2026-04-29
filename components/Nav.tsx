// Sticky navigation bar. Edit NAV_LINKS to change nav items.
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Archive', href: '/#archive' },
  { label: 'Manifesto', href: '/#manifesto' },
  { label: 'Writing', href: '/#writings' },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Link href="/" className="nav-logo" onClick={close}>
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
          onClick={() => setOpen(true)}
          aria-label="Open menu"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header row — logo left, close right */}
            <div className="mobile-menu-header">
              <Link href="/" className="nav-logo" onClick={close}>
                <Image
                  src="/images/tlf-logo.png"
                  alt="TLF"
                  width={28}
                  height={28}
                  className="nav-logo-img"
                />
                <span className="nav-wordmark">TheLifeFolder</span>
              </Link>
              <button className="mobile-menu-close" onClick={close} aria-label="Close menu">
                ✕
              </button>
            </div>

            {/* Centered nav links */}
            <motion.div
              className="mobile-menu-links"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.25, ease: 'easeOut' }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-menu-link"
                  onClick={close}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
