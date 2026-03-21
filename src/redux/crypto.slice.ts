import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const cryptoSlice = createSlice({
  name: "bank",
  initialState: {
    tradeCrypto: {
      selectedCryptoId: null as string | null,
    },
  },
  reducers: {
    setSelectedCryptoId(state, action: PayloadAction<string>) {
      state.tradeCrypto.selectedCryptoId = action.payload;
    },

    // Clears
    clearSelectedCryptoId(state) {
      state.tradeCrypto.selectedCryptoId = null;
    },
  },
});

export const {
  setSelectedCryptoId,
  clearSelectedCryptoId,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;