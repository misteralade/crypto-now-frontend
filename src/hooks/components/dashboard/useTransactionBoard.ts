import {useState} from "react";
import {useTransactionQuery} from "../../../queries/transaction.query.ts";

export const useTransactionBoard = () => {
  const { userTransactionHistory, loadingUserTransactionHistory } = useTransactionQuery();

  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return {
    // Values
    searchQuery,
    showFilters,
    userTransactionHistory,
    loadingUserTransactionHistory,

    // Functions
    setSearchQuery,
    setShowFilters,
  }
}