import Constants from 'expo-constants';
import { NativeModules } from 'react-native';

/**
 * Lazy loader for react-native-track-player.
 *
 * WHY LAZY: the package binds its native module and reads constants eagerly
 * at import time (constants/Capability.js does `TrackPlayer.CAPABILITY_PLAY`
 * on the NativeModules entry). In runtimes without the native module (Expo
 * Go, or a development build created before the dependency was added) that
 * is a fatal startup crash: "Cannot read property 'CAPABILITY_PLAY' of null".
 *
 * WHY A PRE-CHECK INSTEAD OF try/catch: Metro's module runtime
 * (metro-runtime require.js `guardedLoadModule`) catches errors thrown while
 * a module is being evaluated and reports them as FATAL via
 * ErrorUtils.reportFatalError — the red "Uncaught Error" screen — BEFORE the
 * error can propagate into our own try/catch. A try/catch around require()
 * therefore CANNOT intercept module-eval crashes. The only reliable strategy
 * is to verify the native module exists BEFORE importing the package.
 *
 * RNTP binds via LEGACY NativeModules ("TrackPlayerModule" — it is neither an
 * Expo module nor a TurboModule), so requireOptionalNativeModule would NOT
 * find it; we check the exact same property the library itself reads. If it
 * is absent, the library cannot work, and we return null gracefully.
 *
 * Therefore NOTHING may statically import 'react-native-track-player'.
 * Use loadRNTP()/rntp() — the module is only required inside development /
 * production builds, where the native module exists.
 */

export const isExpoGo = Constants.appOwnership === 'expo';

export type RNTPModule = typeof import('react-native-track-player');

/** Legacy NativeModules key bound by react-native-track-player's TrackPlayerModule.js. */
const NATIVE_MODULE_NAME = 'TrackPlayerModule';

let cached: RNTPModule | null = null;

/** Load the module once; returns null when the native module is unavailable. */
export function loadRNTP(): RNTPModule | null {
  if (cached) return cached;
  if (isExpoGo) return null;

  // 1) Pre-check the native module WITHOUT touching the JS package
  //    (see the Metro rationale above). Same property the library itself
  //    destructures, so a falsy value means the library cannot work.
  if (!NativeModules[NATIVE_MODULE_NAME]) {
    return null;
  }

  // 2) Native side confirmed present — the package's module-eval can no
  //    longer fail on the missing-module path, so requiring it is safe.
  try {
    // Metro resolves this require; typed via RNTPModule.
    cached = require('react-native-track-player') as RNTPModule;
    return cached;
  } catch (error) {
    // Belt-and-braces for exotic failures (should not normally happen now).
    console.error('[OfflineMusic] Failed to load react-native-track-player:', error);
    return null;
  }
}

/** Guaranteed accessor for code paths that only run with the engine ready. */
export function rntp(): RNTPModule {
  const mod = loadRNTP();
  if (!mod) {
    throw new Error('react-native-track-player is unavailable (running in Expo Go?)');
  }
  return mod;
}