import type { TradeType } from "../types/trade.types";
import {LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS} from "./constants.util.ts";


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
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.TRADE_PROGRESS);
    if (!raw) return null;
    return JSON.parse(raw) as TradeProgress;
  } catch {
    return null;
  }
}

// Write (merge)
export function saveTradeProgress(partial: Partial<TradeProgress>) {
  try {
    const current = loadTradeProgress() || {};
    const merged = { ...current, ...partial };
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRADE_PROGRESS, JSON.stringify(merged));
  } catch {
    // no-op
  }
}

// Clear
export function clearTradeProgress() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TRADE_PROGRESS);
  } catch {
    // no-op
  }
}

// Clears every piece of trade/user-scoped browser state (localStorage + sessionStorage).
// Must run on every logout path and defensively on login, since none of these keys
// are namespaced per-user — left as-is they leak one user's in-flight trade state
// (e.g. a "Continue sell" indicator) into the next user's session on a shared device.
export function clearUserSessionStorage() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TRADE_PROGRESS);
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
