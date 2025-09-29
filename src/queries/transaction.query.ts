import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {useMatchRoute} from "@tanstack/react-router";
import {QUERY_KEYS} from "./query.keys.ts";
import {transactionServiceApi} from "../api/transaction.api.ts";
import {type RootState, store} from "../store.ts";
import {LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS} from "../util/constants.ts";

export const useTransactionQuery = () => {
  const matchRoute = useMatchRoute();

  // Calculate Amount to Receive
  const { data: calculatedAmount, isLoading: loadingCalculation } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.GET_AMOUNT_TO_SEND, store.getState().transaction.exchangeRateId, store.getState().transaction.amountToSend],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const transaction = rootState.transaction;

      if (!transaction.amountToSend || !transaction.exchangeRateId) {
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

  const { data: userTransactionHistory, isLoading: loadingUserTransactionHistory } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.USER_SEARCH_TRANSACTION_HISTORY, (store.getState() as RootState)?.transaction?.dashboard?.searchUserTransactions],
    queryFn: async () => {
      const rootState = store.getState() as RootState;

      if (!rootState?.transaction?.dashboard?.searchUserTransactions) {
        return;
      }

      const { data, success } = await transactionServiceApi.searchUserTransactions(rootState?.transaction?.dashboard?.searchUserTransactions);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(store.getState() as RootState)?.transaction?.dashboard?.searchUserTransactions && !!matchRoute({ to: "/dashboard" }),
  })

  // Initiate Transaction Mutation
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

  // Make Payment Transaction Mutation
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

  // Confirm Receiving Payment Account Mutation
  const receivingPaymentAccountConfirmationMutation = useMutation({
    mutationKey: [QUERY_KEYS.TRANSACTION.CONFIRM_RECEIVING_PAYMENT_ACCOUNT],
    mutationFn: async () => {
      toast.loading(`Confirming receiving account...`, { toastId: 'confirm-receiving-account' });
      const rootState = store.getState() as RootState;
      const transactionSessionId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID);
      const walletId = rootState.crypto.tradeCrypto?.selectedWalletId;
      const accountId = rootState.bank.tradeCrypto?.selectedBankAccountId;

      if (!walletId && !accountId) {
        throw new Error("Either walletId or accountId must be provided, and sessionId must exist");
      }

      if (!transactionSessionId) {
        throw new Error("Either transaction sessionId must be provided, and sessionId must exist");
      }

      await transactionServiceApi.confirmReceivingPaymentAccount(transactionSessionId, {
        walletId,
        accountId,
      });
    },
    onSuccess: () => {
      toast.dismiss('confirm-receiving-account');
      toast.success('Successfully confirmed receiving account');
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TRADE_PROGRESS);
    },
    onError: () => {
      toast.dismiss('confirm-receiving-account');
      toast.error('Failed to confirm receiving account');
    }
  });

  return {
    // Values
    calculatedAmount,
    loadingCalculation,
    userTransactionHistory,
    loadingUserTransactionHistory,


    // Mutations
    initiateTransactionMutation,
    makePaymentTransactionMutation,
    receivingPaymentAccountConfirmationMutation,

    // Functions
  };
};