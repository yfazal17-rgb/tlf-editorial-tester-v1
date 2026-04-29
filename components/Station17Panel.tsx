'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { adapter, type Track } from '@/lib/musicAdapter';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Station17Panel() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist]                = useState<Track[]>(() => shuffle(adapter.getTracks()));
  const [currentIdx, setCurrentIdx] = useState(0);
  const albumRowRef = useRef<HTMLDivElement>(null);

  const currentTrack = playlist[currentIdx];

  // Sync external track changes (fires when a real adapter changes track outside the UI)
  useEffect(() => {
    adapter.onTrackChange((track) => {
      const idx = playlist.findIndex(t => t.id === track.id);
      if (idx !== -1) setCurrentIdx(idx);
    });
  }, [playlist]);

  // Scroll active album thumb into view
  useEffect(() => {
    const row = albumRowRef.current;
    if (!row) return;
    const active = row.querySelector<HTMLElement>('.s17-album-thumb--active');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIdx, isOpen]);

  const handlePlayPause = () => {
    if (isPlaying) {
      adapter.pause();
      setIsPlaying(false);
    } else {
      adapter.play();
      setIsPlaying(true);
    }
  };

  const handleSkip = () => {
    const nextIdx = (currentIdx + 1) % playlist.length;
    setCurrentIdx(nextIdx);
    adapter.loadTrack(playlist[nextIdx].id);
    if (isPlaying) adapter.play();
  };

  const handleSelectTrack = (track: Track, idx: number) => {
    setCurrentIdx(idx);
    adapter.loadTrack(track.id);
    setIsPlaying(true);
    adapter.play();
  };

  return (
    <>
      {/* ── Entry pill ── */}
      <motion.button
        className="s17-trigger"
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5, ease: 'easeOut' }}
        aria-label="Open Station 17"
      >
        <span className={`s17-trigger-dot${isPlaying ? ' s17-trigger-dot--live' : ''}`} />
        Station 17
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="s17-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="s17-panel"
              role="dialog"
              aria-label="Station 17 music player"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 38 }}
            >
              {/* Header */}
              <div className="s17-header">
                <span className="s17-header-label">§ Station 17</span>
                <button
                  className="s17-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Station 17"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="s17-body">

                {/* Vinyl */}
                <div className={`s17-vinyl${isPlaying ? ' s17-vinyl--spinning' : ''}`}>
                  <div className="s17-vinyl-label">
                    <Image
                      src={currentTrack.albumArt}
                      alt={currentTrack.title}
                      width={80}
                      height={80}
                      className="s17-vinyl-art"
                    />
                  </div>
                  <div className="s17-vinyl-hole" />
                </div>

                {/* Track info */}
                <div className="s17-track-info">
                  <div className="s17-track-title">{currentTrack.title}</div>
                  <div className="s17-track-artist">{currentTrack.artist}</div>
                </div>

                {/* Controls */}
                <div className="s17-controls">
                  <button
                    className="s17-btn-play"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <rect x="6"  y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    )}
                  </button>

                  <button
                    className="s17-btn-skip"
                    onClick={handleSkip}
                    aria-label="Skip to next track"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <polygon points="5,3 16,12 5,21" />
                      <rect x="17" y="3" width="3" height="18" rx="1" />
                    </svg>
                  </button>
                </div>

                {/* Album row */}
                <div className="s17-album-row" ref={albumRowRef}>
                  {playlist.map((track, idx) => (
                    <button
                      key={track.id}
                      className={`s17-album-thumb${idx === currentIdx ? ' s17-album-thumb--active' : ''}`}
                      onClick={() => handleSelectTrack(track, idx)}
                      aria-label={`Play ${track.title} by ${track.artist}`}
                      aria-pressed={idx === currentIdx}
                    >
                      <Image
                        src={track.albumArt}
                        alt={track.title}
                        width={64}
                        height={64}
                        className="s17-album-img"
                      />
                    </button>
                  ))}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
