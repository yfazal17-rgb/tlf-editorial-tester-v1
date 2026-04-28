// Two-column manifesto section: left is the why, right is the rules.
// Edit MANIFESTO_COPY to change all text content.
'use client';

import { motion } from 'framer-motion';

const MANIFESTO_COPY = {
  leftHeading: ['What', 'This', 'Is'],
  leftBody: `A folder is just a container. But the life folder is different —
it's the place where you put things that matter before you
know why they matter. The vintage find that shaped your eye.
The campaign image that changed how you understood beauty.
The essay that made you want to make things.

This is that folder. Not a shop. Not a brand yet.
Something more honest than that — a record of becoming.`,
  leftPull: '"Archive first.\nBrand later.\nAlways."',
  rightHeading: ['The', 'Rules'],
  rightBody: [
    'I. Save what moves you, not what performs.',
    'II. The reference is not the thing — it\'s the conversation between things.',
    'III. Vintage is not nostalgia. It is evidence.',
    'IV. A brand is just a point of view, repeated with conviction.',
    'V. The folder stays open. The archive is never finished.',
  ],
};

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Manifesto() {
  return (
    <div id="manifesto">
      <div className="section-label">§ Manifesto · The Why</div>
      <section className="manifesto-section">
        <motion.div
          className="manifesto-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
        >
          <div className="manifesto-heading">
            {MANIFESTO_COPY.leftHeading.map((line, i) => (
              <span key={i}>{line}{i < MANIFESTO_COPY.leftHeading.length - 1 && <br />}</span>
            ))}
          </div>
          <div className="manifesto-text" style={{ whiteSpace: 'pre-line' }}>
            {MANIFESTO_COPY.leftBody}
          </div>
          <div className="manifesto-pull" style={{ whiteSpace: 'pre-line' }}>
            {MANIFESTO_COPY.leftPull}
          </div>
        </motion.div>

        <motion.div
          className="manifesto-right"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ ...fade, visible: { ...fade.visible, transition: { duration: 0.5, delay: 0.1 } } }}
        >
          <div className="manifesto-heading" style={{ color: 'oklch(14% 0.04 148)' }}>
            {MANIFESTO_COPY.rightHeading.map((line, i) => (
              <span key={i}>{line}{i < MANIFESTO_COPY.rightHeading.length - 1 && <br />}</span>
            ))}
          </div>
          <div className="manifesto-text">
            {MANIFESTO_COPY.rightBody.map((rule, i) => (
              <span key={i}>{rule}{i < MANIFESTO_COPY.rightBody.length - 1 && <><br /><br /></>}</span>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
