import {useMemo, useState} from "react";
import {useTransactionQuery} from "../../../queries/transaction.query.ts";
import type {FilterState} from "../../../sections/dashboard/TransactionHistory/TranactionTable.tsx";
import {useDispatch} from "react-redux";
import {type RootState, store} from "../../../store.ts";
import { setSearchUserTransactions } from "../../../redux/transaction.slice.ts";
import type {SearchTransactionsRequestPayload} from "../../../types/request.payload.types.ts";
import momentClient from "../../../lib/moment.ts";
import {useCryptoQuery} from "../../../queries/crypto.query.ts";
import {userSearchTransactionInitialState} from "../../../redux/states/initial-transaction.state.ts";
import {TIME_IN_MILLISECONDS} from "../../../util/constants.ts";
import {debounce} from "../../../util/debouce.util.ts";

export const useTransactionBoard = () => {
  const dispatch = useDispatch();
  const { userTransactionHistory, loadingUserTransactionHistory } = useTransactionQuery();
  const { supportedCryptoCurrencies, loadingSupportedCryptocurrencies} = useCryptoQuery();

  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    fromDate: '',
    toDate: '',
    cryptocurrency: '',
    status: ''
  })
  const handlePageChange = (page: number) => {
    const searchTransactionPayload = (store.getState() as RootState)?.transaction?.dashboard?.searchUserTransactions as SearchTransactionsRequestPayload;
    const updatedPayload: SearchTransactionsRequestPayload = {
      ...searchTransactionPayload,
      page,
    };

    dispatch(setSearchUserTransactions(updatedPayload))
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    const searchTransactionPayload = (store.getState() as RootState)?.transaction?.dashboard?.searchUserTransactions as SearchTransactionsRequestPayload;
    const updatedPayload: SearchTransactionsRequestPayload = {
      ...searchTransactionPayload,
      createdAtFrom: newFilters.fromDate ? momentClient.toISOStringFromDate(new Date(newFilters.fromDate)) : undefined,
      createdAtTo: newFilters.toDate ? momentClient.toISOStringFromDate(new Date(newFilters.toDate)) : undefined,
      cryptoCurrencyId: newFilters.cryptocurrency || undefined,
      page: 1,
      status: (newFilters.status || undefined) as any,
    };

    dispatch(setSearchUserTransactions(updatedPayload))

    setFilters(newFilters)
  }

  const handleSearchChange = useMemo(
    () =>
      debounce((query: string) => {
        const updatedPayload = {
          ...userSearchTransactionInitialState,
          searchQuery: query || undefined,
        };
        dispatch(setSearchUserTransactions(updatedPayload as SearchTransactionsRequestPayload));
        setSearchQuery(query);
      }, TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS),
    [dispatch]
  );

  return {
    // Values
    searchQuery,
    showFilters,
    userTransactionHistory,
    loadingUserTransactionHistory,
    filters,
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,

    // Functions
    setSearchQuery,
    setShowFilters,
    handlePageChange,
    handleFiltersChange,
    handleSearchChange,
  }
}