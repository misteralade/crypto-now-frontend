import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {UserCreateCryptoWalletRequestPayload} from "../types/request.payload.types.ts";
import {userCreateWalletFromProfileInitialState, userCreateWalletInitialState} from "./states/crypto.states.ts";

const cryptoSlice = createSlice({
  name: "bank",
  initialState: {
    tradeCrypto: {
      selectedCryptoId: null as string | null,
      userCreateCrypto: userCreateWalletInitialState,
      selectedWalletId: null as string | null,
    },
    profile: {
      createWallet: userCreateWalletFromProfileInitialState,
      update: {
        walletId: undefined as string | undefined,
      }
    },
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
    setCreateCryptoWalletField(state, action: PayloadAction<{ field: keyof UserCreateCryptoWalletRequestPayload, value: any }>) {
      const { field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      state.profile.createWallet[field] = value;
    },
    setUpdateCryptoWalletId(state, action: PayloadAction<string>) {
      state.profile.update.walletId = action.payload;
    },

    // Clears
    clearSelectedCryptoId(state) {
      state.tradeCrypto.selectedCryptoId = null;
    },
    clearUserCreateCrypto(state) {
      state.tradeCrypto.userCreateCrypto = { ...userCreateWalletInitialState };
    },
    clearSelectedWalletId(state) {
      state.tradeCrypto.selectedWalletId = null;
    },
    clearCreateCryptoWalletField(state) {
      state.profile.createWallet = { ...userCreateWalletFromProfileInitialState };
    },
    clearUpdateCryptoWalletField(state) {
      state.profile.update.walletId = undefined;
    }
  },
});

export const {
  setSelectedCryptoId,
  setUserCreateCrypto,
  setSelectedWalletId,
  setCreateCryptoWalletField,
  setUpdateCryptoWalletId,
  
  clearSelectedCryptoId,
  clearUserCreateCrypto,
  clearSelectedWalletId,
  clearCreateCryptoWalletField,
  clearUpdateCryptoWalletField,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;