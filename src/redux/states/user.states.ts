import type {
  ContactUsRequestType,
  CreateUserRequestType,
  UserProfileUpdateRequestType,
} from "../../schemas/user.schema.ts";

export const personalInformationInitialState: UserProfileUpdateRequestType = {
  firstName: undefined,
  lastName: undefined,
  phoneNumber: undefined,
  dob: undefined,
  profileImg: undefined,
};

export const newUserInitialState: CreateUserRequestType = {
  email: "",
  password: "",
};

export const contactUsInitialState: ContactUsRequestType = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};
