/// <reference lib="WebWorker" />
/// <reference types="vite-plugin-pwa/client" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare const self: ServiceWorkerGlobalScope;

// Injected by VitePWA at build time — do not remove
precacheAndRoute(self.__WB_MANIFEST);

// Clean up precache entries from older SW versions on activation
cleanupOutdatedCaches();

// With the injectManifest strategy, registerType: "autoUpdate" in vite.config.ts
// does NOT inject skipWaiting/clientsClaim automatically (unlike generateSW) — a
// new SW would otherwise sit in "waiting" until every tab closes, so the kill
// switch below could target a stale worker. Activate the new SW immediately.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ─── Kill Switch ─────────────────────────────────────────────────────────────
//
// The app sends { type: "CLEAR_CACHE", cacheNames?: string[] } to clear caches
// without nuking the SW itself. If cacheNames is omitted, ALL caches are cleared.
// Activate by bumping CACHE_BUST_VERSION in src/lib/sw-version.ts.
//
self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "CLEAR_CACHE") return;

  event.waitUntil(
    (async () => {
      const targetNames: string[] | undefined = event.data.cacheNames;
      const allKeys = await caches.keys();
      const toDelete = targetNames
        ? allKeys.filter((k) => targetNames.some((t) => k.includes(t)))
        : allKeys;

      await Promise.all(toDelete.map((name) => caches.delete(name)));

      // Tell the triggering client to reload so it picks up fresh responses
      const source = event.source as WindowClient | null;
      source?.navigate(source.url);
    })()
  );
});
// ─────────────────────────────────────────────────────────────────────────────

// ── NetworkOnly — declared FIRST so they match before any caching rule ────────
// Every money- or session-sensitive endpoint must always hit the network live.

const NETWORK_ONLY_PATTERNS = [
  /\/user\/auth\//, // login, signup, password reset, 2FA
  /\/user\/profile/, // profile, profile picture, remove-profile-picture
  /\/user\/onboarding-status/,
  /\/contact-us\//,
  /\/rate\/crypto-rate\//, // exchange rates
  /\/transaction\//, // all transaction endpoints
  /\/custodial-wallet\//, // wallet generation/listing
  /\/dispute\//,
  /\/sweep\//,
  /\/kyc\//,
  /\/notification\//,
  /\/bank\/user\//, // user-specific bank accounts
  /\/bank\/anonymous-user\//,
  /\/bank\/bank\/lookup/,
];

registerRoute(
  ({ url }) => NETWORK_ONLY_PATTERNS.some((pattern) => pattern.test(url.pathname)),
  new NetworkOnly()
);

// ── CacheFirst — long-lived static assets ─────────────────────────────────────

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "gstatic-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// ── StaleWhileRevalidate — reference data only (rarely changes) ──────────────
// 1 hour TTL: fast repeat loads without risking noticeably stale reference lists.

registerRoute(
  ({ url }) => /\/crypto\/supported-cryptos/.test(url.pathname) || /\/crypto\/supported-crypto\//.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "crypto-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => /\/currency\/supported-currency/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "currency-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => /\/bank\/supported-bank\//.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "bank-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => /\/testimonial\/published/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "testimonial-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
  "GET"
);
