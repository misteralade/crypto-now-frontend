import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Coins,
  Loader,
  Timer,
  XCircle,
} from "lucide-react";
import { Fragment } from "react";
import {
  getStatusConfig,
  TRANSACTION_STATUS,
} from "../../../util/transaction.util.ts";

export const TransactionStatus = ({ status }: { status: string }) => {
  const transactionIcon = (status: string) => {
    const color = getStatusConfig(status).textColor;

    switch (status) {
      case TRANSACTION_STATUS.INITIATED:
        return <Clock className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.AWAITING_PAYMENT:
        return <AlertCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.IN_REVIEW:
        return <Clock className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.PROCESSING:
        return <Loader className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.AWAITING_CRYPTO:
        return <Coins className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.COMPLETED:
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.FAILED:
        return <XCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.EXPIRED:
        return <Timer className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.CANCELLED:
        return <Ban className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.DISPUTED:
        return <AlertTriangle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.REFUNDED:
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.DEPOSIT_DETECTED:
      case TRANSACTION_STATUS.PENDING_CONFIRMATION:
        return <AlertCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.DEPOSIT_PENDING_MINIMUM:
        return <AlertCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.DEPOSIT_CONFIRMED:
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.NO_OWNER:
        return <AlertTriangle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.PAYOUT_INITIATED:
        return <CheckCircle className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.PENDING_PAYOUT:
        return <Clock className={`w-5 h-5 ${color}`} />;
      case TRANSACTION_STATUS.PAYOUT_FAILED:
        return <XCircle className={`w-5 h-5 ${color}`} />;
      default:
        return <AlertCircle className={`w-5 h-5 ${color}`} />;
    }
  };

  return <Fragment>{transactionIcon(status)}</Fragment>;
};
