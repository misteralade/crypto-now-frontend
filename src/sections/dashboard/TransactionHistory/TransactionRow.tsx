import {ArrowDownToLine} from "lucide-react"
import type {TransactionResponseEntity} from "../../../types/response.payload.types.ts";
import CopyAccountDetails from "../../trade-crypto/CopyAccountDetails.tsx";
import momentClient from "../../../lib/moment.ts";
import {getStatusColor, getStatusDot} from "../../../util/transaction.util.ts";

interface TransactionRowProps {
  transaction: TransactionResponseEntity;
  isLast: boolean
}

export function TransactionRow({transaction, isLast}: TransactionRowProps) {
  return (
    <tr className={`hover:bg-muted/30 transition-colors ${!isLast ? "border-b border-border" : ""}`}>
      <td className="p-4 text-sm text-foreground font-mono">
        <CopyAccountDetails accountNumber={transaction.sessionId} className="!max-w-[100px]"/>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{momentClient.formatToTransactionInitiationDate(transaction.createdAt)}</td>
      <td className="p-4 text-sm text-foreground">{transaction.type}</td>
      <td className="p-4 text-sm text-foreground font-medium">{Number(transaction.amountCrypto).toFixed(4)} {transaction.cryptocurrency.symbol}</td>
      <td className="p-4 text-sm text-foreground">{Number(transaction.stableToFiatRate).toFixed(4)}</td>
      <td className="p-4">
                <span
                  className={`flex items-center w-fit gap-2 py-1 px-3 rounded-3xl text-xs ${getStatusColor(transaction.status)}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></span>
                    <span className={`text-sm capitalize`}>{transaction.status.replaceAll("_", " ").toLocaleLowerCase()}</span>
                </span>
      </td>
      <td className="p-4">
        <button className="p-2 rounded-lg transition-colors" disabled={transaction.status === "FAILED"}>
          <ArrowDownToLine
            className={`w-6 h-6 
                        ${transaction.status === "COMPLETED" || transaction.status === "FAILED" ?
              "text-accent1 cursor-pointer" : "text-grey4 cursor-not-allowed"}`}
          />
        </button>
      </td>
    </tr>
  )
}
