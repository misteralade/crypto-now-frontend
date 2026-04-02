import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { KycIdType, KycNinBvnType, KycSessionResponse } from "../types/kyc.types.ts";

interface KycState {
  session: KycSessionResponse | null;
  ninBvn: {
    type: KycNinBvnType;
    value: string;
  };
}

const initialState: KycState = {
  session: null,
  ninBvn: {
    type: "none",
    value: "",
  },
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
        state.session.hasSelectedIdType = true;
      }
    },
    setNinBvnType: (state, action: PayloadAction<KycNinBvnType>) => {
      state.ninBvn.type = action.payload;
    },
    setNinBvnValue: (state, action: PayloadAction<string>) => {
      state.ninBvn.value = action.payload;
    },
    clearNinBvn: (state) => {
      state.ninBvn = { type: "none", value: "" };
    },
  },
});

export const {
  setKycSession,
  clearKycSession,
  setSelectedIdType,
  setNinBvnType,
  setNinBvnValue,
  clearNinBvn,
} = kycSlice.actions;

export default kycSlice.reducer;
