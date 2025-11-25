import {Fragment} from "react";
import {getStatusColor, getStatusDot} from "../../../util/transaction.util.ts";
import type {TransactionStatus} from "../../../types/request.payload.types.ts";
import CopyAccountDetails from "../../trade-crypto/CopyAccountDetails.tsx";
import {convertToMillify, formatNumber} from "../../../util/index.util.ts";

interface TransactionDisputeInfoProps {
  sessionId: string;
  transactionType: 'BUY' | 'SELL';
  status: TransactionStatus;
  cryptoAmount: string;
  cryptoCurrency: string;
  fiatAmount: string;
  fiatCurrency: string;
  rate: string;
}

const TransactionDisputeInfo = ({sessionId, transactionType, status, cryptoAmount, cryptoCurrency, fiatCurrency, fiatAmount, rate }: TransactionDisputeInfoProps) => {
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction Details
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
            <CopyAccountDetails accountNumber={sessionId} className="!max-w-[300px]"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900">
                {transactionType}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <div className="p-4">
                <span
                  className={`flex items-center w-fit gap-2 py-1 px-3 rounded-3xl text-xs ${getStatusColor(status)}`}
                >
                  <span className={`w-2 h-2 rounded-full ${getStatusDot(status)}`}></span>
                  <span className={`text-sm capitalize`}>{status.replaceAll("_", " ").toLocaleLowerCase()}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Crypto Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatNumber(cryptoAmount)} {cryptoCurrency}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fiat Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {fiatCurrency} {convertToMillify(Number(fiatAmount || 0))}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Exchange Rate</p>
            <p className="text-sm font-medium text-gray-900">
              {formatNumber(rate)}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionDisputeInfo;
