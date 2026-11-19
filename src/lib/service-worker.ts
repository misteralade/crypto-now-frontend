export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  console.info("CryptoNow build:", __APP_BUILD_ID__);

  // A first installation claims an uncontrolled page too; only reload pages
  // that were already controlled when an updated worker takes over.
  let hasController = Boolean(navigator.serviceWorker.controller);
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hasController && !reloading) {
      reloading = true;
      window.location.reload();
    }
    hasController = true;
  });

  void navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
    .then((registration) => {
      if (navigator.onLine) {
        void registration.update().catch(() => {
          // A failed check leaves the current app usable until the next load.
        });
      }
    })
    .catch((error: unknown) => {
      console.error("Service worker registration failed:", error);
    });
}
