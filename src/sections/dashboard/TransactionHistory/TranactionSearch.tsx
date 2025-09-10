import {Search, Filter} from "lucide-react"
import {TransactionFilters} from "./TransactionFilters.tsx";
import type {FilterState} from "./TranactionTable.tsx";

interface TransactionSearchProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    showFilters: boolean
    onToggleFilters: () => void
    setShowFilters: (show: boolean) => void
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
}

export function TransactionSearch({
                                      searchQuery,
                                      onSearchChange,
                                      showFilters,
                                      onToggleFilters,
                                      setShowFilters,
                                      filters,
                                      onFiltersChange,
                                  }: TransactionSearchProps) {
    return (
        <div className="flex gap-4 w-full md:w-1/3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey w-6 h-6"/>
                <input
                    type="text"
                    placeholder="Search transaction"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-3xl placeholder:text-grey focus:outline-none"
                />
            </div>

            <button
                onClick={onToggleFilters}
                className={`relative flex items-center cursor-pointer gap-2 px-4 py-2  font-medium border border-border rounded-3xl transition-colors whitespace-nowrap ${
                    showFilters ? "bg-primary text-white" : "bg-background text-desc hover:bg-primary/70 hover:text-white"
                }`}
            >
                <Filter className="w-4 h-4"/>
                Filter

                {showFilters && (
                    <TransactionFilters
                        onClose={() => setShowFilters(false)}
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                    />
                )}
            </button>
        </div>
    )
}
