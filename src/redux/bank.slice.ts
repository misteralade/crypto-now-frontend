import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CreateBankAccountRequestPayload} from "../types/request.payload.types.ts";
import { createBankInitialState } from "./states/bank.states.ts";

const bankSlice = createSlice({
  name: "bank",
  initialState: {
    createBankAccount: createBankInitialState,
    tradeCrypto: {
      selectedBankAccountId: null as string | null,
    },
    update: {
      selectedBankAccountId: undefined as string | undefined,
    }
  },
  reducers: {
    // Sets
    setNewBankAccount: (state, action: PayloadAction<CreateBankAccountRequestPayload>) => {
      state.createBankAccount = action.payload;
    },
    setSelectedBankAccountId: (state, action: PayloadAction<string>) => {
      state.tradeCrypto.selectedBankAccountId = action.payload;
    },
    setNewBankAccountField: (state, action: PayloadAction<{ field: keyof CreateBankAccountRequestPayload, value: any }>) => {
      const { field, value } = action.payload;
      state.createBankAccount[field] = value;
    },
    setUpdateSelectedBankAccountId: (state, action: PayloadAction<string>) => {
      state.update.selectedBankAccountId = action.payload;
    },

    // Clears
    clearNewBankAccount: (state) => {
      state.createBankAccount = { ...createBankInitialState }
    },
    clearSelectedBankAccountId: (state) => {
      state.tradeCrypto.selectedBankAccountId = null;
    },
    clearUpdateSelectedBankAccountId: (state) => {
      state.update.selectedBankAccountId = undefined;
    }
  },
});

export const {
  // Sets
  setNewBankAccount,
  setSelectedBankAccountId,
  setNewBankAccountField,
  setUpdateSelectedBankAccountId,
  
  // Clears
  clearNewBankAccount,
  clearSelectedBankAccountId,
  clearUpdateSelectedBankAccountId,
} = bankSlice.actions;
export default bankSlice.reducer;