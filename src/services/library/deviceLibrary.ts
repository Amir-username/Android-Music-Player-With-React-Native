import type { Track } from '@/types';
import { loadMediaLibrary } from './mediaLibrary';
import type { MediaLibraryModule } from './mediaLibrary';

/** Legacy (classic) Asset shape returned by getAssetsAsync in SDK 57. */
type MediaAsset = Awaited<ReturnType<MediaLibraryModule['getAssetsAsync']>>['assets'][number];

export type LibraryPermission = 'granted' | 'denied';

/**
 * True when the runtime actually contains the media-library native module.
 * When false, the Library screen shows a "scan unavailable" state instead of
 * the permission flow (scanning requires a development build).
 */
export function isDeviceLibraryAvailable(): boolean {
  return loadMediaLibrary() !== null;
}

/** Check permission without prompting. */
export async function checkLibraryPermission(): Promise<boolean> {
  const MediaLibrary = loadMediaLibrary();
  if (!MediaLibrary) return false;
  const { granted } = await MediaLibrary.getPermissionsAsync();
  return granted;
}

/** Prompt the user for audio-library access (Android: READ_MEDIA_AUDIO). */
export async function requestLibraryPermission(): Promise<LibraryPermission> {
  const MediaLibrary = loadMediaLibrary();
  if (!MediaLibrary) return 'denied';
  const current = await MediaLibrary.getPermissionsAsync();
  if (current.granted) return 'granted';
  const request = await MediaLibrary.requestPermissionsAsync();
  return request.granted ? 'granted' : 'denied';
}

/**
 * Scan the device's audio via MediaStore and map it to app Tracks.
 * Minimal Phase 1 metadata: title/artist parsed from the filename.
 * Full ID3/artwork extraction lands in Phase 2.
 */
export async function scanDeviceAudio(): Promise<Track[]> {
  const MediaLibrary = loadMediaLibrary();
  if (!MediaLibrary) return [];

  const assets: MediaAsset[] = [];
  let after: string | undefined;

  do {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.AUDIO,
      first: 200,
      after,
    });
    assets.push(...page.assets);
    after = page.hasNextPage ? page.endCursor : undefined;
  } while (after);

  return assets.map(assetToTrack);
}

function assetToTrack(asset: MediaAsset): Track {
  const { title, artist } = parseFilename(asset.filename);
  return {
    id: asset.id,
    title,
    artist,
    album: '',
    durationMs: Math.round((asset.duration ?? 0) * 1000),
    uri: asset.uri,
    addedAt: new Date(asset.creationTime ?? Date.now()).toISOString(),
    source: 'device',
  };
}

/**
 * Derive a decent title/artist from a filename such as
 * "01 - Daft Punk - Around the World.mp3" or "My Song.mp3".
 * Real ID3 parsing arrives in Phase 2.
 */
export function parseFilename(filename: string): { title: string; artist: string } {
  let base = filename.replace(/\.[a-zA-Z0-9]+$/, ''); // strip extension
  base = base.replace(/[_]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  base = base.replace(/^\d{1,3}\s*[-._)]\s*/, ''); // strip leading track numbers

  const dashMatch = base.match(/^(.{2,80}?)\s+[-–—]\s+(.+)$/);
  if (dashMatch?.[1] && dashMatch[2]) {
    return { title: dashMatch[2].trim(), artist: dashMatch[1].trim() };
  }
  return { title: base || filename, artist: 'Unknown artist' };
}