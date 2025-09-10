import {TransactionRow} from "./TransactionRow.tsx";
import TransactionPagination from "./TransactionPagination.tsx";

export interface FilterState {
    fromDate: string
    toDate: string
    cryptocurrency: string
    status: string
}

// Dummy data
const transactions = [
    {
        id: "2ab41e2c",
        date: "25-09-2025 05:50 AM",
        type: "Buy",
        amount: "0.005 BTC",
        rate: "1580 NGN",
        fee: "2 USD",
        status: "completed",
        cryptocurrency: "BTC",
        rawDate: new Date("2025-09-25")
    },
    {
        id: "c17b9b92",
        date: "20-09-2025 05:50 AM",
        type: "Sell",
        amount: "150 USDT",
        rate: "1540 NGN",
        fee: "1 USD",
        status: "completed",
        cryptocurrency: "USDT",
        rawDate: new Date("2025-09-20")
    },
    {
        id: "a9e4c57f",
        date: "12-09-2025 05:50 AM",
        type: "Sell",
        amount: "0.003 BTC",
        rate: "1586 NGN",
        fee: "1.5 USD",
        status: "expired",
        cryptocurrency: "BTC",
        rawDate: new Date("2025-09-12")
    },
    {
        id: "c575b376",
        date: "12-09-2025 05:50 AM",
        type: "Sell",
        amount: "100 USDT",
        rate: "1600 NGN",
        fee: "1 USD",
        status: "completed",
        cryptocurrency: "USDT",
        rawDate: new Date("2025-09-12")
    },
    {
        id: "2429e337",
        date: "10-09-2025 05:50 AM",
        type: "Buy",
        amount: "200 USDT",
        rate: "1570 NGN",
        fee: "2 USD",
        status: "expired",
        cryptocurrency: "USDT",
        rawDate: new Date("2025-09-10")
    },
    {
        id: "7e6b2b2f",
        date: "05-09-2025 05:50 AM",
        type: "Sell",
        amount: "0.001 BTC",
        rate: "1530 NGN",
        fee: "1 USD",
        status: "failed",
        cryptocurrency: "BTC",
        rawDate: new Date("2025-09-05")
    },
    {
        id: "8f9c1a2b",
        date: "03-09-2025 10:30 AM",
        type: "Buy",
        amount: "0.002 ETH",
        rate: "120000 NGN",
        fee: "1.5 USD",
        status: "completed",
        cryptocurrency: "ETH",
        rawDate: new Date("2025-09-03")
    },
    {
        id: "9e7d5c4a",
        date: "01-09-2025 02:15 PM",
        type: "Sell",
        amount: "0.001 ETH",
        rate: "115000 NGN",
        fee: "1 USD",
        status: "failed",
        cryptocurrency: "ETH",
        rawDate: new Date("2025-09-01")
    },
    {
        id: "4b8e2f1c",
        date: "28-08-2025 08:45 AM",
        type: "Buy",
        amount: "50 USDT",
        rate: "1620 NGN",
        fee: "0.5 USD",
        status: "completed",
        cryptocurrency: "USDT",
        rawDate: new Date("2025-08-28")
    },
    {
        id: "6d3f9a7e",
        date: "25-08-2025 06:20 PM",
        type: "Sell",
        amount: "0.0015 BTC",
        rate: "1590 NGN",
        fee: "1.2 USD",
        status: "completed",
        cryptocurrency: "BTC",
        rawDate: new Date("2025-08-25")
    }
]

interface TransactionTableProps {
    searchQuery: string;
    filters: any;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void
}

export function TransactionTable({ searchQuery, filters, onPageChange, currentPage, itemsPerPage }: TransactionTableProps) {
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.amount.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCrypto = !filters.cryptocurrency || transaction.cryptocurrency === filters.cryptocurrency
        const matchesStatus = !filters.status || transaction.status === filters.status

        let matchesDateRange = true
        if (filters.fromDate || filters.toDate) {
            const transactionDate = transaction.rawDate
            const fromDate = filters.fromDate ? new Date(filters.fromDate) : null
            const toDate = filters.toDate ? new Date(filters.toDate) : null

            if (fromDate && transactionDate < fromDate) matchesDateRange = false
            if (toDate && transactionDate > toDate) matchesDateRange = false
        }

        return matchesSearch && matchesCrypto && matchesStatus && matchesDateRange
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rate</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fee</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedTransactions.map((transaction, index) => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={transaction}
                                isLast={index === paginatedTransactions.length - 1}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <TransactionPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    )
}
