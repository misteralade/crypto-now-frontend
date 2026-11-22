const NETWORK_FEE_BY_TOKEN: Record<string, string> = {
  TRX: "Network fee: 1.5 TRX",
  LTC: "Network fee: 0.0001 LTC",
  BTC: "Network fee is unpredictable",
  USDT: "Network fee: $1",
};

type Props = { symbol?: string; className?: string };

export default function NetworkFeeNotice({ symbol, className = "" }: Props) {
  const notice = symbol ? NETWORK_FEE_BY_TOKEN[symbol.toUpperCase()] : undefined;
  if (!notice) return null;

  return (
    <p className={`text-xs text-gray-500 ${className}`.trim()}>
      {notice}
    </p>
  );
}
