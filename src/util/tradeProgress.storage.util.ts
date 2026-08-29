import type { TradeType } from "../types/trade.types";
import {LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS} from "./constants.util.ts";

// Best-effort decode of the JWT payload, used only to namespace localStorage
// per-user — never trusted for auth (that's the backend's job).
function currentUserKey(): string {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return "guest";
    const payload = token.split(".")[1];
    if (!payload) return "guest";
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = JSON.parse(atob(padded));
    return decoded?.id ? String(decoded.id) : "guest";
  } catch {
    return "guest";
  }
}

function tradeProgressKey(): string {
  return `${LOCAL_STORAGE_KEYS.TRADE_PROGRESS}:${currentUserKey()}`;
}

export interface TradeProgress {
  step?: number;
  activeTab?: TradeType;

  // Identity/context
  selectedTokenId?: string;
  selectedCurrencyId?: string;
  anonymousEmail?: string;

  // Amounts
  numberOfToken?: string | number;
  amountToBuy?: string | number;

  // BUY wallet details
  buyWalletAddress?: string;
  buyNetwork?: string;
  sellNetwork?: string;

  // Session
  transactionSessionId?: string;

  // UX flags
  isCountdownLocked?: boolean;
  shouldOpenBankDetailsModal?: boolean;

  // Proofs
  receiptUrl?: string;
  transactionHash?: string;
}

// Read
export function loadTradeProgress(): TradeProgress | null {
  try {
    const raw = localStorage.getItem(tradeProgressKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TradeProgress;
    if (parsed.activeTab === "sell") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Write (merge)
export function saveTradeProgress(partial: Partial<TradeProgress>) {
  try {
    const raw = localStorage.getItem(tradeProgressKey());
    const current = raw ? (JSON.parse(raw) as TradeProgress) : {};
    const merged = { ...current, ...partial };
    if (merged.activeTab === "sell") {
      localStorage.removeItem(tradeProgressKey());
      return;
    }
    localStorage.setItem(tradeProgressKey(), JSON.stringify(merged));
  } catch {
    // no-op
  }
}

// Clear
export function clearTradeProgress() {
  try {
    localStorage.removeItem(tradeProgressKey());
  } catch {
    // no-op
  }
}

// Clears the *current* user's trade/session-scoped browser state (localStorage +
// sessionStorage). Used both on logout and whenever the user explicitly starts a
// new trade (e.g. tapping "Buy Crypto"/"Sell Crypto" from the dashboard) — a
// prior in-progress trade is already recorded server-side, so there's no need
// to resume it just because the cache still has it. TRADE_PROGRESS is
// namespaced per-user (see tradeProgressKey), so this only ever touches the
// current account — it never leaks into, and never wipes, another user's saved
// progress on a shared device.
export function clearUserSessionStorage() {
  try {
    localStorage.removeItem(tradeProgressKey());
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_TRADE_TOKEN);
  } catch {
    // no-op
  }
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_ID);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.YOU_PAY_VALUE);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.YOU_RECEIVE_VALUE);
  } catch {
    // no-op
  }
}
