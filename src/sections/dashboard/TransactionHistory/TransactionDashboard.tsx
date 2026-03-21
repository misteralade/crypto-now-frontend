import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTransactionBoard } from "../../../hooks/components/dashboard/useTransactionBoard.ts";
import type {
  SupportedCryptoOrCurrencyResponse,
  TransactionResponseEntity,
} from "../../../types/response.payload.types.ts";
import type { SearchTransactionsRequestPayload } from "../../../types/request.payload.types.ts";
import type { RootState } from "../../../store.ts";
import { TransactionSearch } from "./TranactionSearch.tsx";
import ExportTransaction from "./ExportTransaction.tsx";
import TransactionTable from "./TranactionTable.tsx";
import { convertToMillify } from "../../../util/index.util.ts";

// Redux search payload without page — changes here mean a new result set (reset accumulated rows).
function searchPayloadWithoutPageKey(
  payload: SearchTransactionsRequestPayload | null,
): string {
  if (!payload) return "";
  const { page: _p, ...rest } = payload;
  return JSON.stringify(rest);
}

type TabValue = { status?: string; type?: string };

const STATUS_TABS: { label: string; value: TabValue }[] = [
  { label: "All", value: {} },
  { label: "Buys", value: { type: "BUY" } },
  { label: "Sells", value: { type: "SELL" } },
  { label: "Pending", value: { status: "PENDING" } },
  { label: "Completed", value: { status: "COMPLETED" } },
  { label: "Failed", value: { status: "FAILED" } },
];

export function TransactionDashboard() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [accumulatedTransactions, setAccumulatedTransactions] = useState<
    TransactionResponseEntity[]
  >([]);

  const searchPayload = useSelector(
    (s: RootState) => s.transaction.dashboard.searchUserTransactions,
  );
  const filterFingerprint = searchPayloadWithoutPageKey(searchPayload);

  const {
    searchQuery,
    showFilters,
    userTransactionHistory,
    loadingUserTransactionHistory,
    fetchingUserTransactionHistory,
    filters,
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,
    setShowFilters,
    handleSearchChange,
    handleFiltersChange,
    handleLoadMore,
  } = useTransactionBoard();

  // New filters/search → drop merged list so we don't flash stale rows while page 1 refetches.
  useEffect(() => {
    setAccumulatedTransactions([]);
  }, [filterFingerprint]);

  // Merge API pages into one list for "View more".
  useEffect(() => {
    if (!userTransactionHistory?.transactions) return;
    const { page, transactions } = userTransactionHistory;
    if (page <= 1) {
      setAccumulatedTransactions(transactions);
      return;
    }
    setAccumulatedTransactions((prev) => {
      const seen = new Set(prev.map((t) => t.id));
      const next = [...prev];
      for (const t of transactions) {
        if (!seen.has(t.id)) {
          seen.add(t.id);
          next.push(t);
        }
      }
      return next;
    });
  }, [userTransactionHistory]);

  const handleTab = (val: TabValue, idx: number) => {
    setActiveTabIdx(idx);
    handleFiltersChange({ ...filters, status: val.status });
  };

  /* summary stats */
  const total = userTransactionHistory?.count ?? 0;
  const bought = accumulatedTransactions
    .filter((t) => t.type.toUpperCase() === "BUY")
    .reduce((a, t) => a + Number(t.amountFiat), 0);
  const sold = accumulatedTransactions
    .filter((t) => t.type.toUpperCase() === "SELL")
    .reduce((a, t) => a + Number(t.amountFiat), 0);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      {/* ── page header (shared mobile + desktop) ── */}
      <div className="px-5 lg:px-0 pt-6 pb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            className="text-[22px] font-extrabold"
            style={{
              color: "#0E0F0C",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Transaction History
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
            All your buy &amp; sell orders
          </p>
        </div>
        <div className="shrink-0 mt-1">
          <ExportTransaction />
        </div>
      </div>

      {/* ── summary pills ── */}
      <div
        className="px-5 lg:px-0 mb-5 flex gap-2.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {[
          { label: "TOTAL", val: String(total) },
          { label: "BOUGHT", val: `₦${convertToMillify(bought, 0)}` },
          { label: "SOLD", val: `₦${convertToMillify(sold, 0)}` },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl shrink-0"
            style={{
              background: "#F7F7F9",
              border: "1px solid #EEEEEE",
              minWidth: "90px",
            }}
          >
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "#9A9A9A" }}
            >
              {label}
            </p>
            {loadingUserTransactionHistory ? (
              <div className="mt-1 h-4 w-14 rounded animate-pulse bg-gray-200" />
            ) : (
              <p
                className="text-sm font-extrabold mt-0.5"
                style={{ color: "#0E0F0C" }}
              >
                {val}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── filter tabs ── */}
      <div
        className="px-5 lg:px-0 flex gap-2 overflow-x-auto mb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {STATUS_TABS.map((tab, i) => {
          const active = i === activeTabIdx;
          return (
            <button
              key={tab.label}
              onClick={() => handleTab(tab.value, i)}
              className="px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all"
              style={{
                background: active ? "#948EEE" : "#F7F7F9",
                color: active ? "#FFFFFF" : "#6B6E6B",
                border: active ? "1px solid #948EEE" : "1px solid #EEEEEE",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── search bar ── */}
      <div className="px-5 lg:px-0 mb-4">
        <TransactionSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          setShowFilters={setShowFilters}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          supportedCrypto={
            !loadingSupportedCryptocurrencies && supportedCryptoCurrencies
              ? supportedCryptoCurrencies
              : ([] as SupportedCryptoOrCurrencyResponse[])
          }
        />
      </div>

      {/* ── transaction list ── */}
      <div className="px-5 lg:px-0">
        <TransactionTable
          transactions={accumulatedTransactions}
          hasMore={
            !!userTransactionHistory &&
            userTransactionHistory.page < userTransactionHistory.totalPages
          }
          onLoadMore={handleLoadMore}
          isLoadingMore={
            fetchingUserTransactionHistory &&
            accumulatedTransactions.length > 0
          }
          isLoading={
            loadingUserTransactionHistory &&
            accumulatedTransactions.length === 0
          }
        />
      </div>
    </div>
  );
}
