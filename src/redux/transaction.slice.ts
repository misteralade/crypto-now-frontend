import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {
  InitiateTransactionRequestPayload,
  SearchTransactionsRequestPayload
} from "../types/request.payload.types.ts";
import {
  initiateTransactionInitialState,
  userSearchTransactionInitialState
} from "./states/initial-transaction.state.ts";
import type {MessageAttachment} from "../types/transaction.types.ts";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    initiate: {
      initiateTransaction: initiateTransactionInitialState,
    },
    exchangeRateId: undefined as string | undefined,
    amountToSend: undefined as number | undefined,
    dashboard: {
      searchUserTransactions: userSearchTransactionInitialState
    },
    details: {
      sessionId: undefined as string | undefined,
    },
    dispute: {
      create: {
        reason: undefined as string | undefined,
        attachments: undefined as Array<MessageAttachment> | undefined,
      },
      details: {
        id: undefined as string | undefined,
        message: {
          text: undefined as string | undefined,
          attachments: undefined as Array<MessageAttachment> | undefined,
        }
      }
    }
  },
  reducers: {
    // Set States
    setInitiateTransaction: (state, action: PayloadAction<InitiateTransactionRequestPayload>) => {
      state.initiate.initiateTransaction = action.payload;
    },
    setInitiateTransactionField: (state, action: PayloadAction<{ field: keyof InitiateTransactionRequestPayload; value: any }>) => {
      const { field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      state.initiate.initiateTransaction[field] = value;
    },
    setExchangeRateId: (state, action: PayloadAction<string | undefined>) => {
      state.exchangeRateId = action.payload;
    },
    setAmountToSend: (state, action: PayloadAction<number | undefined>) => {
      state.amountToSend = action.payload;
    },
    setSearchUserTransactions: (state, action: PayloadAction<SearchTransactionsRequestPayload>) => {
      state.dashboard.searchUserTransactions = action.payload;
    },
    setTransactionDetailSessionId: (state, action: PayloadAction<string>) => {
      state.details.sessionId = action.payload;
    },
    setDisputeReason: (state, action: PayloadAction<string>) => {
      state.dispute.create.reason = action.payload;
    },
    setDisputeAttachments: (state, action: PayloadAction<Array<MessageAttachment>>) => {
      state.dispute.create.attachments = action.payload;
    },
    addDisputeAttachment: (state, action: PayloadAction<MessageAttachment>) => {
      if (!state.dispute.create.attachments) {
        state.dispute.create.attachments = [];
      }
      state.dispute.create.attachments.push(action.payload);
    },
    removeDisputeAttachment: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.dispute.create.attachments && index >= 0 && index < state.dispute.create.attachments.length) {
        state.dispute.create.attachments.splice(index, 1);
      }
    },
    setDisputeDetailsId: (state, action: PayloadAction<string>) => {
      state.dispute.details.id = action.payload;
    },
    setDisputeMessageText: (state, action: PayloadAction<string>) => {
      state.dispute.details.message.text = action.payload;
    },
    setDisputeMessageAttachments: (state, action: PayloadAction<Array<MessageAttachment>>) => {
      state.dispute.details.message.attachments = action.payload;
    },
    
    // Clear States
    clearInitiateTransaction: (state) => {
      state.initiate.initiateTransaction = {...initiateTransactionInitialState}
    },
    clearInitiateTransactionField: (state, action: PayloadAction<keyof InitiateTransactionRequestPayload>) => {
      const field = action.payload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      state.initiate.initiateTransaction[field] = undefined;
    },
    clearExchangeRateId: (state) => {
      state.exchangeRateId = undefined;
    },
    clearAmountToSend: (state) => {
      state.amountToSend = undefined;
    },
    clearSearchUserTransactions: (state) => {
      state.dashboard.searchUserTransactions = userSearchTransactionInitialState;
    },
    clearTransactionDetailSessionId: (state) => {
      state.details.sessionId = undefined;
    },
    clearDisputeReason: (state) => {
      state.dispute.create.reason = undefined;
    },
    clearDisputeAttachments: (state) => {
      state.dispute.create.attachments = undefined;
    },
    clearDisputeDetailsId: (state) => {
      state.dispute.details.id = undefined;
    },
    clearDisputeMessageText: (state) => {
      state.dispute.details.message.text = undefined;
    },
    clearDisputeMessageAttachments: (state) => {
      state.dispute.details.message.attachments = undefined;
    },
  },
});

export const {
  // Set States
  setInitiateTransaction,
  setInitiateTransactionField,
  setExchangeRateId,
  setAmountToSend,
  setSearchUserTransactions,
  setTransactionDetailSessionId,
  setDisputeReason,
  setDisputeAttachments,
  addDisputeAttachment,
  removeDisputeAttachment,
  setDisputeDetailsId,
  setDisputeMessageText,
  setDisputeMessageAttachments,
  
  // Clear States
  clearInitiateTransaction,
  clearInitiateTransactionField,
  clearExchangeRateId,
  clearAmountToSend,
  clearSearchUserTransactions,
  clearTransactionDetailSessionId,
  clearDisputeReason,
  clearDisputeAttachments,
  clearDisputeDetailsId,
  clearDisputeMessageText,
  clearDisputeMessageAttachments,
} = transactionSlice.actions;
export default transactionSlice.reducer;