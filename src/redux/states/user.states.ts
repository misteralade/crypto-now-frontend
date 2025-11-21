import type {
  ContactUsRequestType,
  CreateUserRequestType,
  UserProfileUpdateRequestType
} from "../../schemas/user.schema.ts";

export const personalInformationInitialState: UserProfileUpdateRequestType = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dob: '',
  profileImg: '',
};

export const newUserInitialState: CreateUserRequestType = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
}

export const contactUsInitialState: ContactUsRequestType = {
  firstName: '',
  lastName: '',
  email: '',
  message: ''
}