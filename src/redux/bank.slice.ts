import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CreateBankAccountRequestPayload} from "../types/request.payload.types.ts";

const createBankInitialState: CreateBankAccountRequestPayload | null = {
  bankId: null,
  accountName: null,
  accountNumber: null,
}

const bankSlice = createSlice({
  name: "bank",
  initialState: {
    createBankAccount: createBankInitialState,
  },
  reducers: {
    setNewBankAccount: (state, action: PayloadAction<CreateBankAccountRequestPayload>) => {
      state.createBankAccount = action.payload;
    },
    clearNewBankAccount: (state) => {
      state.createBankAccount = {
        bankId: null,
        accountName: null,
        accountNumber: null,
      }
    },
  },
});

export const {
  setNewBankAccount,
  clearNewBankAccount,
} = bankSlice.actions;
export default bankSlice.reducer;