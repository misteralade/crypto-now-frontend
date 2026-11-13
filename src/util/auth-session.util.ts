import { LOCAL_STORAGE_KEYS } from "./constants.util.ts";

export type AuthSession = {
  accessToken: string | null;
  isAuthenticated: boolean;
};

/** Read the app's current session token from its single storage location. */
export function getAccessToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)?.trim();
  return token || null;
}

export function setAccessToken(token: string): void {
  const normalizedToken = token.trim();
  if (!normalizedToken) {
    clearAccessToken();
    return;
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, normalizedToken);
}

export function clearAccessToken(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  }
}

/** Presence is a client-side routing hint; the API remains authoritative. */
export function getAuthSession(): AuthSession {
  const accessToken = getAccessToken();
  return { accessToken, isAuthenticated: accessToken !== null };
}

export function isAuthenticated(): boolean {
  return getAuthSession().isAuthenticated;
}

/** Guest contact details must never override an authenticated session. */
export function getAnonymousEmail(email: string | undefined): string | undefined {
  return getAuthSession().isAuthenticated ? undefined : email || undefined;
}
