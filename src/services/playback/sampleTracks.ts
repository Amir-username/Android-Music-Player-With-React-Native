import type { Track } from '@/types';

/**
 * Bundled test tracks (assets/audio/*.mp3 — ~12s synthesized loops).
 * They let you verify the whole playback chain (tap -> audio -> media
 * notification -> background) on a fresh emulator with zero music files.
 * Device scanning supplements these; Phase 2 replaces the temporary
 * library UI with the full metadata-rich library.
 */
const sampleA = require('../../../assets/audio/sample-a.mp3');
const sampleB = require('../../../assets/audio/sample-b.mp3');
const sampleC = require('../../../assets/audio/sample-c.mp3');

const addedAt = '2026-10-07T00:00:00.000Z';

export const SAMPLE_TRACKS: Track[] = [
  {
    id: 'sample-a',
    title: 'Violet Arpeggio',
    artist: 'Offline Music Player',
    album: 'Engine Test Tones',
    durationMs: 12_000,
    uri: sampleA,
    addedAt,
    source: 'sample',
  },
  {
    id: 'sample-b',
    title: 'Midnight Chords',
    artist: 'Offline Music Player',
    album: 'Engine Test Tones',
    durationMs: 12_000,
    uri: sampleB,
    addedAt,
    source: 'sample',
  },
  {
    id: 'sample-c',
    title: 'Neon Pulse',
    artist: 'Offline Music Player',
    album: 'Engine Test Tones',
    durationMs: 12_000,
    uri: sampleC,
    addedAt,
    source: 'sample',
  },
];
