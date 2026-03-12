import { useState } from "react";
import { TransactionSearch } from "./TranactionSearch.tsx";
import ExportTransaction from "./ExportTransaction.tsx";
import { useTransactionBoard } from "../../../hooks/components/dashboard/useTransactionBoard.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import TransactionTable from "./TranactionTable.tsx";

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

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (tabValue: TabValue, index: number) => {
    setActiveTabIndex(index);
    handleFiltersChange({
      ...filters,
      status: tabValue.status,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold" style={{ color: "#0E0F0C" }}>
            Transaction History
          </h4>
          <p className="text-xs" style={{ color: "#9A9A9A" }}>
            All your buy &amp; sell orders
          </p>
        </div>
        <ExportTransaction />
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {STATUS_TABS.map((tab, index) => {
          const active = index === activeTabIndex;
          return (
            <button
              key={tab.label}
              onClick={() => handleTabChange(tab.value, index)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-150"
              style={{
                background: active ? "#03034D" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#6B6E6B",
                border: active ? "1px solid #03034D" : "1px solid #ECECEC",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search + filter row */}
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

      {/* Table / cards */}
      <TransactionTable
        transactions={
          (!loadingUserTransactionHistory && userTransactionHistory?.transactions) || []
        }
        totalPages={(!loadingUserTransactionHistory && userTransactionHistory?.totalPages) || 1}
        currentPage={(!loadingUserTransactionHistory && userTransactionHistory?.page) || 1}
        pageSize={(!loadingUserTransactionHistory && userTransactionHistory?.limit) || 10}
        totalItems={(!loadingUserTransactionHistory && userTransactionHistory?.count) || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={loadingUserTransactionHistory}
      />
    </div>
  );
}
