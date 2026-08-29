/**
 * Single source of truth for amount rounding/precision across every currency and token
 * the platform supports. This file is duplicated verbatim into cryptonow-backend,
 * cryptonow-frontend, and cryptonow-crm (no shared npm workspace exists between them).
 *
 * DO NOT let the copies drift — run `scripts/check-asset-precision-sync.sh` (or the
 * equivalent CI check) before merging any change to this file in any of the three apps.
 *
 * Canonical source: cryptonow-backend/src/lib/asset-precision.ts
 * Mirrors:
 *   - cryptonow-frontend/src/util/asset-precision.ts
 *   - cryptonow-crm/src/util/asset-precision.ts
 */

export type AssetClass = "FIAT" | "STABLECOIN" | "CRYPTO";

export interface AssetPrecisionRule {
  /** Decimal places to keep for calculation/storage (before persisting or summing). */
  calcDecimals: number;
  /** Decimal places to show in the UI (display only — never used for math). */
  displayDecimals: number;
  /** Whether trailing zeros should be stripped when displaying (e.g. 0.50000000 -> 0.5). */
  trimTrailingZeros: boolean;
  assetClass: AssetClass;
  /**
   * Smallest abbreviation tier formatCompact is allowed to use, as a power of 1000
   * (1 = K, 2 = M, 3 = B, ...). NGN amounts read fine with full digits into the
   * hundreds of thousands, so it skips straight to M — showing "₦999,999" rather
   * than "₦1000K", and "₦1.25M" once it crosses seven digits.
   */
  compactMinTier: number;
  /** Decimal places to use once formatCompact abbreviates this asset. */
  compactDecimals: number;
}

/**
 * Precision policy per asset symbol/currency code (uppercase).
 * Add every new supported fiat currency or token here — nowhere else.
 */
const ASSET_PRECISION: Record<string, AssetPrecisionRule> = {
  // Fiat
  NGN: { calcDecimals: 2, displayDecimals: 0, trimTrailingZeros: false, assetClass: "FIAT", compactMinTier: 2, compactDecimals: 2 },
  USD: { calcDecimals: 2, displayDecimals: 2, trimTrailingZeros: false, assetClass: "FIAT", compactMinTier: 1, compactDecimals: 2 },

  // Stablecoins (pegged ~1:1 to USD, don't need crypto-grade precision)
  USDT: { calcDecimals: 4, displayDecimals: 2, trimTrailingZeros: true, assetClass: "STABLECOIN", compactMinTier: 1, compactDecimals: 2 },
  USDC: { calcDecimals: 4, displayDecimals: 2, trimTrailingZeros: true, assetClass: "STABLECOIN", compactMinTier: 1, compactDecimals: 2 },

  // Crypto
  BTC: { calcDecimals: 8, displayDecimals: 8, trimTrailingZeros: true, assetClass: "CRYPTO", compactMinTier: 1, compactDecimals: 2 },
  ETH: { calcDecimals: 8, displayDecimals: 6, trimTrailingZeros: true, assetClass: "CRYPTO", compactMinTier: 1, compactDecimals: 2 },
  SOL: { calcDecimals: 8, displayDecimals: 5, trimTrailingZeros: true, assetClass: "CRYPTO", compactMinTier: 1, compactDecimals: 2 },
};

/** Fallback for any symbol not yet listed above — errs toward crypto-grade precision. */
const DEFAULT_RULE: AssetPrecisionRule = {
  calcDecimals: 8,
  displayDecimals: 8,
  trimTrailingZeros: true,
  assetClass: "CRYPTO",
  compactMinTier: 1,
  compactDecimals: 2,
};

function getRule(symbolOrCode: string): AssetPrecisionRule {
  return ASSET_PRECISION[symbolOrCode.trim().toUpperCase()] ?? DEFAULT_RULE;
}

function stripTrailingZeros(value: string): string {
  return value.includes(".") ? value.replace(/\.?0+$/, "") : value;
}

export type RoundingDirection = "nearest" | "up";

/**
 * Round an amount to the asset's calculation precision. Use before persisting,
 * summing, or sending an amount over the API — never round twice.
 *
 * Pass direction "up" when quoting how much crypto a user will receive — the
 * platform must never promise more than it can actually deliver on-chain.
 */
export function roundForCalculation(
  amount: number,
  symbolOrCode: string,
  direction: RoundingDirection = "nearest",
): number {
  if (typeof amount !== "number" || Number.isNaN(amount)) return 0;
  const { calcDecimals } = getRule(symbolOrCode);
  const factor = Math.pow(10, calcDecimals);
  const scaled = amount * factor;
  return (direction === "up" ? Math.ceil(scaled) : Math.round(scaled)) / factor;
}

/**
 * Format an amount for display in the UI, per the asset's display policy
 * (e.g. NGN shows no decimals, BTC shows up to 8 with trailing zeros trimmed).
 * This is presentation only — do not feed the result back into further math.
 */
export function formatForDisplay(amount: number, symbolOrCode: string): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) amount = 0;
  const { displayDecimals, trimTrailingZeros } = getRule(symbolOrCode);
  const fixed = amount.toFixed(displayDecimals);
  return trimTrailingZeros ? stripTrailingZeros(fixed) : fixed;
}

/**
 * Format an amount for display with thousands separators (e.g. "2,275,000" NGN,
 * "0.00054497" BTC). Prefer this over formatForDisplay for anything shown to a user.
 */
export function formatForDisplayLocalized(amount: number, symbolOrCode: string, locale = "en-US"): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) amount = 0;
  const { displayDecimals, trimTrailingZeros } = getRule(symbolOrCode);
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: trimTrailingZeros ? 0 : displayDecimals,
    maximumFractionDigits: displayDecimals,
  }).format(amount);
  return formatted;
}

export function getAssetClass(symbolOrCode: string): AssetClass {
  return getRule(symbolOrCode).assetClass;
}

const COMPACT_UNITS = ["", "K", "M", "B", "T", "P", "E"];

/**
 * Abbreviate a large amount for compact display (e.g. dashboard totals, table
 * cells) — "₦1.25M", "0.05 BTC" for tiny crypto amounts stay unabbreviated.
 * Replaces every direct use of the `millify` package: each asset's
 * `compactMinTier` controls which abbreviation tier it's allowed to start at
 * (NGN skips "K" — see the comment on AssetPrecisionRule — everything else
 * behaves like millify's default K/M/B/... ladder), and `compactDecimals`
 * controls the precision once abbreviated.
 *
 * This is presentation only — never feed the result back into further math.
 */
export function formatCompact(amount: number, symbolOrCode: string, locale = "en-US"): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) amount = 0;
  const { compactMinTier, compactDecimals } = getRule(symbolOrCode);
  const magnitude = amount === 0 ? 0 : Math.floor(Math.log10(Math.abs(amount)) / 3);
  const tier = Math.max(0, Math.min(magnitude, COMPACT_UNITS.length - 1));

  if (tier < compactMinTier) {
    // Below the asset's abbreviation floor — show full digits with separators.
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: compactDecimals,
    }).format(amount);
  }

  const scaled = amount / Math.pow(1000, tier);
  const formattedScaled = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: compactDecimals,
  }).format(scaled);
  return `${formattedScaled}${COMPACT_UNITS[tier]}`;
}
