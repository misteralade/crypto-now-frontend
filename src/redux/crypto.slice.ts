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
      userCreateCrypto: userCreateWalletInitialState
    }
  },
  reducers: {
    setSelectedCryptoId(state, action: PayloadAction<string>) {
      state.tradeCrypto.selectedCryptoId = action.payload;
    },
    setUserCreateCrypto(state, action: PayloadAction<UserCreateCryptoWalletRequestPayload>) {
      state.tradeCrypto.userCreateCrypto = action.payload;
    },
    clearSelectedCryptoId(state) {
      state.tradeCrypto.selectedCryptoId = null;
    },
    clearUserCreateCrypto(state) {
      state.tradeCrypto.userCreateCrypto = userCreateWalletInitialState;
    },
  },
});

export const {
  setSelectedCryptoId,
  setUserCreateCrypto,
  clearSelectedCryptoId,
  clearUserCreateCrypto,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;