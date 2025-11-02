import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {
  InitiateTransactionRequestPayload,
  SearchTransactionsRequestPayload
} from "../types/request.payload.types.ts";
import {
  initiateTransactionInitialState,
  userSearchTransactionInitialState
} from "./states/initial-transaction.state.ts";

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
    
    // Clear States
    clearInitiateTransaction: (state) => {
      state.initiate.initiateTransaction = {
        exchangeRateId: undefined,
        action: undefined,
        tokenId: undefined,
        currencyId: undefined,
        amountToReceive: undefined,
        amountToSend: undefined,
        receiptUrl: undefined,
        transactionHash: undefined,
      }
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
    }
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
  
  // Clear States
  clearInitiateTransaction,
  clearInitiateTransactionField,
  clearExchangeRateId,
  clearAmountToSend,
  clearSearchUserTransactions,
  clearTransactionDetailSessionId,
} = transactionSlice.actions;
export default transactionSlice.reducer;