import {useNavbarDropdown} from "../../hooks/components/useNavbarDropdown.ts";
import {useTransactionQuery} from "../../queries/transaction.query.ts";

export default function EmptyPendingTransaction() {
  const {
      handleRouting,
  } = useNavbarDropdown();

  const { incompleteTransactionsCount, loadingIncompleteTransactionsCount } = useTransactionQuery();

  const navigateToTrade = () => {
      handleRouting()
  }

  const getMessage = () => {
    if (loadingIncompleteTransactionsCount) {
      return "Loading...";
    }

    if (!incompleteTransactionsCount || incompleteTransactionsCount === 0) {
      return "No pending transactions";
    }

    return `You have ${incompleteTransactionsCount} pending ${incompleteTransactionsCount === 1 ? 'transaction' : 'transactions'}`;
  }

  return(
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-border bg-accent4 px-3 py-5`}>
      <h4 className={`text-2xl font-medium`}>{getMessage()}</h4>

      <button
        onClick={navigateToTrade}
        type="button"
        disabled={false}
        className={`py-4 px-3 md:py-2 cursor-pointer rounded-full block md:order-2 text-lg text-center font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
      >
            Buy / Sell Crypto
        </button>
    </div>
  )
}
