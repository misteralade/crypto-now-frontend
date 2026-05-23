import {
  AlertCircle, AlertTriangle,
  Ban,
  CheckCheck,
  CheckCircle,
  Clock,
  Coins,
  Download,
  Loader, RefreshCw,
  Send,
  Timer,
  XCircle
} from "lucide-react";
import {Fragment} from "react";
import {transactionStatusStyles} from "../../../util/constants.util.ts";

export const TransactionStatus = ({ status }: { status: string }) => {
  const transactionIcon = (status: string) => {
    const color = transactionStatusStyles[status as keyof typeof transactionStatusStyles]?.textColor || "text-gray-600";
    
    switch (status) {
      case "INITIATED":
      case "PENDING":
        return <Clock className={`w-5 h-5 ${color}`} />;
      case "AWAITING_PAYMENT":
        return <AlertCircle className={`w-5 h-5 ${color}`} />;
      case "PAYMENT_RECEIVED":
        return <Download className={`w-5 h-5 ${color}`} />;
      case "PAYMENT_CONFIRMED":
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      case "PROCESSING":
        return <Loader className={`w-5 h-5 ${color}`} />;
      case "AWAITING_CRYPTO":
        return <Coins className={`w-5 h-5 ${color}`} />;
      case "CRYPTO_SENT":
        return <Send className={`w-5 h-5 ${color}`} />;
      case "CRYPTO_RECEIVED":
        return <Download className={`w-5 h-5 ${color}`} />;
      case "CRYPTO_CONFIRMED":
        return <CheckCheck className={`w-5 h-5 ${color}`} />;
      case "COMPLETED":
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      case "FAILED":
        return <XCircle className={`w-5 h-5 ${color}`} />;
      case "EXPIRED":
        return <Timer className={`w-5 h-5 ${color}`} />;
      case "CANCELLED":
        return <Ban className={`w-5 h-5 ${color}`} />;
      case "DISPUTED":
        return <AlertTriangle className={`w-5 h-5 ${color}`} />;
      case "REFUNDING":
        return <RefreshCw className={`w-5 h-5 ${color}`} />;
      case "REFUNDED":
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      default:
        return <AlertCircle className={`w-5 h-5 ${color}`} />;
    }
  }
  
  return (
    <Fragment>
      {transactionIcon(status)}
    </Fragment>
  )
}
