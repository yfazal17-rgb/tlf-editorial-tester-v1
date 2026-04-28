// Hero section with large typographic statement and stats counter.
// Edit HERO_COPY to change the headline, eyebrow, or tagline.
'use client';

import { motion } from 'framer-motion';

const HERO_COPY = {
  eyebrow: 'Est. 2024 · Personal Archive · Becoming a Brand',
  tagline: 'everything that matters, filed.',
};

type Props = { archiveCount: number; essayCount: number };

export default function Hero({ archiveCount, essayCount }: Props) {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: 'easeOut' as const },
  });

  return (
    <section className="hero" id="top">
      <div className="hero-left">
        <motion.div className="hero-eyebrow" {...fade(0)}>
          {HERO_COPY.eyebrow}
        </motion.div>

        <motion.h1 className="hero-title" {...fade(0.15)}>
          The<br /><em>Life</em><br />Folder
        </motion.h1>

        <motion.p className="hero-sub" {...fade(0.3)}>
          {HERO_COPY.tagline}
        </motion.p>
      </div>

      <motion.div
        className="hero-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="hero-logo-wrap">
          {/* TLF wordmark — replace with <Image> if a logo file is added to /public/images/ */}
          <span style={{
            fontFamily: 'var(--cond)',
            fontSize: '80px',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}>
            TLF
          </span>
        </div>

        <div className="hero-index">
          <strong>{archiveCount}</strong>
          items filed
          <br /><br />
          <strong>{essayCount}</strong>
          texts written
        </div>
      </motion.div>
    </section>
  );
}
