import { requireOptionalNativeModule } from 'expo-modules-core';

/**
 * Lazy loader for expo-media-library.
 *
 * WHY LAZY: the package binds its native module eagerly at import time —
 * src/ExpoMediaLibraryNext.ts runs `requireNativeModule('ExpoMediaLibraryNext')`
 * at module-eval. In runtimes without that native module (Expo Go builds that
 * don't ship it, or a development build created before the dependency was
 * added) the app crashes at startup with
 * "Cannot find native module 'ExpoMediaLibraryNext'".
 *
 * WHY A PRE-CHECK INSTEAD OF try/catch: Metro's module runtime
 * (metro-runtime require.js `guardedLoadModule`) CATCHES errors thrown while
 * a module is being evaluated and reports them as FATAL via
 * ErrorUtils.reportFatalError — the red "Uncaught Error" screen — BEFORE the
 * error can propagate into our own try/catch (the require then simply returns
 * undefined). A try/catch around require() therefore CANNOT intercept
 * module-eval crashes. The only reliable strategy is to verify the native
 * module exists BEFORE importing the package.
 *
 * Therefore NOTHING may statically import 'expo-media-library'.
 * Call loadMediaLibrary() inside functions; it returns null when the native
 * side is unavailable so the UI can degrade gracefully (the Library screen
 * shows a "scan unavailable" state instead of crashing).
 */

export type MediaLibraryModule = typeof import('expo-media-library');

/** Native module name bound by expo-media-library's ExpoMediaLibraryNext.ts. */
const NATIVE_MODULE_NAME = 'ExpoMediaLibraryNext';

let cached: MediaLibraryModule | null = null;

/**
 * Load the module once; returns null when the native module is unavailable.
 * `requireOptionalNativeModule` (expo-modules-core — always present in every
 * Expo runtime) returns null instead of throwing, so this never triggers a
 * fatal error report.
 */
export function loadMediaLibrary(): MediaLibraryModule | null {
  if (cached) return cached;

  // 1) Ask the native registry FIRST — without touching the JS package.
  const nativeModule = requireOptionalNativeModule(NATIVE_MODULE_NAME);
  if (!nativeModule) {
    return null;
  }

  // 2) Native side confirmed present — the package's module-eval can no
  //    longer fail on the missing-module path, so requiring it is safe.
  try {
    cached = require('expo-media-library') as MediaLibraryModule;
    return cached;
  } catch (error) {
    // Belt-and-braces for exotic failures (should not normally happen now).
    console.warn('[OfflineMusic] expo-media-library failed to load:', error);
    return null;
  }
}