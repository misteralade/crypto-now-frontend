import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {personalInformationInitialState} from "./states/user.states.ts";

const userSlice = createSlice({
  name: "user",
  initialState: {
    trade: {
      anonymous: {
        isAnonymousUser: undefined as boolean | undefined,
        email: undefined as string | undefined,
      }
    },
    profile: {
      personalInfo: personalInformationInitialState,
    },
  },
  reducers: {
    // Sets
    setIsAnonymousUser: (state, action:PayloadAction<boolean>) => {
      state.trade.anonymous.isAnonymousUser = action.payload;
    },
    setAnonymousUserEmail: (state, action:PayloadAction<string>) => {
      state.trade.anonymous.email = action.payload;
    },
    setProfilePersonalInfoField: (state, action:PayloadAction<{ field: 'firstName' | 'lastName' | 'phoneNumber' | 'dob' | 'profileImg', value: string }>) => {
      const { field, value } = action.payload;
      state.profile.personalInfo[field] = value;
    },
    

    // Clears
    clearIsAnonymousUser: (state) => {
      state.trade.anonymous.isAnonymousUser = undefined;
    },
    clearAnonymousUserEmail: (state) => {
      state.trade.anonymous.email = undefined;
    },
    clearProfilePersonalInfoField: (state) => {
      state.profile.personalInfo = { ...personalInformationInitialState };
    }
  },
});

export const {
  // Sets
  setIsAnonymousUser,
  setAnonymousUserEmail,
  setProfilePersonalInfoField,
  
  // Clears
  clearIsAnonymousUser,
  clearAnonymousUserEmail,
  clearProfilePersonalInfoField,
} = userSlice.actions;
export default userSlice.reducer;