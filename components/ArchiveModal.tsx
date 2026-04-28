// Right-side drawer modal for archive item detail. Closes on Escape or backdrop click.
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { ArchiveItem } from '@/lib/instagram';

const CAT_LABELS: Record<string, string> = {
  all: 'All',
  vintage: 'Vintage',
  moodboard: 'Mood Boards',
  writing: 'Writing',
  popculture: 'Pop Culture',
};

type Props = { item: ArchiveItem | null; onClose: () => void };

export default function ArchiveModal({ item, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (item) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-header-label">{item.tag} · TLF Archive</span>
              <button className="modal-close" onClick={onClose}>Close ✕</button>
            </div>

            <div className="modal-body">
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', marginBottom: 32 }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="640px"
                />
              </div>

              <div className="modal-tag">{item.tag}</div>
              <div className="modal-title">{item.title}</div>
              <div className="modal-divider" />
              <div className="modal-desc">{item.desc}</div>

              <div className="modal-meta">
                <div>
                  <div className="modal-meta-label">Era</div>
                  <div className="modal-meta-val">{item.era}</div>
                </div>
                <div>
                  <div className="modal-meta-label">Medium</div>
                  <div className="modal-meta-val">{item.medium}</div>
                </div>
                <div>
                  <div className="modal-meta-label">Category</div>
                  <div className="modal-meta-val">{CAT_LABELS[item.cat] ?? item.cat}</div>
                </div>
                <div>
                  <div className="modal-meta-label">Filed by</div>
                  <div className="modal-meta-val">TLF</div>
                </div>
              </div>

              {item.iglink && (
                <a
                  className="modal-ig-btn"
                  href={item.iglink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Instagram ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
