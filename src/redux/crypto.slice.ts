import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {UserCreateCryptoWalletRequestPayload} from "../types/request.payload.types.ts";

const userCreateWalletInitialState:UserCreateCryptoWalletRequestPayload = {
  walletAddress: "",
  network: "",
  isVerified: false,
  isPrimary: false,
  walletLabel: null,
}

const cryptoSlice = createSlice({
  name: "bank",
  initialState: {
    tradeCrypto: {
      selectedCryptoId: null as string | null,
      userCreateCrypto: userCreateWalletInitialState,
      selectedWalletId: null as string | null,
    }
  },
  reducers: {
    setSelectedCryptoId(state, action: PayloadAction<string>) {
      state.tradeCrypto.selectedCryptoId = action.payload;
    },
    setUserCreateCrypto(state, action: PayloadAction<UserCreateCryptoWalletRequestPayload>) {
      state.tradeCrypto.userCreateCrypto = action.payload;
    },
    setSelectedWalletId(state, action: PayloadAction<string>) {
      state.tradeCrypto.selectedWalletId = action.payload;
    },

    // Clears
    clearSelectedCryptoId(state) {
      state.tradeCrypto.selectedCryptoId = null;
    },
    clearUserCreateCrypto(state) {
      state.tradeCrypto.userCreateCrypto = userCreateWalletInitialState;
    },
    clearSelectedWalletId(state) {
      state.tradeCrypto.selectedWalletId = null;
    },
  },
});

export const {
  setSelectedCryptoId,
  setUserCreateCrypto,
  setSelectedWalletId,
  clearSelectedCryptoId,
  clearUserCreateCrypto,
  clearSelectedWalletId,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;