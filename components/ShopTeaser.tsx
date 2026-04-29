// Minimal shop teaser — intentionally quiet. No button, no form.
// Edit COPY to change the text.
'use client';

import { motion } from 'framer-motion';

const COPY = {
  main: 'something is coming.',
  sub: 'thelifefolder.com — open the folder.',
};

export default function ShopTeaser() {
  return (
    <motion.div
      className="shop-teaser"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="shop-teaser-text">{COPY.main}</div>
      <div className="shop-teaser-sub">
        <a href="https://thelifefolder.com" target="_blank" rel="noopener noreferrer">{COPY.sub}</a>
      </div>
    </motion.div>
  );
}
