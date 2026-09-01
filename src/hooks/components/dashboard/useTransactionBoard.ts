import { useMemo, useState } from "react";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";
import type { FilterState } from "../../../sections/dashboard/TransactionHistory/TranactionTable.tsx";
import { useDispatch } from "react-redux";
import { type RootState, store } from "../../../store.ts";
import { setSearchUserTransactions } from "../../../redux/transaction.slice.ts";
import type { SearchTransactionsRequestPayload } from "../../../types/request.payload.types.ts";
import momentClient from "../../../lib/moment.ts";
import { TIME_IN_MILLISECONDS } from "../../../util/constants.util.ts";
import { debounce } from "../../../util/debouce.util.ts";

// userSearchTransactionInitialState.size (5) is sized for the dashboard's
// small "Recent Orders" preview widget — the full Transaction History page
// needs a real page size, or filtering/paging through it only ever surfaces
// a handful of rows per request.
const TRANSACTION_HISTORY_PAGE_SIZE = 20;

export const useTransactionBoard = () => {
  const dispatch = useDispatch();
  const {
    userTransactionHistory,
    loadingUserTransactionHistory,
    fetchingUserTransactionHistory,
    filteredTransactionSummary,
    loadingFilteredTransactionSummary,
    transactionSummary,
    loadingTransactionSummary,
  } = useTransactionQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    fromDate: "",
    toDate: "",
    cryptocurrency: "",
    status: "",
    type: "",
  });
  const handlePageChange = (page: number) => {
    const searchTransactionPayload = (store.getState() as RootState)
      ?.transaction?.dashboard
      ?.searchUserTransactions as SearchTransactionsRequestPayload;
    const updatedPayload: SearchTransactionsRequestPayload = {
      ...searchTransactionPayload,
      page,
    };

    dispatch(setSearchUserTransactions(updatedPayload));
  };

  // Loads the next API page; UI merges rows (transaction history page only).
  const handleLoadMore = () => {
    const current = userTransactionHistory?.page ?? 1;
    const totalPages = userTransactionHistory?.totalPages ?? 1;
    if (current >= totalPages) return;
    handlePageChange(current + 1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    const searchTransactionPayload = (store.getState() as RootState)
      ?.transaction?.dashboard
      ?.searchUserTransactions as SearchTransactionsRequestPayload;
    const updatedPayload: SearchTransactionsRequestPayload = {
      ...searchTransactionPayload,
      createdAtFrom: newFilters.fromDate
        ? momentClient.toISOStringFromDate(new Date(newFilters.fromDate))
        : undefined,
      createdAtTo: newFilters.toDate
        ? momentClient.toISOStringFromDate(new Date(newFilters.toDate))
        : undefined,
      cryptoCurrencyId: newFilters.cryptocurrency || undefined,
      page: 1,
      size: TRANSACTION_HISTORY_PAGE_SIZE,
      status: (newFilters.status || undefined) as any,
      type: (newFilters.type || undefined) as any,
      pending: newFilters.pending || undefined,
    };

    dispatch(setSearchUserTransactions(updatedPayload));

    setFilters(newFilters);
  };

  // Debounced function that only dispatches to Redux (triggers API call).
  // Keeps the currently active status/type tab and page size — previously
  // this reset to userSearchTransactionInitialState wholesale, which
  // silently dropped the active filter tab (and shrank back to size 5)
  // as soon as the user typed into search.
  const debouncedDispatch = useMemo(
    () =>
      debounce((query: string) => {
        const searchTransactionPayload = (store.getState() as RootState)
          ?.transaction?.dashboard
          ?.searchUserTransactions as SearchTransactionsRequestPayload;
        const updatedPayload: SearchTransactionsRequestPayload = {
          ...searchTransactionPayload,
          searchQuery: query || undefined,
          page: 1,
          size: TRANSACTION_HISTORY_PAGE_SIZE,
        };
        dispatch(setSearchUserTransactions(updatedPayload));
      }, TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS),
    [dispatch],
  );

  // Handler that updates input immediately and triggers debounced dispatch
  const handleSearchChange = (query: string) => {
    // Update input value immediately for responsive UI
    setSearchQuery(query);
    // Dispatch to Redux after debounce delay (triggers API call)
    debouncedDispatch(query);
  };

  return {
    // Values
    searchQuery,
    userTransactionHistory,
    loadingUserTransactionHistory,
    fetchingUserTransactionHistory,
    filters,
    filteredTransactionSummary,
    loadingFilteredTransactionSummary,
    transactionSummary,
    loadingTransactionSummary,

    // Functions
    setSearchQuery,
    handlePageChange,
    handleLoadMore,
    handleFiltersChange,
    handleSearchChange,
  };
};
