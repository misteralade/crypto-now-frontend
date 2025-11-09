import {TransactionSearch} from "./TranactionSearch.tsx";
import ExportTransaction from "./ExportTransaction.tsx";
import {useTransactionBoard} from "../../../hooks/components/dashboard/useTransactionBoard.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import TransactionTable from "./TranactionTable.tsx";
import EmptyTransaction from "../EmptyTransaction.tsx";
import {Fragment} from "react";

export function TransactionDashboard() {
  const {
    // Values
    searchQuery,
    showFilters,
    userTransactionHistory,
    loadingUserTransactionHistory,
    filters,
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,

    // Functions
    setShowFilters,
    handleSearchChange,
    handleFiltersChange,
    handlePageChange,
  } = useTransactionBoard();

  if (!loadingUserTransactionHistory && userTransactionHistory?.count === 0) {
    return (
      <Fragment>
        <EmptyTransaction/>
      </Fragment>
    )
  }
  
  return (
    <div className="w-full space-y-6">
      {/*heading */}
      <div className={`flex flex-col md:flex-row justify-between md:items-center gap-3`}>
        <h4 className={`text-desc text-2xl font-medium`}>Transaction History</h4>
        <ExportTransaction />
      </div>

      <TransactionSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        setShowFilters={setShowFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        supportedCrypto={!loadingSupportedCryptocurrencies && supportedCryptoCurrencies ? supportedCryptoCurrencies : [] as SupportedCryptoOrCurrencyResponse[]}
      />

      <TransactionTable
        transactions={!loadingUserTransactionHistory && userTransactionHistory?.transactions || []}
        totalPages={!loadingUserTransactionHistory && userTransactionHistory?.totalPages || 1}
        currentPage={!loadingUserTransactionHistory && userTransactionHistory?.page || 1}
        onPageChange={handlePageChange}
        isLoading={loadingUserTransactionHistory}
      />
    </div>
  )
}
