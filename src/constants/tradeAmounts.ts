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

export const TOKEN_PRECISION: Record<string, number> = {
  USDT: 4,
  SOL: 5,
  BTC: 8,
};

export function roundTokenAmountUp(amount: number, symbol: string): number {
  if (typeof amount !== "number" || Number.isNaN(amount)) return 0;
  const normSymbol = symbol.trim().toUpperCase();
  const decimals = TOKEN_PRECISION[normSymbol] ?? 8;
  const factor = Math.pow(10, decimals);
  return Math.ceil(amount * factor) / factor;
}
