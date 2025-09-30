import {useTransactionQuery} from "../../../queries/transaction.query.ts";

export const useDashboardContent = () => {
  const { transactionSummary, loadingTransactionSummary } = useTransactionQuery();
  
  return {
    // Values
    transactionSummary,
    loadingTransactionSummary,
    
    // Functions
  };
}