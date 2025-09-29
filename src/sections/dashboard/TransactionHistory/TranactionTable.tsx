import {TransactionRow} from "./TransactionRow.tsx";
import TransactionPagination from "./TransactionPagination.tsx";
import type {TransactionResponseEntity} from "../../../types/response.payload.types.ts";

export interface FilterState {
    fromDate: string | undefined;
    toDate: string | undefined;
    cryptocurrency: string | undefined;
    status: string | undefined;
}

interface TransactionTableProps {
    transactions: TransactionResponseEntity[];
    totalPages: number
    currentPage: number;
    onPageChange: (page: number) => void
    isLoading: boolean;
}

export function TransactionTable({
                                     transactions,
                                     isLoading,
                                     totalPages,
                                     onPageChange,
                                     currentPage
                                 }: TransactionTableProps) {
    const COL_COUNT = 7;

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={7} className="text-center p-8 text-lg text-gray-500">
                        <div className="flex justify-center items-center space-x-3 min-h-[150px] md:min-h-[300px]">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                <div
                                    className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            );
        }

        if (transactions.length === 0) {
            return (
                <tr>
                    <td colSpan={COL_COUNT} className="text-center p-8 text-lg text-gray-500">
                        No transactions found.
                    </td>
                </tr>
            );
        }

        return transactions.map((transaction, index) => (
            <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isLast={index === transactions.length - 1}
            />
        ));
    };


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
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableBody()}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && !isLoading && (
                <TransactionPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    )
}
