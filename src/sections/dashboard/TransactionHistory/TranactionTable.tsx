import type {TransactionResponseEntity} from "../../../types/response.payload.types.ts";
import CustomLoader from "../../../components/global/Loader.tsx";
import TransactionRow from "./TransactionRow.tsx";
import { useNavigate } from "@tanstack/react-router";
import TableFooter from "../../../components/global/table/TableFooter.tsx";
import { useCryptoQuery } from "../../../queries/crypto.query.ts";
import { useCurrencyQuery } from "../../../queries/currency.query.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import { useEffect, useState } from "react";

export interface FilterState {
  fromDate: string | undefined;
  toDate: string | undefined;
  cryptocurrency: string | undefined;
  status: string | undefined;
}

interface TransactionTableProps {
  transactions: TransactionResponseEntity[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
}

const TransactionTable = ({ transactions, isLoading, totalPages, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }: TransactionTableProps) => {
  const COL_COUNT = 7;
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, loadingSupportedCrypto } = useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } = useCurrencyQuery();
  
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [supportedCurrency, setSupportedCurrency] = useState("");
  const [selectedAction] = useState<"BUY" | "SELL">("BUY");

  // Select first crypto currency when loaded
  useEffect(() => {
    if (supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0) {
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
    }
  }, [loadingSupportedCrypto, supportedCryptoCurrencies]);

  // Select first currency when loaded
  useEffect(() => {
    if (supportedCurrencies && supportedCurrencies.length > 0) {
      setSupportedCurrency(supportedCurrencies[0].id);
    }
  }, [loadingSupportedCurrencies, supportedCurrencies]);

  const handleTradeCrypto = () => {
    if (selectedCrypto && supportedCurrency) {
      navigate({
        to: `${ROUTES.TRADE_CRYPTO}?option=${selectedAction.toLowerCase()}&currency=${supportedCurrency}&token=${selectedCrypto}`,
      });
    }
  };
  
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

              <button
                onClick={handleTradeCrypto}
                disabled={!selectedCrypto || !supportedCurrency || loadingSupportedCrypto || loadingSupportedCurrencies}
                className={`py-4 md:py-2 rounded-full block md:order-2 w-full md:w-1/2 text-lg text-center font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
              >
                Buy / Sell Crypto
              </button>
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
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Session ID</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount (Crypto)</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount (USD)</th>
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
      
      {!isLoading && (
        <TableFooter
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}

export default TransactionTable;
