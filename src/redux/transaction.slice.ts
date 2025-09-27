import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { InitiateTransactionRequestPayload } from "../types/request.payload.types.ts";

const initiateTransactionInitialState: InitiateTransactionRequestPayload | null = {
  exchangeRateId: undefined,
  action: undefined,
  tokenId: undefined,
  currencyId: undefined,
  amountToReceive: undefined,
  amountToSend: undefined,
  receiptUrl: undefined,
  transactionHash: undefined,
}

const transactionSlice = createSlice({
  name: "bank",
  initialState: {
    initiate: {
      initiateTransaction: initiateTransactionInitialState,
    },
    exchangeRateId: undefined as string | undefined,
    amountToSend: undefined as number | undefined,
  },
  reducers: {
    // Set States
    setInitiateTransaction: (state, action: PayloadAction<InitiateTransactionRequestPayload>) => {
      state.initiate.initiateTransaction = action.payload;
    },
    setExchangeRateId: (state, action: PayloadAction<string | undefined>) => {
      state.exchangeRateId = action.payload;
    },
    setAmountToSend: (state, action: PayloadAction<number | undefined>) => {
      state.amountToSend = action.payload;
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
    clearExchangeRateId: (state) => {
      state.exchangeRateId = undefined;
    },
    clearAmountToSend: (state) => {
      state.amountToSend = undefined;
    },
  },
});

export const {
  // Set States
  setInitiateTransaction,
  setExchangeRateId,
  setAmountToSend,

  // Clear States
  clearInitiateTransaction,
  clearExchangeRateId,
  clearAmountToSend,
} = transactionSlice.actions;
export default transactionSlice.reducer;