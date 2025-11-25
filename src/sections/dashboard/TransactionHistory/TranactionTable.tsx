import TransactionPagination from "./TransactionPagination.tsx";
import type {TransactionResponseEntity} from "../../../types/response.payload.types.ts";
import CustomLoader from "../../../components/global/Loader.tsx";
import TransactionRow from "./TransactionRow.tsx";
import { Link } from "@tanstack/react-router";

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

const TransactionTable = ({ transactions, isLoading, totalPages, onPageChange, currentPage }: TransactionTableProps) => {
  const COL_COUNT = 7;
  
  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className="text-center p-8 text-lg text-gray-500">
            <div className="flex justify-center items-center space-x-3 min-h-[150px] md:min-h-[300px]">
              <CustomLoader />
            </div>
          </td>
        </tr>
      );
    }
    
    if (transactions.length === 0) {
      return (
        <tr>
          <td colSpan={COL_COUNT} className="text-center p-8 text-lg text-gray-500">
            <div className={`flex flex-col gap-7 items-center justify-center text-center`}>
              <h2 className={`text-primary text-[40px] font-semibold w-4/5 leading-12`}>No transaction had been performed yet</h2>

              <Link
                to={`/trade-crypto`}
                type="button"
                className={`py-4 md:py-2 rounded-full block md:order-2 w-full md:w-1/2 text-lg text-center font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
              >
                Buy / Sell Crypto
              </Link>
            </div>
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

export default TransactionTable;
