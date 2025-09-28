import type { TradeType } from "../types/trade.types";

const STORAGE_KEY = "TRADE_PROGRESS_V1";

export interface TradeProgress {
  step?: number;
  activeTab?: TradeType;

  // Identity/context
  selectedTokenId?: string;
  selectedCurrencyId?: string;

  // Amounts
  numberOfToken?: string | number;
  amountToBuy?: string | number;

  // Session / rate
  exchangeRateId?: string;
  transactionSessionId?: string;

  // UX flags
  isCountdownLocked?: boolean;

  // Proofs
  receiptUrl?: string;
  transactionHash?: string;
}

// Read
export function loadTradeProgress(): TradeProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // no-op
  }
}

// Clear
export function clearTradeProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
