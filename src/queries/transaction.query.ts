import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {useMatchRoute} from "@tanstack/react-router";
import {QUERY_KEYS} from "./query.keys.ts";
import {transactionServiceApi} from "../api/transaction.api.ts";
import {type RootState, store} from "../store.ts";
import {ROUTES, SESSION_STORAGE_KEYS, TIME_IN_MILLISECONDS} from "../util/constants.util.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {disputeServiceApi} from "../api/dispute.api.ts";
import type {MessageAttachment} from "../types/transaction.types.ts";
import {extractErrorMessage} from "../util/index.util.ts";

export const useTransactionQuery = () => {
  const queryClient = useQueryClient();
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
    enabled: !!(store.getState() as RootState)?.transaction?.dashboard?.searchUserTransactions && !!matchRoute({ to: ROUTES.DASHBOARD }),
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
    enabled: !!matchRoute({ to: ROUTES.DASHBOARD }),
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
  });
  
  // Get Dispute Messages
  const { data: disputeMessages, isLoading: loadingDisputeMessages } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.GET_DISPUTE_MESSAGES, store.getState().transaction.dispute.details.id],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const disputeId = rootState.transaction.dispute.details.id;

      if (!disputeId) {
        return;
      }

      const { data, success } = await disputeServiceApi.getDisputeMessage(disputeId);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!store.getState().transaction.dispute.details.id && !!matchRoute({ to: ROUTES.DISPUTE_DETAILS }),
    refetchInterval: TIME_IN_MILLISECONDS.FIVE_SECONDS,
  });
  
  // Get Dispute Details
  const { data: disputeDetails, isLoading: loadingDisputeDetails } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.GET_DISPUTE_DETAILS, store.getState().transaction.dispute.details.id],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const disputeId = rootState.transaction.dispute.details.id;

      if (!disputeId) {
        return;
      }

      const { data, success } = await disputeServiceApi.getDisputeDetails(disputeId);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!store.getState().transaction.dispute.details.id && !!matchRoute({ to: ROUTES.DISPUTE_DETAILS }),
  });

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
      const message = extractErrorMessage(error) || "Failed to initiate transaction. Please try again."
      console.log({
        message
      })
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
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to update transaction payment. Please try again."
      toast.error(message);
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
      // Note: clearTradeProgress and step reset are handled in handleConfirmBankDetails
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_ID);
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss('confirm-receiving-account');
      const message = extractErrorMessage(error) || "Failed to confirm receiving account. Please try again."
      toast.error(message);
    },
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
      const message = extractErrorMessage(error) || "Failed to initiate dispute. Please try again."
      toast.error(message);
    },
  })
  
  const userSendDisputeMutation = useMutation({
    mutationKey: [QUERY_KEYS.DISPUTE.USER_SEND_DISPUTE_MESSAGE],
    mutationFn: async () => {
      const rootState = store.getState() as RootState;
      const message = rootState.transaction.dispute.details.message.text;
      const attachments = rootState.transaction.dispute.details.message.attachments;
      const disputeId = rootState.transaction.dispute.details.id;
      
      if (!disputeId || !message) {
        throw new Error("Dispute ID and message are required to send a dispute message.");
      }
      
      toast.loading(`Sending message...`, { toastId: QUERY_KEYS.DISPUTE.USER_SEND_DISPUTE_MESSAGE });
      return await disputeServiceApi.sendDisputeMessage(disputeId, message, attachments as Array<MessageAttachment>);
    },
    onSuccess: ({ message }) => {
      toast.dismiss(QUERY_KEYS.DISPUTE.USER_SEND_DISPUTE_MESSAGE);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DISPUTE.GET_DISPUTE_MESSAGES]
      });
      toast.success(message);
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss(QUERY_KEYS.DISPUTE.USER_SEND_DISPUTE_MESSAGE);
      const message = extractErrorMessage(error) || "Failed to send dispute message. Please try again."
      toast.error(message);
    },
  });

  const downloadSingleTransactionMutation= useMutation({
    mutationFn: async (sessionId: string) => {
      toast.loading(`Downloading Transaction Details...`)
      if (!sessionId) {
        throw new Error(`No Valid Session ID is provided`)
      }

      return await transactionServiceApi.downloadSingleTransactionDetails(sessionId)
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
      } else {
        toast.error(message)
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to download transaction details. Please try again."
      toast.error(message);
    },
  });

  const downloadAllTransactionMutation = useMutation({
    mutationFn: async (fileType: "CSV" | "PDF") => {
      const rootState = store.getState() as RootState;

      if (!rootState?.transaction?.dashboard?.searchUserTransactions) {
        throw new Error(`Failed to send transaction history download request`)
      }

      return await transactionServiceApi.downloadAllTransactionDetails(rootState?.transaction?.dashboard?.searchUserTransactions, fileType);
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
      } else {
        toast.error(message)
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to download transaction history. Please try again."
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
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    

    // Mutations
    initiateTransactionMutation,
    makePaymentTransactionMutation,
    receivingPaymentAccountConfirmationMutation,
    disputeTransactionInitiationMutation,
    userSendDisputeMutation,
    downloadSingleTransactionMutation,
    downloadAllTransactionMutation,

    // Functions
  };
};