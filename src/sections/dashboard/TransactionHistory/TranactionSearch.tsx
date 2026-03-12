import {Search, Filter} from "lucide-react"
import {TransactionFilters} from "./TransactionFilters.tsx";
import type {FilterState} from "./TranactionTable.tsx";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";

interface TransactionSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  setShowFilters: (show: boolean) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  supportedCrypto:  SupportedCryptoOrCurrencyResponse[];
}

export function TransactionSearch({ searchQuery, onSearchChange, showFilters, onToggleFilters, setShowFilters, filters, onFiltersChange, supportedCrypto }: TransactionSearchProps) {
  return (
    <div className="relative flex gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9A9A9A" }} />
        <input
          type="text"
          placeholder="Search by ref or crypto..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl focus:outline-none"
          style={{
            background: "#FFFFFF",
            border: "1px solid #ECECEC",
            color: "#0E0F0C",
          }}
        />
      </div>

      <div className="relative">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          style={{
            background: showFilters ? "#03034D" : "#FFFFFF",
            color: showFilters ? "#FFFFFF" : "#6B6E6B",
            border: showFilters ? "1px solid #03034D" : "1px solid #ECECEC",
          }}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>

        {showFilters && (
          <TransactionFilters
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFiltersChange={onFiltersChange}
            supportedCrypto={supportedCrypto ?? []}
          />
        )}
      </div>
    </div>
  )
}
