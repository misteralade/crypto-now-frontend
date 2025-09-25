import {useMutation, useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {transactionServiceApi} from "../api/transaction.api.ts";
import {type RootState, store} from "../store.ts";
import {SESSION_STORAGE_KEYS} from "../util/constants.ts";

export const useTransactionQuery = () => {
  const { data: calculatedAmount, isLoading: loadingCalculation } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.GET_AMOUNT_TO_SEND, store.getState().transaction.exchangeRateId, store.getState().transaction.amountToSend],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const transaction = rootState.transaction;

      if (!transaction.amountToSend || transaction.exchangeRateId) {
        return;
      }

      const { data, success } = await transactionServiceApi.calculateAmountToReceive(transaction.exchangeRateId || '', transaction.amountToSend || 0);

      if (success) {
        return data;
      }

      return null;
    },
    // enabled: !!exchangeRateId && !!amountToSend && amountToSend > 0, // Only run the query if exchangeRateId and amountToSend are provided and valid
    enabled: !!store.getState().transaction.exchangeRateId && !!store.getState().transaction.amountToSend && Number(store.getState().transaction?.amountToSend) > 0,
  });

  const initiateTransactionMutation = useMutation({
    mutationKey: [QUERY_KEYS.TRANSACTION.INITIATE_TRANSACTION],
    mutationFn: async () => {
      const rootState = store.getState() as RootState;
      const transactionForm = rootState.transaction.initiate.initiateTransaction;

      const payload = {
        ...transactionForm,
        coinId: transactionForm?.tokenId,
      }

      const sessionId = await transactionServiceApi.initiateTransaction(payload);
      sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, sessionId as string);
    },
  });

  const makePaymentTransactionMutation = useMutation({
    mutationKey: [QUERY_KEYS.TRANSACTION.MAKE_PAYMENT_TRANSACTION],
    mutationFn: async () => {
      const rootState = store.getState() as RootState;
      const transactionForm = rootState.transaction.initiate.initiateTransaction;
      const transactionSessionId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID);

      if (!transactionSessionId || !transactionForm) return;
      await transactionServiceApi.makeTransactionPayment({
        ...transactionForm,
        sessionId: transactionSessionId,
        coinId: transactionForm?.tokenId,
      });
    },
  });

  return {
    // Values
    calculatedAmount,
    loadingCalculation,
    initiateTransactionMutation,
    makePaymentTransactionMutation,

    // Functions
  };
};