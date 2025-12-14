import {ArrowDownToLine} from "lucide-react"
import type {TransactionResponseEntity} from "../../../types/response.payload.types.ts";
import CopyAccountDetails from "../../trade-crypto/CopyAccountDetails.tsx";
import momentClient from "../../../lib/moment.ts";
import {getStatusColor, getStatusDot} from "../../../util/transaction.util.ts";
import {useNavigate} from "@tanstack/react-router";
import {ROUTES} from "../../../util/constants.util.ts";
import {useTransactionQuery} from "../../../queries/transaction.query.ts";

interface TransactionRowProps {
  transaction: TransactionResponseEntity;
  isLast: boolean
}

const TransactionRow = ({transaction, isLast}: TransactionRowProps) => {
  const { downloadSingleTransactionMutation } = useTransactionQuery();
  const navigate = useNavigate();
  
  const handleViewTransaction = () => {
    navigate({to: `${ROUTES.TRANSACTION}/${transaction.sessionId}`});
  }

  const handleViewDispute = () => {
    if (transaction.dispute?.id) {
      navigate({to: '/dispute/$id', params: { id: transaction.dispute.id }});
    }
  }

  const handleContinueTransaction = () => {
    // Navigate to trade page with sessionId as query parameter
    const tradeType = transaction.type.toLowerCase() === 'sell' ? 'sell' : 'buy';
    navigate({
      to: ROUTES.TRADE_CRYPTO,
      search: {
        sessionId: transaction.sessionId,
        option: tradeType,
        currency: transaction.currency || '',
        token: transaction.cryptocurrencyId || '',
      },
    });
  }

  // Check if transaction can be continued --- Only initiated transactions can be continued and createdAt is less than an hour ago
  const canContinueTransaction = transaction.status === "INITIATED" && momentClient.isWithinDuration(transaction.createdAt, 1, "hour");

  // // If the dispute transaction is more than an hour and less than 24 hours ago, then it can be disputed
  // const canDisputeTransaction = momentClient.isWithinDuration(transaction.createdAt, 1, "hour") && momentClient.isWithinDuration(transaction.createdAt, 24, "hours");

  const canViewDispute = transaction.status === "DISPUTED";

  const handleDownloadTransaction = async (sessionId: string) => {
    const { success, data} = await downloadSingleTransactionMutation.mutateAsync(sessionId);

    if (success && data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${sessionId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error("Download failed");
    }
  }

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
          className={`flex items-center w-fit gap-2 py-1 px-3 rounded-3xl text-xs ${getStatusColor(transaction.status)}`}
        >
          <span className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></span>
          <span className={`text-sm capitalize`}>{transaction.status.replaceAll("_", " ").toLocaleLowerCase()}</span>
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg transition-colors" disabled={transaction.status === "FAILED"}>
            <ArrowDownToLine
              size={18}
              className={`${transaction.status === "COMPLETED" || transaction.status === "FAILED" ? "text-accent1 cursor-pointer" : "text-grey4 cursor-not-allowed"}`}
              onClick={() => handleDownloadTransaction(transaction.sessionId)}
            />
          </button>
          
          <button
            className="px-2.5 md:px-3 py-1 rounded-full bg-[#E6E6FE] cursor-pointer hover:opacity-80 text-[#03034D] text-xs md:text-xs font-medium"
            onClick={handleViewTransaction}
          >
            View
          </button>

          {canViewDispute && (
            <button
              disabled={transaction.status !== "DISPUTED" || !transaction.dispute?.id}
              className={`px-2.5 md:px-3 py-1 rounded-full text-xs md:text-xs font-medium transition-opacity ${
                transaction.status === "DISPUTED" && transaction.dispute?.id
                  ? "bg-[#FFE6E6] cursor-pointer hover:opacity-80 text-[#8B0000]"
                  : "bg-gray-200 cursor-not-allowed text-gray-500 opacity-60"
              }`}
              onClick={handleViewDispute}
            >
              Dispute
            </button>
          )}

          {canContinueTransaction && (
            <button
              className="px-2.5 md:px-3 py-1 rounded-full bg-[#E6F7E6] cursor-pointer hover:opacity-80 text-[#0D4D0D] text-xs md:text-xs font-medium"
              onClick={handleContinueTransaction}
            >
              Continue
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default TransactionRow;
