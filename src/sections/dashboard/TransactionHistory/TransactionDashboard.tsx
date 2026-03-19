import { useState } from "react";
import { useTransactionBoard } from "../../../hooks/components/dashboard/useTransactionBoard.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import { TransactionSearch } from "./TranactionSearch.tsx";
import ExportTransaction from "./ExportTransaction.tsx";
import TransactionTable from "./TranactionTable.tsx";
import { convertToMillify } from "../../../util/index.util.ts";

type TabValue = { status?: string; type?: string };

const STATUS_TABS: { label: string; value: TabValue }[] = [
  { label: "All",       value: {} },
  { label: "Buys",      value: { type: "BUY" } },
  { label: "Sells",     value: { type: "SELL" } },
  { label: "Pending",   value: { status: "PENDING" } },
  { label: "Completed", value: { status: "COMPLETED" } },
  { label: "Failed",    value: { status: "FAILED" } },
];

export function TransactionDashboard() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const {
    searchQuery,
    showFilters,
    userTransactionHistory,
    loadingUserTransactionHistory,
    filters,
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,
    setShowFilters,
    handleSearchChange,
    handleFiltersChange,
    handlePageChange,
    handlePageSizeChange,
  } = useTransactionBoard();

  const handleTab = (val: TabValue, idx: number) => {
    setActiveTabIdx(idx);
    handleFiltersChange({ ...filters, status: val.status });
  };

  /* summary stats */
  const total  = userTransactionHistory?.count ?? 0;
  const bought = userTransactionHistory?.transactions
    ?.filter(t => t.type.toUpperCase() === "BUY")
    .reduce((a, t) => a + Number(t.amountFiat), 0) ?? 0;
  const sold = userTransactionHistory?.transactions
    ?.filter(t => t.type.toUpperCase() === "SELL")
    .reduce((a, t) => a + Number(t.amountFiat), 0) ?? 0;

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>

      {/* ── mobile page header ── */}
      <div className="lg:hidden px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-extrabold" style={{ color: "#0E0F0C", fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
            Transaction History
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>All your buy &amp; sell orders</p>
        </div>
        <div className="shrink-0">
          <ExportTransaction />
        </div>
      </div>

      {/* ── summary pills ── */}
      <div className="px-5 lg:px-0 mb-5 flex gap-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {[
          { label: "TOTAL",  val: String(total) },
          { label: "BOUGHT", val: `₦${convertToMillify(bought, 0)}` },
          { label: "SOLD",   val: `₦${convertToMillify(sold, 0)}` },
        ].map(({ label, val }) => (
          <div key={label} className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl shrink-0"
            style={{ background: "#F7F7F9", border: "1px solid #EEEEEE", minWidth: "90px" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>{label}</p>
            {loadingUserTransactionHistory
              ? <div className="mt-1 h-4 w-14 rounded animate-pulse bg-gray-200" />
              : <p className="text-sm font-extrabold mt-0.5" style={{ color: "#0E0F0C" }}>{val}</p>
            }
          </div>
        ))}
        {/* Desktop export */}
        <div className="ml-auto hidden lg:flex shrink-0 items-center">
          <ExportTransaction />
        </div>
      </div>

      {/* ── filter tabs ── */}
      <div className="px-5 lg:px-0 flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth: "none" }}>
        {STATUS_TABS.map((tab, i) => {
          const active = i === activeTabIdx;
          return (
            <button key={tab.label}
              onClick={() => handleTab(tab.value, i)}
              className="px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all"
              style={{
                background: active ? "#948EEE" : "#F7F7F9",
                color:      active ? "#FFFFFF" : "#6B6E6B",
                border:     active ? "1px solid #948EEE" : "1px solid #EEEEEE",
              }}>
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
          transactions={(!loadingUserTransactionHistory && userTransactionHistory?.transactions) || []}
          totalPages={(!loadingUserTransactionHistory && userTransactionHistory?.totalPages) || 1}
          currentPage={(!loadingUserTransactionHistory && userTransactionHistory?.page) || 1}
          pageSize={(!loadingUserTransactionHistory && userTransactionHistory?.limit) || 10}
          totalItems={(!loadingUserTransactionHistory && userTransactionHistory?.count) || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={loadingUserTransactionHistory}
        />
      </div>
    </div>
  );
}
