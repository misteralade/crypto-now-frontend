import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {newUserInitialState, personalInformationInitialState} from "./states/user.states.ts";
import type {CreateUserRequestType} from "../schemas/user.schema.ts";

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
    createUser: newUserInitialState,
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
    setCreateUserField: (state, action:PayloadAction<{ field: keyof CreateUserRequestType, value: string }>) => {
      const { field, value } = action.payload;
      state.createUser[field] = value;
    },
    setCreateUser: (state, action:PayloadAction<CreateUserRequestType>) => {
      state.createUser = action.payload;
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
    },
    clearCreateUserField: (state) => {
      state.createUser = { ...newUserInitialState };
    }
  },
});

export const {
  // Sets
  setIsAnonymousUser,
  setAnonymousUserEmail,
  setProfilePersonalInfoField,
  setCreateUserField,
  setCreateUser,
  
  // Clears
  clearIsAnonymousUser,
  clearAnonymousUserEmail,
  clearProfilePersonalInfoField,
  clearCreateUserField,
} = userSlice.actions;
export default userSlice.reducer;