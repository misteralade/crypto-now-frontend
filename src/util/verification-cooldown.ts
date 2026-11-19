const VERIFICATION_COOLDOWN_KEY = "cryptonow.verificationCooldownUntil";
const VERIFICATION_COOLDOWN_MS = 30_000;

export function getVerificationCooldownUntil(): number {
  const stored = sessionStorage.getItem(VERIFICATION_COOLDOWN_KEY);
  if (stored === null) return 0;
  const expiresAt = Number(stored);
  return Number.isFinite(expiresAt) ? expiresAt : 0;
}

export function startVerificationCooldown(): number {
  const expiresAt = Date.now() + VERIFICATION_COOLDOWN_MS;
  sessionStorage.setItem(VERIFICATION_COOLDOWN_KEY, String(expiresAt));
  return expiresAt;
}
