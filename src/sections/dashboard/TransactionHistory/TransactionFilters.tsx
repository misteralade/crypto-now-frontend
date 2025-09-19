import { ChevronDown } from "lucide-react"
import type {FilterState} from "./TranactionTable.tsx";
import { useState } from "react";
import DatePicker from "./DatePicker.tsx";

interface TransactionFiltersProps {
    onClose: () => void
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
}

export function TransactionFilters({ onClose, filters, onFiltersChange }: TransactionFiltersProps) {
    const [localFilters, setLocalFilters] = useState(filters)

    const handleApply = () => {
        onFiltersChange(localFilters)
        onClose()
    }

    const handleReset = () => {
        const resetFilters = { fromDate: '', toDate: '', cryptocurrency: '', status: '' }
        setLocalFilters(resetFilters)
        onFiltersChange(resetFilters)
        onClose()
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
              className="absolute top-14 left-0 z-50 bg-white bg-card border shadow-xl border-border rounded-lg p-6 space-y-6 w-full md:w-3xl"
        >
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-filter text-left">Date Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                        value={localFilters.fromDate}
                        onChange={(date) => setLocalFilters({ ...localFilters, fromDate: date })}
                        placeholder="From"
                    />
                    <DatePicker
                        value={localFilters.toDate}
                        onChange={(date) => setLocalFilters({ ...localFilters, toDate: date })}
                        placeholder="To"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-filter block text-left">Cryptocurrency</label>
                    <div className="relative">
                        <select
                            value={localFilters.cryptocurrency}
                            onChange={(e) => setLocalFilters({ ...localFilters, cryptocurrency: e.target.value })}
                            className="w-full appearance-none pl-4 pr-10 py-2 border border-border rounded-3xl bg-background text-desc focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="USDT">Tether (USDT)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-desc w-4 h-4 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-filter text-left block">Status</label>
                    <div className="relative">
                        <select
                            value={localFilters.status}
                            onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                            className="w-full appearance-none pl-4 pr-10 py-2 border border-border rounded-3xl bg-background text-desc focus:outline-none"
                        >
                            <option value="">All</option>
                            <option value="completed">Completed</option>
                            <option value="expired">Expired</option>
                            <option value="failed">Failed</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-desc w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button onClick={handleReset} className="px-4 py-2 font-semibold text-primary rounded-lg transition-colors">
                    Reset
                </button>
                <button
                    onClick={handleApply}
                    className="px-6 py-3 cursor-pointer bg-primary text-primary-foreground rounded-3xl hover:bg-primary/90 transition-colors"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    )
}
