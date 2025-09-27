import {useState} from "react";

export const useTransactionBoard = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return {
    // Values
    searchQuery,
    showFilters,

    // Functions
    setSearchQuery,
    setShowFilters,
  }
}