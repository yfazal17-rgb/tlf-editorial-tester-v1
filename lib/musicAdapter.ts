export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
}

export interface MusicAdapter {
  play: () => void;
  pause: () => void;
  skipNext: () => void;
  loadTrack: (trackId: string) => void;
  onTrackChange: (callback: (track: Track) => void) => void;
  getTracks: () => Track[];
}

const mockTracks: Track[] = [
  { id: '1', title: 'Bliss',          artist: 'Toro y Moi',             albumArt: 'https://picsum.photos/seed/tlf1/200' },
  { id: '2', title: 'Slide',          artist: 'Frank Ocean',            albumArt: 'https://picsum.photos/seed/tlf2/200' },
  { id: '3', title: 'Nights',         artist: 'Frank Ocean',            albumArt: 'https://picsum.photos/seed/tlf3/200' },
  { id: '4', title: 'Crew',           artist: 'GoldLink',               albumArt: 'https://picsum.photos/seed/tlf4/200' },
  { id: '5', title: 'Summer Madness', artist: 'Kool & the Gang',        albumArt: 'https://picsum.photos/seed/tlf5/200' },
  { id: '6', title: 'Warm Winds',     artist: 'Unknown Mortal Orchestra', albumArt: 'https://picsum.photos/seed/tlf6/200' },
];

export class MockMusicAdapter implements MusicAdapter {
  private tracks: Track[] = mockTracks;
  private currentIndex = 0;
  private callbacks: ((track: Track) => void)[] = [];

  getTracks(): Track[] {
    return this.tracks;
  }

  play(): void {
    console.log('[Station17] play:', this.tracks[this.currentIndex].title);
  }

  pause(): void {
    console.log('[Station17] pause');
  }

  skipNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    this.callbacks.forEach(cb => cb(this.tracks[this.currentIndex]));
    console.log('[Station17] skip →', this.tracks[this.currentIndex].title);
  }

  loadTrack(trackId: string): void {
    const idx = this.tracks.findIndex(t => t.id === trackId);
    if (idx !== -1) {
      this.currentIndex = idx;
      this.callbacks.forEach(cb => cb(this.tracks[idx]));
      console.log('[Station17] load:', this.tracks[idx].title);
    }
  }

  onTrackChange(callback: (track: Track) => void): void {
    this.callbacks.push(callback);
  }
}

// Swap this singleton for a real adapter when the music host is confirmed.
// Nothing outside this file should import the implementation class.
export const adapter: MusicAdapter = new MockMusicAdapter();
