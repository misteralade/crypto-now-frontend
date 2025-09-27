import { useState } from "react"
import {TransactionTable} from "./TranactionTable.tsx";
import {TransactionSearch} from "./TranactionSearch.tsx";
import type {FilterState} from "./TranactionTable.tsx";
import ExportTransaction from "./ExportTransaction.tsx";
import {useTransactionBoard} from "../../../hooks/components/dashboard/useTransactionBoard.ts";

export function TransactionDashboard() {
    const {
        // Values
        searchQuery,
        showFilters,

        // Functions
        setSearchQuery,
        setShowFilters
    } = useTransactionBoard();

    const [filters, setFilters] = useState<FilterState>({
        fromDate: '',
        toDate: '',
        cryptocurrency: '',
        status: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handleSearchChange = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
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
            />

            <TransactionTable
                searchQuery={searchQuery}
                filters={filters}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}/>
        </div>
    )
}
