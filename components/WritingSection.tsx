// List of essays linking to Substack. Each row fades up on scroll.
'use client';

import { motion } from 'framer-motion';
import type { Essay } from '@/lib/substack';

type Props = { essays: Essay[] };

export default function WritingSection({ essays }: Props) {
  return (
    <div id="writings">
      <div className="section-label">§ Writing · Filed Texts</div>
      <section className="writings-section">
        {essays.map((w, idx) => (
          <motion.a
            key={w.id}
            className="writing-item"
            href={w.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <div className="writing-num">{w.num}</div>
            <div className="writing-title">
              {w.title}
              {w.sub && <span>{w.sub}</span>}
            </div>
            <div className="writing-tag">
              {w.tag}<br />{w.date}
            </div>
          </motion.a>
        ))}
      </section>
    </div>
  );
}
