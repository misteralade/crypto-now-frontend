import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {contactUsInitialState, newUserInitialState, personalInformationInitialState} from "./states/user.states.ts";
import type {ContactUsRequestType, CreateUserRequestType} from "../schemas/user.schema.ts";

const userSlice = createSlice({
  name: "user",
  initialState: {
    trade: {
      anonymous: {
        isAnonymousUser: false as boolean | undefined,
        email: undefined as string | undefined,
      }
    },
    profile: {
      personalInfo: personalInformationInitialState,
    },
    createUser: newUserInitialState,
    contactUs: contactUsInitialState,
    authentication: {
      email: undefined as string | undefined,
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
    setCreateUserField: (state, action:PayloadAction<{ field: keyof CreateUserRequestType, value: string }>) => {
      const { field, value } = action.payload;
      state.createUser[field] = value;
    },
    setCreateUser: (state, action:PayloadAction<CreateUserRequestType>) => {
      state.createUser = action.payload;
    },
    setContactUs: (state, action:PayloadAction<ContactUsRequestType>) => {
      state.contactUs = action.payload;
    },
    setSignInEmail: (state, action:PayloadAction<string>) => {
      state.authentication.email = action.payload;
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
    },
    clearContactUs: (state) => {
      state.contactUs = contactUsInitialState;
    },
    clearSignInEmail: (state) => {
      state.authentication.email = undefined;
    },
  },
});

export const {
  // Sets
  setIsAnonymousUser,
  setAnonymousUserEmail,
  setProfilePersonalInfoField,
  setCreateUserField,
  setCreateUser,
  setContactUs,
  setSignInEmail,
  
  // Clears
  clearIsAnonymousUser,
  clearAnonymousUserEmail,
  clearProfilePersonalInfoField,
  clearCreateUserField,
  clearContactUs,
  clearSignInEmail,
} = userSlice.actions;
export default userSlice.reducer;