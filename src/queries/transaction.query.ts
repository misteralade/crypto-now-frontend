import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {useMatchRoute} from "@tanstack/react-router";
import {QUERY_KEYS} from "./query.keys.ts";
import {transactionServiceApi} from "../api/transaction.api.ts";
import {type RootState, store} from "../store.ts";
import {ROUTES, SESSION_STORAGE_KEYS} from "../util/constants.util.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {clearTradeProgress} from "../util/tradeProgress.storage.util.ts";
import {disputeServiceApi} from "../api/dispute.api.ts";

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
  });
  
  // Return Transaction Summary
  const { data: transactionSummary, isLoading: loadingTransactionSummary } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.USER_TRANSACTION_SUMMARY],
    queryFn: async () => {
      const { data, success } = await transactionServiceApi.getUserTransactionSummary();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.HOMEPAGE }),
  })
  
  // Get transaction Details
  const { data: transactionDetails, isLoading: loadingTransactionDetails } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.USER_TRANSACTION_DETAILS, store.getState().transaction.details.sessionId],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const sessionId = rootState.transaction.details.sessionId;

      if (!sessionId) {
        return;
      }

      const { data, success } = await transactionServiceApi.getTransactionDetails(sessionId);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!store.getState().transaction.details.sessionId && !!matchRoute({ to: ROUTES.TRANSACTION_DETAILS }),
  })

  // Initiate Transaction Mutation
  const initiateTransactionMutation = useMutation({
    mutationKey: [QUERY_KEYS.TRANSACTION.INITIATE_TRANSACTION],
    mutationFn: async () => {
      toast.loading(`Initiating transaction...`, { toastId: QUERY_KEYS.TRANSACTION.INITIATE_TRANSACTION });
      const rootState = store.getState() as RootState;
      const transactionForm = rootState.transaction.initiate.initiateTransaction;
      const userEmail = rootState.user.trade.anonymous.email;

      const payload = {
        ...transactionForm,
        coinId: transactionForm?.tokenId,
      }
      
      if (userEmail) {
        const updatedPayload = {
          ...payload,
          email: userEmail,
        }
        return await transactionServiceApi.initiateTransactionAnonymousUser(updatedPayload);
      }

      return await transactionServiceApi.initiateTransaction(payload);
    },
    onSuccess: ({ data, message }) => {
      toast.dismiss(QUERY_KEYS.TRANSACTION.INITIATE_TRANSACTION);
      sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, data?.sessionId as string);
      toast.success(message);
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss(QUERY_KEYS.TRANSACTION.INITIATE_TRANSACTION);
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to initiate transaction. Please try again.'
      toast.error(message);
    },
  });
  
  // Make Payment Transaction Mutation
  const makePaymentTransactionMutation = useMutation({
    mutationKey: [QUERY_KEYS.TRANSACTION.MAKE_PAYMENT_TRANSACTION],
    mutationFn: async () => {
      const rootState = store.getState() as RootState;
      const transactionForm = rootState.transaction.initiate.initiateTransaction;
      const transactionSessionId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID);
      
      const userEmail = rootState.user.trade.anonymous.email;
      
      if (!transactionSessionId || !transactionForm) return;
      
      if (userEmail) {
        return await transactionServiceApi.anonymousUserMakeTransactionPayment({
          ...transactionForm,
          sessionId: transactionSessionId,
          coinId: transactionForm?.tokenId,
          email: userEmail,
        });
      }
      
      return await transactionServiceApi.makeTransactionPayment({
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
      const userEmail = rootState.user.trade.anonymous.email;

      if (!walletId && !accountId) {
        throw new Error("Either walletId or accountId must be provided, and sessionId must exist");
      }

      if (!transactionSessionId) {
        throw new Error("Either transaction sessionId must be provided, and sessionId must exist");
      }
      
      if (userEmail) {
        await transactionServiceApi.confirmAnonymousUserReceivingPaymentAccount(transactionSessionId, {
          walletId,
          accountId,
          email: userEmail,
        })
        
        return;
      }
      
      await transactionServiceApi.confirmReceivingPaymentAccount(transactionSessionId, {
        walletId,
        accountId,
      });
    },
    onSuccess: () => {
      toast.dismiss('confirm-receiving-account');
      toast.success('Successfully confirmed receiving account');
      clearTradeProgress();
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_ID);
      
      setTimeout(() => {
        // Reload the page to reset the state
        window.location.reload();
      }, 5000)
    },
    onError: () => {
      toast.dismiss('confirm-receiving-account');
      toast.error('Failed to confirm receiving account');
    }
  });
  
  const disputeTransactionInitiationMutation = useMutation({
    mutationKey: [QUERY_KEYS.DISPUTE.INITIATE_DISPUTE_TRANSACTION],
    mutationFn: async () => {
      const sessionId = store.getState().transaction.details.sessionId;
      const reason = store.getState().transaction.dispute.create.reason;
      const attachments = store.getState().transaction.dispute.create.attachments;
      
      if (!sessionId || !reason) {
        throw new Error("Session ID and reason are required to initiate a dispute.");
      }
      
      toast.loading(`Initiating dispute...`, { toastId: QUERY_KEYS.DISPUTE.INITIATE_DISPUTE_TRANSACTION });
      return await disputeServiceApi.initiateDisputeTransaction(sessionId, { reason, attachments: attachments as any });
    },
    onSuccess: ({ message, data }) => {
      toast.dismiss(QUERY_KEYS.DISPUTE.INITIATE_DISPUTE_TRANSACTION);
      toast.success(message);
      return data;
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss(QUERY_KEYS.DISPUTE.INITIATE_DISPUTE_TRANSACTION);
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to initiate dispute. Please try again.'
      toast.error(message);
    },
  })
  
  return {
    // Values
    calculatedAmount,
    loadingCalculation,
    userTransactionHistory,
    loadingUserTransactionHistory,
    transactionSummary,
    loadingTransactionSummary,
    transactionDetails,
    loadingTransactionDetails,

    // Mutations
    initiateTransactionMutation,
    makePaymentTransactionMutation,
    receivingPaymentAccountConfirmationMutation,
    disputeTransactionInitiationMutation,

    // Functions
  };
};