// Masonry archive grid with category filter tabs. Manages modal state.
// Edit CATS/CAT_LABELS to change filter options.
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ArchiveModal from './ArchiveModal';
import type { ArchiveItem } from '@/lib/instagram';

const CATS = ['all', 'vintage', 'moodboard', 'popculture'] as const;
const CAT_LABELS: Record<string, string> = {
  all: 'All',
  vintage: 'Vintage',
  moodboard: 'Mood Boards',
  writing: 'Writing',
  popculture: 'Pop Culture',
};

type Props = { items: ArchiveItem[] };

export default function ArchiveGrid({ items }: Props) {
  const [cat, setCat] = useState<string>('all');
  const [modal, setModal] = useState<ArchiveItem | null>(null);

  const filtered = cat === 'all' ? items : items.filter((i) => i.cat === cat);

  return (
    <>
      <div id="archive">
        <div className="section-label">§ Archive · Browse the Folder</div>
        <section className="archive-section">
          <div className="filter-bar">
            {CATS.map((c) => (
              <button
                key={c}
                className={`filter-btn${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
              >
                {CAT_LABELS[c]}
              </button>
            ))}
          </div>

          <motion.div
            className="archive-grid"
            key={cat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((item, idx) => (
              <ArchiveCard key={item.id} item={item} idx={idx} onClick={setModal} />
            ))}
          </motion.div>
        </section>
      </div>

      <ArchiveModal item={modal} onClose={() => setModal(null)} />
    </>
  );
}

function ArchiveCard({
  item,
  idx,
  onClick,
}: {
  item: ArchiveItem;
  idx: number;
  onClick: (item: ArchiveItem) => void;
}) {
  return (
    <motion.div
      className="archive-item"
      onClick={() => onClick(item)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (idx % 4) * 0.1 }}
    >
      <Image
        src={item.image}
        alt={item.title}
        width={600}
        height={600}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        loading="lazy"
      />
      <div className="item-overlay">
        <div className="item-overlay-title">{item.title}</div>
        <div className="item-overlay-tag">{item.tag} · {item.era}</div>
      </div>
    </motion.div>
  );
}
