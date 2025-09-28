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
}

export function TransactionTable({ transactions, totalPages, onPageChange, currentPage }: TransactionTableProps) {
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
            {transactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isLast={index === transactions.length - 1}
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
