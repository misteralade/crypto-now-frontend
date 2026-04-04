import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { KycIdType, KycSessionResponse } from "../types/kyc.types.ts";

interface KycState {
  session: KycSessionResponse | null;
}

const initialState: KycState = {
  session: null,
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setKycSession: (state, action: PayloadAction<KycSessionResponse>) => {
      state.session = action.payload;
    },
    clearKycSession: (state) => {
      state.session = null;
    },
    setSelectedIdType: (state, action: PayloadAction<KycIdType>) => {
      if (state.session) {
        state.session.selectedIdType = action.payload;
      }
    },
  },
});

export const { setKycSession, clearKycSession, setSelectedIdType } =
  kycSlice.actions;

export default kycSlice.reducer;
