import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    trade: {
      anonymous: {
        isAnonymousUser: undefined as boolean | undefined,
        email: undefined as string | undefined,
      }
    }
  },
  reducers: {
    // Sets
    setIsAnonymousUser: (state, action:PayloadAction<boolean>) => {
      state.trade.anonymous.isAnonymousUser = action.payload;
    },
    setAnonymousUserEmail: (state, action:PayloadAction<string>) => {
      state.trade.anonymous.email = action.payload;
    },
    

    // Clears
    clearIsAnonymousUser: (state) => {
      state.trade.anonymous.isAnonymousUser = undefined;
    },
    clearAnonymousUserEmail: (state) => {
      state.trade.anonymous.email = undefined;
    }
  },
});

export const {
  // Sets
  setIsAnonymousUser,
  setAnonymousUserEmail,
  
  // Clears
  clearIsAnonymousUser,
  clearAnonymousUserEmail,
} = userSlice.actions;
export default userSlice.reducer;