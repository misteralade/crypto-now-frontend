import { initializeSentry } from "./config/sentry.ts";
import { CACHE_BUST_VERSION } from "./lib/sw-version.ts";
import "./pwa.ts";
import { registerServiceWorker } from "./lib/service-worker.ts";

initializeSentry();
registerServiceWorker();

// ── SW Kill Switch ────────────────────────────────────────────────────────────
// If CACHE_BUST_VERSION has been bumped since the last page load, send a
// CLEAR_CACHE message to the active SW so it wipes runtime caches.
// Runs once per version bump (stored in localStorage) — not on every load.
if ("serviceWorker" in navigator) {
  const SW_VERSION_KEY = "cryptonow_sw_cache_version";
  const storedVersion = localStorage.getItem(SW_VERSION_KEY);
  const lastVersion = storedVersion === null ? CACHE_BUST_VERSION : parseInt(storedVersion, 10);

  if (storedVersion === null) {
    localStorage.setItem(SW_VERSION_KEY, String(CACHE_BUST_VERSION));
  } else if (lastVersion < CACHE_BUST_VERSION) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({ type: "CLEAR_CACHE" });
      localStorage.setItem(SW_VERSION_KEY, String(CACHE_BUST_VERSION));
    });
  }
}
// ─────────────────────────────────────────────────────────────────────────────

void import("./app.tsx");
