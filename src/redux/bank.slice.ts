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
    selectedBankAccountId: null as string | null,
  },
  reducers: {
    // Sets
    setNewBankAccount: (state, action: PayloadAction<CreateBankAccountRequestPayload>) => {
      state.createBankAccount = action.payload;
    },
    setSelectedBankAccountId: (state, action: PayloadAction<string>) => {
      state.selectedBankAccountId = action.payload;
    },

    // Clears
    clearNewBankAccount: (state) => {
      state.createBankAccount = {
        bankId: null,
        accountName: null,
        accountNumber: null,
      }
    },
    clearSelectedBankAccountId: (state) => {
      state.selectedBankAccountId = null;
    },
  },
});

export const {
  setNewBankAccount,
  setSelectedBankAccountId,
  clearNewBankAccount,
  clearSelectedBankAccountId,
} = bankSlice.actions;
export default bankSlice.reducer;