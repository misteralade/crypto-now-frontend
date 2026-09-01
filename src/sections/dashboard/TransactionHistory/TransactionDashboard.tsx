import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTransactionBoard } from "../../../hooks/components/dashboard/useTransactionBoard.ts";
import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import type { SearchTransactionsRequestPayload } from "../../../types/request.payload.types.ts";
import type { RootState } from "../../../store.ts";
import { setSearchUserTransactions } from "../../../redux/transaction.slice.ts";
import { TransactionSearch } from "./TranactionSearch.tsx";
import TransactionTable from "./TranactionTable.tsx";
import { formatCompact } from "../../../util/asset-precision.ts";

// userSearchTransactionInitialState.size (5) is sized for the dashboard's
// small "Recent Orders" preview widget, which reuses that same object
// directly. This page needs a real page size — matches
// TRANSACTION_HISTORY_PAGE_SIZE in useTransactionBoard.ts.
const TRANSACTION_HISTORY_PAGE_SIZE = 20;

// Redux search payload without page — changes here mean a new result set (reset accumulated rows).
function searchPayloadWithoutPageKey(
  payload: SearchTransactionsRequestPayload | null,
): string {
  if (!payload) return "";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page: _p, ...rest } = payload;
  return JSON.stringify(rest);
}

type TabValue = { status?: string; type?: string; pending?: boolean };

const STATUS_TABS: { label: string; value: TabValue }[] = [
  { label: "All", value: {} },
  { label: "Buys", value: { type: "BUY" } },
  { label: "Sells", value: { type: "SELL" } },
  { label: "Pending", value: { pending: true } },
  { label: "Completed", value: { status: "COMPLETED" } },
  { label: "Failed", value: { status: "FAILED" } },
];

export function TransactionDashboard() {
  const dispatch = useDispatch();
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
    userTransactionHistory,
    loadingUserTransactionHistory,
    fetchingUserTransactionHistory,
    filters,
    handleSearchChange,
    handleFiltersChange,
    handleLoadMore,
    transactionSummary,
    loadingTransactionSummary,
  } = useTransactionBoard();

  // On first load, the Redux search payload may still carry the dashboard
  // widget's size:5 default (nothing had dispatched a History-page-scoped
  // size yet) — bump it once up front so the very first fetch already uses
  // a real page size instead of only 5 rows.
  useEffect(() => {
    if (searchPayload?.size !== TRANSACTION_HISTORY_PAGE_SIZE) {
      dispatch(
        setSearchUserTransactions({
          ...searchPayload,
          size: TRANSACTION_HISTORY_PAGE_SIZE,
        } as SearchTransactionsRequestPayload),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    handleFiltersChange({ ...filters, status: val.status, type: val.type, pending: val.pending });
  };

  // Summary stats are fixed lifetime totals — same numbers as the Dashboard —
  // and deliberately do NOT move when the Buys/Sells/Completed/Failed tabs
  // below are used to filter the transaction list. Only the list changes.
  const overallTotals = transactionSummary?.overallTotals;
  const total = overallTotals ? Number(overallTotals.transactionCount) : 0;
  const bought = transactionSummary?.total
    ? transactionSummary.total.reduce((sum, item) => sum + Number(item.fiatSpentOnBuying || 0), 0)
    : 0;
  const sold = transactionSummary?.total
    ? transactionSummary.total.reduce((sum, item) => sum + Number(item.fiatReceivedFromSelling || 0), 0)
    : 0;
  const pendingBuying = overallTotals ? Number(overallTotals.pendingFiatBuying) : 0;
  const pendingSelling = overallTotals ? Number(overallTotals.pendingFiatSelling) : 0;

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      {/* ── page header (shared mobile + desktop) ── */}
      <div className="px-5 lg:px-0 pt-6 pb-4">
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

      {/* ── summary pills — fixed lifetime totals, independent of the active tab below ── */}
      <div
        className="px-5 lg:px-0 mb-5 flex gap-2.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {[
          { label: "TOTAL", val: String(total), loading: loadingTransactionSummary },
          { label: "BOUGHT", val: `₦${formatCompact(bought, "NGN", 0)}`, loading: loadingTransactionSummary },
          { label: "SOLD", val: `₦${formatCompact(sold, "NGN", 0)}`, loading: loadingTransactionSummary },
        ].map(({ label, val, loading }) => (
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
            {loading ? (
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

        {/* Pending — amount still in flight, broken out by BUY/SELL */}
        <div
          className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl shrink-0"
          style={{
            background: "#F7F7F9",
            border: "1px solid #EEEEEE",
            minWidth: "110px",
          }}
        >
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#9A9A9A" }}
          >
            PENDING
          </p>
          {loadingTransactionSummary ? (
            <div className="mt-1 h-6 w-14 rounded animate-pulse bg-gray-200" />
          ) : (
            <div className="mt-0.5 space-y-0.5 text-center">
              <p className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "#0E0F0C" }}>
                Buy ₦{formatCompact(pendingBuying, "NGN", 0)}
              </p>
              <p className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "#0E0F0C" }}>
                Sell ₦{formatCompact(pendingSelling, "NGN", 0)}
              </p>
            </div>
          )}
        </div>
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
