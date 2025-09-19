import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {transactionServiceApi} from "../api/transaction.api.ts";

export const useTransactionQuery = (exchangeRateId?: string, amountToSend?: number) => {
  const { data: calculatedAmount, isLoading: loadingCalculation } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.GET_AMOUNT_TO_SEND, exchangeRateId, amountToSend],
    queryFn: async () => {
      const { data, success } = await transactionServiceApi.calculateAmountToReceive(exchangeRateId || '', amountToSend || 0);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!exchangeRateId && !!amountToSend && amountToSend > 0, // Only run the query if exchangeRateId and amountToSend are provided and valid
  });

  return {
    // Values
    calculatedAmount,
    loadingCalculation,

    // Functions
  };
};