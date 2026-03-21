import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import TransactionRow from "./TransactionRow.tsx";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
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
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  isLoading: boolean;
}

/* skeleton card row */
const SkeletonCard = () => (
  <div className="px-4 py-3.5 flex items-center gap-3 animate-pulse">
    <div
      className="w-11 h-11 rounded-2xl shrink-0"
      style={{ background: "#F0F0F0" }}
    />
    <div className="flex-1 space-y-2">
      <div
        className="h-3.5 rounded-lg w-28"
        style={{ background: "#F0F0F0" }}
      />
      <div
        className="h-2.5 rounded-lg w-20"
        style={{ background: "#F0F0F0" }}
      />
    </div>
    <div className="text-right space-y-2">
      <div
        className="h-3.5 rounded-lg w-16 ml-auto"
        style={{ background: "#F0F0F0" }}
      />
      <div
        className="h-2.5 rounded-lg w-10 ml-auto"
        style={{ background: "#F0F0F0" }}
      />
    </div>
  </div>
);

const TransactionTable = ({
  transactions,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: TransactionTableProps) => {
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, loadingSupportedCrypto } =
    useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } =
    useCurrencyQuery();
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [supportedCurrency, setSupportedCurrency] = useState("");

  useEffect(() => {
    if (supportedCryptoCurrencies?.length)
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
  }, [loadingSupportedCrypto, supportedCryptoCurrencies]);

  useEffect(() => {
    if (supportedCurrencies?.length)
      setSupportedCurrency(supportedCurrencies[0].id);
  }, [loadingSupportedCurrencies, supportedCurrencies]);

  const goTrade = () => {
    if (selectedCrypto && supportedCurrency)
      navigate({
        to: `${ROUTES.TRADE_CRYPTO}?option=buy&currency=${supportedCurrency}&token=${selectedCrypto}`,
      });
  };

  if (isLoading) {
    return (
      <div
        className="rounded-3xl overflow-hidden"
        style={{ border: "1px solid #F0F0F0" }}
      >
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <SkeletonCard />
            {i < 4 && (
              <div
                style={{
                  height: "1px",
                  background: "#F7F7F9",
                  margin: "0 16px",
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        className="rounded-3xl py-14 flex flex-col items-center gap-4 text-center"
        style={{ border: "1px solid #F0F0F0" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "#F0EFFD" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#948EEE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: "#0E0F0C" }}>
            No transactions yet
          </p>
          <p className="text-sm mt-1" style={{ color: "#9A9A9A" }}>
            Your orders will appear here
          </p>
        </div>
        <button
          onClick={goTrade}
          disabled={!selectedCrypto || !supportedCurrency}
          className="mt-1 px-6 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-40"
          style={{ background: "#948EEE" }}
        >
          Buy / Sell Crypto
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile: card list */}
      <div
        className="lg:hidden rounded-3xl overflow-hidden"
        style={{ border: "1px solid #F0F0F0" }}
      >
        {transactions.map((tx, i) => (
          <TransactionRow
            key={tx.id}
            transaction={tx}
            isLast={i === transactions.length - 1}
            isMobileCard
          />
        ))}
      </div>

      {/* Desktop: table */}
      <div
        className="hidden lg:block rounded-3xl overflow-hidden"
        style={{ border: "1px solid #F0F0F0" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "#FAFAFA",
                  borderBottom: "1px solid #F0F0F0",
                }}
              >
                {[
                  "Ref",
                  "Date",
                  "Type",
                  "Crypto",
                  "Amount (NGN)",
                  "Rate",
                  "Network",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#9A9A9A" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  isLast={i === transactions.length - 1}
                  isMobileCard={false}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && transactions.length > 0 && hasMore && (
        <div className="flex flex-col items-center gap-2 pt-1 px-1">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            aria-busy={isLoadingMore}
            className="w-full max-w-md py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isLoadingMore
                ? "#E8E8E8"
                : "linear-gradient(135deg,#948EEE,#6B45D0)",
              color: "#FFFFFF",
              boxShadow: isLoadingMore ? "none" : "0 6px 20px #948EEE44",
            }}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
                Loading…
              </>
            ) : (
              "View more"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
