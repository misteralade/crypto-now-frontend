// Simple accessor for the deferred PWA install prompt event
export let deferredPrompt: (Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}) | null = null;

// Initialize global listeners for PWA install prompts
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as typeof deferredPrompt;
    window.dispatchEvent(new Event("pwa-ready"));
  });
}
