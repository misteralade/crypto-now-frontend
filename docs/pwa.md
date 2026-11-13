# PWA strategy

CryptoNow uses a service worker to cache the frontend, keep selected reference data available, and update open pages after a new deployment. The PWA is configured in `vite.config.ts` and the worker is implemented in `src/sw.ts`.

## Build and installation

- `vite-plugin-pwa` uses the `injectManifest` strategy: it builds the custom worker and injects a list of build assets to precache. The maximum size for a precached file is 5 MiB.
- The web app manifest defines the app name, icons, standalone display mode, and `/` as both the scope and start URL.
- The browser install prompt is captured in `src/pwa.ts` for use by the app. Install prompt availability depends on the browser.
- Service worker registration is enabled in production builds, not the Vite development server. `src/lib/service-worker.ts` explicitly registers `/sw.js` with `updateViaCache: "none"`.

## Updates

Each frontend build receives a generated `__APP_BUILD_ID__`, logged as `CryptoNow build:` in the browser console. It is useful for identifying the running build; there is no separate version endpoint or manual version bump for normal releases. The browser detects changes to the worker, including its injected precache manifest.

After registration on each page load, the app checks for an update once. The check is skipped when the browser reports it is offline. A failed check leaves the current app running; the next page load tries again. The app does not poll for updates while a page remains open.

The worker calls `skipWaiting()` on installation and claims clients on activation. When an updated worker takes control, each already-controlled page reloads once to load the new build. The first installation does not trigger this update reload. If the app loads offline, its next explicit update check occurs on a later page load when it is online. The browser may also check for service worker updates independently.

Reloads are immediate, including during forms or transactions. Unsaved input may be lost, and an in-flight transaction request may have reached the server even if the page reloads before receiving its response. Do not assume a reload means a submission failed or was safely deduplicated.

`vercel.json` requires revalidation for `/sw.js`, `/`, and `/index.html`; it also rewrites paths to the SPA entry point. These HTTP cache settings are separate from the service worker's Cache Storage.

## Caching

Workbox precaches the injected build assets and serves matching requests from the precache. Old precache entries are cleaned up as the worker changes. Offline access is limited to available cached assets and responses; the application is not fully functional offline.

| Requests | Strategy | Cache policy |
| --- | --- | --- |
| Authentication, profile, onboarding status, contact, exchange rates, transactions, wallets, disputes, sweeps, KYC, notifications, user bank accounts, and bank lookup | Network only | No service-worker response cache for the matching GET routes. |
| Google Fonts stylesheets and font files | Cache first | Separate caches, up to 10 entries each, with a maximum age of 365 days. |
| Supported cryptocurrencies, currencies, banks, and published testimonials | Stale while revalidate | Separate caches, up to 10 entries each, with a maximum age of one hour. A cached response can be returned while a network refresh runs. |

The runtime cache rules accept successful `200` responses and opaque `0` responses where configured. Workbox routes default to GET; other methods are not cached by these routes. The exact URL patterns and rule order are defined in `src/sw.ts` and should be reviewed when endpoints change.

## Emergency runtime cache reset

Use `CACHE_BUST_VERSION` in `src/lib/sw-version.ts` only when runtime caches need to be cleared, such as after shipping bad reference data. Increment the number and deploy normally. Routine frontend updates do not require this step.

On a subsequent page load, a client with an older stored version sends `CLEAR_CACHE` to the active worker. The worker deletes matching runtime caches while preserving cache names containing `-precache-`, then navigates the requesting page to its current URL. The app stores the version in local storage so it does not request the same reset on every load. A client with no stored version records the current value without clearing caches.

The worker also accepts an optional `cacheNames` array in the message to select caches by name substring. The normal version-bump path does not supply it, so it clears all non-precache Cache Storage caches for the origin. The version is stored after the message is sent, without an acknowledgment that deletion succeeded.

## Checking changes

Use `pnpm build` and serve a production build when checking worker behavior; `pnpm dev` does not enable the PWA worker. In browser developer tools, inspect the registered worker, Cache Storage, network responses, and the logged build ID. For an update check, load one production build, deploy or serve a second build at the same origin, and confirm that controlled tabs reload onto the new build. Also check first installation and offline behavior when changing the worker or cache rules.
