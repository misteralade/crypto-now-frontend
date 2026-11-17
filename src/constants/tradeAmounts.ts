export const TRADE_FIAT_AMOUNT_PRESETS = {
  ngn: [5000, 20000, 35000, 50000],
  usd: [2, 10, 15, 35],
} as const;

export type TradeFiatCurrencyCode = "NGN" | "USD";

export const formatTradeFiatPreset = (
  amount: number,
  currencyCode: TradeFiatCurrencyCode,
) => {
  if (currencyCode === "USD") return `$${amount}`;
  if (amount >= 1000) return `₦${amount / 1000}k`;
  return `₦${amount}`;
};

import { roundForCalculation } from "../util/asset-precision.ts";

export function roundTokenAmountUp(amount: number, symbol: string, precision?: number | null): number {
  if (precision != null) {
    const factor = Math.pow(10, precision);
    return Math.ceil(amount * factor) / factor;
  }
  return roundForCalculation(amount, symbol, "up");
}
