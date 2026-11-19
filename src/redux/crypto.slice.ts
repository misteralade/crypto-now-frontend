import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { UserCreateCryptoWalletRequestPayload } from "../types/request.payload.types.ts";
import { userCreateWalletInitialState } from "./states/crypto.states.ts";

const cryptoSlice = createSlice({
  name: "bank",
  initialState: {
    tradeCrypto: {
      selectedCryptoId: null as string | null,
    },
    // Used by wallet change/create flows.
    userCreateCrypto: userCreateWalletInitialState as UserCreateCryptoWalletRequestPayload,
  },
  reducers: {
    setSelectedCryptoId(state, action: PayloadAction<string>) {
      state.tradeCrypto.selectedCryptoId = action.payload;
    },

    // Clears
    clearSelectedCryptoId(state) {
      state.tradeCrypto.selectedCryptoId = null;
    },

    // Stores the user wallet payload before submitting via a dedicated API/mutation.
    setUserCreateCrypto(state, action: PayloadAction<UserCreateCryptoWalletRequestPayload>) {
      state.userCreateCrypto = action.payload;
    },
  },
});

export const {
  setSelectedCryptoId,
  clearSelectedCryptoId,
  setUserCreateCrypto,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;