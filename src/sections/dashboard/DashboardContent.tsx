import { useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, ChevronRight } from "lucide-react";
import { useDashboardContent } from "../../hooks/components/dashboard/useDashboardContent.ts";
import { useCryptoQuery } from "../../queries/crypto.query.ts";
import { useUserQuery } from "../../queries/user.query.ts";
import { useCurrencyQuery } from "../../queries/currency.query.ts";
import { TransactionDashboard } from "./TransactionHistory/TransactionDashboard.tsx";
import type { TransactionSummaryResponseEntity } from "../../types/response.payload.types.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../types/response.payload.types.ts";
import { convertToMillify, formatCurrency } from "../../util/index.util.ts";
import { ROUTES } from "../../util/constants.util.ts";

/* ── Greeting helper ── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ── Skeleton for stat card ── */
const StatSkeleton = () => (
  <div className="h-4 bg-white/20 rounded animate-pulse w-24" />
);

/* ── Individual stat pill in the header card ── */
const StatPill = ({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) => (
  <div
    className="flex flex-col gap-0.5 px-4 py-2 rounded-xl"
    style={{ background: "rgba(255,255,255,0.08)" }}
  >
    <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
      {label}
    </span>
    {loading ? (
      <StatSkeleton />
    ) : (
      <span className="text-base font-bold text-white">{value}</span>
    )}
  </div>
);

/* ── Live rates ticker item ── */
const RateTicker = ({ crypto }: { crypto: SupportedCryptoOrCurrencyResponse }) => (
  <div
    className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    <img src={crypto.logoUrl} alt={crypto.symbol} className="w-5 h-5 rounded-full" />
    <span className="text-sm font-semibold text-white">{crypto.symbol}</span>
    <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
      BUY {formatCurrency(Number(crypto.buyRate))}
    </span>
  </div>
);

/* ── Quick action button ── */
const QuickAction = ({
  label,
  sub,
  icon: Icon,
  color,
  onClick,
}: {
  label: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all duration-150 active:scale-[0.98]"
    style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: color + "18" }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>{label}</p>
      <p className="text-xs" style={{ color: "#6B6E6B" }}>{sub}</p>
    </div>
    <ChevronRight size={16} className="ml-auto" style={{ color: "#9A9A9A" }} />
  </button>
);

/* ── Per-crypto summary card ── */
const CryptoStatCard = ({
  item,
  index,
}: {
  item: TransactionSummaryResponseEntity;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-2xl p-4"
      style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <img
          src={item.cryptoCurrencyImageUrl}
          alt={item.cryptoCurrencySymbol}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
            {item.cryptoCurrencyName}
          </p>
          <p className="text-xs" style={{ color: "#9A9A9A" }}>
            {item.cryptoCurrencySymbol}
          </p>
        </div>
        <div
          className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "#F0EFFD", color: "#575AE5" }}
        >
          {item.transactionCount} orders
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9A9A9A" }}>
            Bought
          </p>
          <p className="text-sm font-bold" style={{ color: "#037847" }}>
            {formatCurrency(Number(item.fiatSpentOnBuying))}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9A9A9A" }}>
            Sold
          </p>
          <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>
            {formatCurrency(Number(item.fiatReceivedFromSelling))}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main dashboard component ── */
export default function DashboardContent() {
  const navigate = useNavigate();
  const { transactionSummary, loadingTransactionSummary } = useDashboardContent();
  const { supportedCryptoCurrencies, loadingSupportedCryptocurrencies } = useCryptoQuery();
  const { userProfileData, loadingUserProfile } = useUserQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } = useCurrencyQuery();

  const firstName = userProfileData?.profile?.firstName || "";

  /* Total NGN volume across all summaries */
  const totalFiat =
    !loadingTransactionSummary && transactionSummary?.summary
      ? transactionSummary.summary.reduce(
          (acc, item) => acc + Number(item.totalFiatAmount),
          0
        )
      : 0;

  const totalOrders =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? transactionSummary.total[0].transactionCount
      : "0";

  const buyCount =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? transactionSummary.total[0].buyCount
      : "0";

  const sellCount =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? transactionSummary.total[0].sellCount
      : "0";

  /* Navigate to trade */
  const goTrade = (option: "buy" | "sell") => {
    const cryptoId = supportedCurrencies?.[0]?.id || "";
    const currencyId = supportedCurrencies?.[0]?.id || "";
    navigate({
      to: ROUTES.TRADE_CRYPTO,
      search: { option, currency: currencyId, token: cryptoId },
    });
  };

  return (
    <div className="space-y-0">

      {/* ═══════════════════════════════════════════════
          HERO HEADER CARD — dark navy with stats
      ═══════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #03034D 0%, #0a0a6b 60%, #1a0a5c 100%)" }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full"
          style={{ background: "rgba(148,142,238,0.12)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full"
          style={{ background: "rgba(247,166,0,0.08)" }}
        />

        <div className="relative px-4 pt-6 pb-8 lg:px-8 max-w-6xl mx-auto">
          {/* Greeting row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
                {getGreeting()} 👋
              </p>
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {loadingUserProfile ? (
                  <span className="block h-6 w-32 bg-white/20 rounded animate-pulse" />
                ) : (
                  firstName || "Welcome back"
                )}
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                Non-custodial · CryptoNow never holds your crypto
              </p>
            </div>

            {/* TODO: Connect to KYC verification status API */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
              style={{ background: "rgba(3,120,71,0.2)", color: "#4ade80", border: "1px solid rgba(3,120,71,0.3)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              KYC Verified
            </div>
          </div>

          {/* Total volume */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              TOTAL VOLUME TRADED
            </p>
            {loadingTransactionSummary ? (
              <div className="h-10 w-48 bg-white/20 rounded-xl animate-pulse" />
            ) : (
              <h3
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
              >
                {formatCurrency(totalFiat)}
              </h3>
            )}
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              All transactions · Lifetime
            </p>
          </div>

          {/* Stat pills row */}
          <div className="flex flex-wrap gap-2">
            <StatPill
              label="Bought"
              value={`₦${convertToMillify(
                transactionSummary?.total?.[0]
                  ? Number(transactionSummary.total[0].fiatSpentOnBuying)
                  : 0
              )}`}
              loading={loadingTransactionSummary}
            />
            <StatPill
              label="Sold"
              value={`₦${convertToMillify(
                transactionSummary?.total?.[0]
                  ? Number(transactionSummary.total[0].fiatReceivedFromSelling)
                  : 0
              )}`}
              loading={loadingTransactionSummary}
            />
            <StatPill
              label="Orders"
              value={totalOrders}
              loading={loadingTransactionSummary}
            />
          </div>
        </div>

        {/* Live rates ticker — horizontally scrollable */}
        {!loadingSupportedCryptocurrencies && supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0 && (
          <div
            className="px-4 pb-4 lg:px-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-[10px] uppercase tracking-widest font-semibold pt-3 pb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              Live Rates
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {supportedCryptoCurrencies.map((crypto) => (
                <RateTicker key={crypto.id} crypto={crypto} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          BODY CONTENT — light grey bg
      ═══════════════════════════════════════════════ */}
      <div className="px-4 lg:px-8 max-w-6xl mx-auto space-y-6 pt-5">

        {/* Quick Actions */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#9A9A9A" }}>
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickAction
              label="Buy Crypto"
              sub="Pay NGN, get crypto"
              icon={ArrowDownLeft}
              color="#037847"
              onClick={() => goTrade("buy")}
            />
            <QuickAction
              label="Sell Crypto"
              sub="Send crypto, get NGN"
              icon={ArrowUpRight}
              color="#948EEE"
              onClick={() => goTrade("sell")}
            />
          </div>
        </div>

        {/* Per-crypto stats — only shown when data exists */}
        {!loadingTransactionSummary && transactionSummary?.summary && transactionSummary.summary.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#9A9A9A" }}>
                Asset Overview
              </h4>
              <Link
                to={ROUTES.TRADE_CRYPTO}
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: "#948EEE" }}
              >
                Trade <TrendingUp size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {transactionSummary.summary.map((item, i) => (
                <CryptoStatCard key={item.cryptoCurrencyId} item={item} index={i} />
              ))}
              {/* Total orders card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: transactionSummary.summary.length * 0.06 }}
                className="rounded-2xl p-4"
                style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "#F0EFFD" }}
                  >
                    <TrendingUp size={16} style={{ color: "#575AE5" }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>All Assets</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9A9A9A" }}>Buys</p>
                    <p className="text-sm font-bold" style={{ color: "#037847" }}>{buyCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9A9A9A" }}>Sells</p>
                    <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>{sellCount}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div>
          <TransactionDashboard />
        </div>

      </div>
    </div>
  );
}
