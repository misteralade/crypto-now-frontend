import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import CustomLoader from "../../../components/global/Loader.tsx";
import TransactionRow from "./TransactionRow.tsx";
import { useNavigate } from "@tanstack/react-router";
import TableFooter from "../../../components/global/table/TableFooter.tsx";
import { useCryptoQuery } from "../../../queries/crypto.query.ts";
import { useCurrencyQuery } from "../../../queries/currency.query.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

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

/* ── Skeleton row ── */
const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-4 animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3.5 bg-gray-100 rounded w-32" />
      <div className="h-2.5 bg-gray-100 rounded w-20" />
    </div>
    <div className="text-right space-y-1.5">
      <div className="h-3.5 bg-gray-100 rounded w-20" />
      <div className="h-2.5 bg-gray-100 rounded w-14 ml-auto" />
    </div>
  </div>
);

const TransactionTable = ({
  transactions,
  isLoading,
  totalPages,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TransactionTableProps) => {
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, loadingSupportedCrypto } = useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } = useCurrencyQuery();

  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [supportedCurrency, setSupportedCurrency] = useState("");
  const [selectedAction] = useState<"BUY" | "SELL">("BUY");

  useEffect(() => {
    if (supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0) {
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
    }
  }, [loadingSupportedCrypto, supportedCryptoCurrencies]);

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

  if (isLoading) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <SkeletonRow />
            {i < 4 && <div style={{ height: "1px", background: "#F4F5F7" }} />}
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-5"
        style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "#F0EFFD" }}
        >
          <TrendingUp size={28} style={{ color: "#948EEE" }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: "#0E0F0C" }}>
            No transactions yet
          </h3>
          <p className="text-sm" style={{ color: "#6B6E6B" }}>
            Start by buying or selling crypto
          </p>
        </div>
        <button
          onClick={handleTradeCrypto}
          disabled={!selectedCrypto || !supportedCurrency || loadingSupportedCrypto || loadingSupportedCurrencies}
          className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          style={{ background: "#948EEE" }}
        >
          Buy / Sell Crypto
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Mobile card list ── */}
      <div className="lg:hidden rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}>
        {transactions.map((transaction, index) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            isLast={index === transactions.length - 1}
            isMobileCard
          />
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden lg:block rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F4F5F7", borderBottom: "1px solid #ECECEC" }}>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Ref</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Crypto</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Amount (NGN)</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Rate</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9A9A9A" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isLast={index === transactions.length - 1}
                  isMobileCard={false}
                />
              ))}
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
  );
};

export default TransactionTable;
