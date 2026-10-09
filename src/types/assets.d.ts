/**
 * Ambient declarations for bundled audio assets (Metro asset modules).
 * require('*.mp3') returns a numeric asset registry id which
 * react-native-track-player resolves via its own resolveAssetSource.
 */
declare module '*.mp3' {
  const asset: number;
  export = asset;
}
