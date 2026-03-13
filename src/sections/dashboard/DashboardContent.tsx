import { useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, ArrowUpRight, ChevronRight } from "lucide-react";
import { useDashboardContent } from "../../hooks/components/dashboard/useDashboardContent.ts";
import { useCryptoQuery } from "../../queries/crypto.query.ts";
import { useUserQuery } from "../../queries/user.query.ts";
import { useCurrencyQuery } from "../../queries/currency.query.ts";
import { useTransactionQuery } from "../../queries/transaction.query.ts";
import { TransactionDashboard } from "./TransactionHistory/TransactionDashboard.tsx";
import type {
  TransactionResponseEntity,
  SupportedCryptoOrCurrencyResponse,
} from "../../types/response.payload.types.ts";
import { formatCurrency, convertToMillify } from "../../util/index.util.ts";
import { getStatusDisplayName } from "../../util/transaction.util.ts";
import momentClient from "../../lib/moment.ts";
import { ROUTES } from "../../util/constants.util.ts";

/* ─────────────────────────── helpers ────────────────────────────── */
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "GOOD MORNING";
  if (h < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
};

const getInitials = (first?: string, last?: string) =>
  ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() || "U";

/* ─────────────────────── Live Rate Chip ─────────────────────────── */
function RateChip({ crypto }: { crypto: SupportedCryptoOrCurrencyResponse }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl shrink-0"
      style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
      <img src={crypto.logoUrl} alt={crypto.symbol}
        className="w-6 h-6 rounded-full object-cover shrink-0" />
      <div>
        <p className="text-xs font-bold leading-none" style={{ color: "#0E0F0C" }}>{crypto.symbol}</p>
        <p className="text-[10px] leading-none mt-0.5" style={{ color: "#948EEE" }}>
          BUY {formatCurrency(Number(crypto.buyRate))}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────── Recent Order Row ──────────────────────────── */
function RecentOrderRow({ tx }: { tx: TransactionResponseEntity }) {
  const navigate = useNavigate();
  const isBuy = tx.type.toUpperCase() === "BUY";
  const isCompleted = tx.status === "COMPLETED";
  const isFailed = tx.status === "FAILED" || tx.status === "EXPIRED" || tx.status === "CANCELLED";

  const badgeStyle = isCompleted
    ? { background: "#E8F8F0", color: "#037847" }
    : isFailed
    ? { background: "#FEECEC", color: "#EB5757" }
    : { background: "#F0EFFD", color: "#575AE5" };

  const badgeLabel = isCompleted ? "✓ Done" : isFailed ? "✗ Failed" : getStatusDisplayName(tx.status);

  return (
    <button
      className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-gray-50 transition-colors"
      onClick={() => navigate({ to: `${ROUTES.TRANSACTION}/${tx.sessionId}` })}
    >
      {/* Crypto icon block */}
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
        style={{ background: isBuy ? "rgba(3,120,71,0.10)" : "rgba(148,142,238,0.12)" }}>
        <img src={tx.cryptocurrency.logoUrl} alt={tx.cryptocurrency.symbol}
          className="w-7 h-7 object-contain" />
      </div>

      {/* Left: name / ref / date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug" style={{ color: "#0E0F0C" }}>
          {isBuy ? "Buy" : "Sell"} {tx.cryptocurrency.name}
        </p>
        <p className="text-[11px] leading-snug mt-0.5 truncate" style={{ color: "#9A9A9A" }}>
          REF: {tx.sessionId.slice(0, 12).toUpperCase()} · {momentClient.formatToTransactionInitiationDate(tx.createdAt)}
        </p>
      </div>

      {/* Right: amount / status */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold leading-snug"
          style={{ color: isBuy ? "#037847" : "#0E0F0C" }}>
          ₦{convertToMillify(Number(tx.amountFiat), 0)}
        </p>
        <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5" style={badgeStyle}>
          {badgeLabel}
        </span>
      </div>
    </button>
  );
}

/* ═══════════════════════ MAIN DASHBOARD ═════════════════════════ */
export default function DashboardContent() {
  const navigate = useNavigate();
  const { transactionSummary, loadingTransactionSummary } = useDashboardContent();
  const { supportedCryptoCurrencies, loadingSupportedCryptocurrencies } = useCryptoQuery();
  const { userProfileData, loadingUserProfile } = useUserQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } = useCurrencyQuery();
  const { userTransactionHistory, loadingUserTransactionHistory } = useTransactionQuery();

  const firstName = userProfileData?.profile?.firstName ?? "";
  const lastName  = userProfileData?.profile?.lastName  ?? "";
  const initials  = getInitials(firstName, lastName);

  const totalFiat = transactionSummary?.total?.[0]
    ? Number(transactionSummary.total[0].totalFiatAmount) : 0;
  const bought = transactionSummary?.total?.[0]
    ? Number(transactionSummary.total[0].fiatSpentOnBuying) : 0;
  const sold = transactionSummary?.total?.[0]
    ? Number(transactionSummary.total[0].fiatReceivedFromSelling) : 0;
  const orders = transactionSummary?.total?.[0]
    ? transactionSummary.total[0].transactionCount : "0";

  const recentOrders = userTransactionHistory?.transactions?.slice(0, 5) ?? [];

  const goTrade = (option: "buy" | "sell") => {
    const cryptoId   = supportedCryptoCurrencies?.[0]?.id ?? "";
    const currencyId = supportedCurrencies?.[0]?.id ?? "";
    navigate({ to: ROUTES.DASHBOARD_TRADE, search: { option, currency: currencyId, token: cryptoId } });
  };

  /* ─── Skeleton loaders ─── */
  const Skel = ({ w, h = 4 }: { w: string; h?: number }) => (
    <div className={`animate-pulse rounded bg-white/25`} style={{ width: w, height: `${h * 4}px` }} />
  );
  const SkelDark = ({ w, h = 4 }: { w: string; h?: number }) => (
    <div className={`animate-pulse rounded`} style={{ width: w, height: `${h * 4}px`, background: "#EEEEEE" }} />
  );

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>

      {/* ═══════════════════════════════════════════
          TOP BAR — greeting + bell (mobile only)
      ════════════════════════════════════════════ */}
      <div className="lg:hidden px-5 pt-6 pb-3 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase"
            style={{ color: "#9A9A9A" }}>{greeting()} 🇳🇬</p>
          {loadingUserProfile ? (
            <SkelDark w="140px" h={6} />
          ) : (
            <h2 className="text-[22px] font-extrabold leading-tight mt-0.5"
              style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
              {firstName || "Welcome"}{" "}
              <span style={{ color: "#948EEE" }}>{lastName}</span>
            </h2>
          )}
        </div>
        {/* TODO: connect to notifications API */}
        <button className="relative mt-1 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "#F7F7F9" }}>
          <Bell size={18} style={{ color: "#0E0F0C" }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EB5757] border-2 border-white" />
        </button>
      </div>

      {/* Non-custodial banner */}
      <div className="lg:hidden mx-5 mb-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-2xl"
        style={{ background: "#FFFBF0", border: "1px solid #FFE9A0" }}>
        <span className="text-sm shrink-0 mt-0.5">💛</span>
        <p className="text-[11px] leading-relaxed" style={{ color: "#7A6000" }}>
          <strong>Non-custodial platform.</strong> CryptoNow never holds your crypto. All assets go directly to your personal wallet. We only facilitate the exchange.
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          HERO PURPLE CARD — floating with side margin
      ════════════════════════════════════════════ */}
      <div className="lg:hidden px-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #2D1CB0 0%, #4A2DBF 35%, #6B45D0 65%, #3A1FA8 100%)",
            borderRadius: "22px",
            padding: "22px 20px 18px",
            boxShadow: "0 12px 40px rgba(45,28,176,0.35)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "rgba(148,142,238,0.12)" }} />

          {/* Volume */}
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1"
            style={{ color: "rgba(255,255,255,0.55)" }}>TOTAL VOLUME TRADED</p>

          {loadingTransactionSummary ? (
            <Skel w="180px" h={9} />
          ) : (
            <h3 className="text-[36px] font-black leading-none text-white"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}>
              ₦{convertToMillify(totalFiat, 0)}
            </h3>
          )}
          <p className="text-[11px] mt-1 mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
            All transactions · Lifetime
          </p>

          {/* Stat sub-chips */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "BOUGHT", value: loadingTransactionSummary ? null : `₦${convertToMillify(bought, 0)}` },
              { label: "SOLD",   value: loadingTransactionSummary ? null : `₦${convertToMillify(sold, 0)}` },
              { label: "ORDERS", value: loadingTransactionSummary ? null : orders },
            ].map(({ label, value }) => (
              <div key={label} className="px-3 py-2.5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.10)" }}>
                <p className="text-[9px] font-bold tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                {value === null ? (
                  <Skel w="48px" h={4} />
                ) : (
                  <p className="text-sm font-extrabold text-white mt-0.5 truncate">{value}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* DESKTOP hero (simplified horizontal layout) */}
      <div className="hidden lg:block mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-7"
          style={{
            background: "linear-gradient(145deg,#2D1CB0,#4A2DBF 40%,#6B45D0 70%,#3A1FA8)",
            boxShadow: "0 8px 32px rgba(45,28,176,0.28)",
          }}>
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2"
                style={{ color: "rgba(255,255,255,0.5)" }}>TOTAL VOLUME TRADED</p>
              {loadingTransactionSummary
                ? <Skel w="200px" h={10} />
                : <h3 className="text-5xl font-black text-white" style={{ letterSpacing: "-0.03em" }}>₦{convertToMillify(totalFiat, 0)}</h3>
              }
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>All transactions · Lifetime</p>
            </div>
            <div className="flex gap-3 shrink-0">
              {[
                { l: "BOUGHT", v: `₦${convertToMillify(bought, 0)}` },
                { l: "SOLD",   v: `₦${convertToMillify(sold, 0)}` },
                { l: "ORDERS", v: orders },
              ].map(({ l, v }) => (
                <div key={l} className="px-4 py-3 rounded-2xl text-center min-w-[80px]"
                  style={{ background: "rgba(255,255,255,0.10)" }}>
                  <p className="text-[9px] font-bold tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.5)" }}>{l}</p>
                  {loadingTransactionSummary
                    ? <Skel w="52px" h={5} />
                    : <p className="text-base font-extrabold text-white mt-1">{v}</p>
                  }
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          BODY CONTENT
      ════════════════════════════════════════════ */}
      <div className="px-5 lg:px-0 space-y-7">

        {/* QUICK ACTIONS */}
        <section>
          <p className="text-[11px] font-extrabold tracking-[0.12em] uppercase mb-3"
            style={{ color: "#9A9A9A" }}>Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Buy Crypto */}
            <button
              onClick={() => goTrade("buy")}
              disabled={loadingSupportedCurrencies || loadingSupportedCryptocurrencies}
              className="flex items-center gap-3 px-4 py-4 rounded-3xl text-left transition-all active:scale-[0.97] disabled:opacity-50"
              style={{ background: "#F0EFFD", border: "1px solid rgba(148,142,238,0.2)" }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#948EEE" }}>
                {/* Down arrow icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>Buy Crypto</p>
                <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Pay NGN, get crypto</p>
              </div>
            </button>

            {/* Sell Crypto */}
            <button
              onClick={() => goTrade("sell")}
              disabled={loadingSupportedCurrencies || loadingSupportedCryptocurrencies}
              className="flex items-center gap-3 px-4 py-4 rounded-3xl text-left transition-all active:scale-[0.97] disabled:opacity-50"
              style={{ background: "#FFF4F0", border: "1px solid rgba(247,166,0,0.2)" }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#F7A600" }}>
                {/* Up arrow icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>Sell Crypto</p>
                <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Send crypto, get NGN</p>
              </div>
            </button>
          </div>
        </section>

        {/* LIVE RATES */}
        {!loadingSupportedCryptocurrencies && supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0 && (
          <section>
            <p className="text-[11px] font-extrabold tracking-[0.12em] uppercase mb-3"
              style={{ color: "#9A9A9A" }}>Live Rates</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {supportedCryptoCurrencies.map(c => <RateChip key={c.id} crypto={c} />)}
            </div>
          </section>
        )}

        {/* RECENT ORDERS */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-extrabold tracking-[0.12em] uppercase"
              style={{ color: "#9A9A9A" }}>Recent Orders</p>
            <Link to={ROUTES.TRANSACTION}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#948EEE" }}>
              See all <ArrowUpRight size={12} />
            </Link>
          </div>

          {loadingUserTransactionHistory ? (
            <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl shrink-0 animate-pulse" style={{ background: "#F0F0F0" }} />
                  <div className="flex-1 space-y-2">
                    <SkelDark w="120px" h={3} />
                    <SkelDark w="80px" h={3} />
                  </div>
                  <div className="text-right space-y-2">
                    <SkelDark w="60px" h={3} />
                    <SkelDark w="44px" h={3} />
                  </div>
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-3xl px-6 py-10 flex flex-col items-center gap-3 text-center"
              style={{ border: "1px solid #F0F0F0" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "#F0EFFD" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#948EEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>No transactions yet</p>
              <p className="text-xs" style={{ color: "#9A9A9A" }}>Start by buying or selling crypto</p>
            </div>
          ) : (
            <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
              {recentOrders.map((tx, i) => (
                <div key={tx.id}>
                  <RecentOrderRow tx={tx} />
                  {i < recentOrders.length - 1 && (
                    <div style={{ height: "1px", background: "#F7F7F9", margin: "0 16px" }} />
                  )}
                </div>
              ))}

              {/* "View all history" footer */}
              <div style={{ borderTop: "1px solid #F7F7F9" }}>
                <Link to={ROUTES.TRANSACTION}
                  className="flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold w-full"
                  style={{ color: "#948EEE" }}>
                  View all transactions <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* FULL TRANSACTION TABLE (desktop) / hidden on mobile (mobile sees recent orders above) */}
        <div className="hidden lg:block">
          <TransactionDashboard />
        </div>
      </div>
    </div>
  );
}
