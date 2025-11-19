import type {UserProfileUpdateRequestType} from "../../schemas/user.schema.ts";

export const personalInformationInitialState: UserProfileUpdateRequestType = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dob: '',
  profileImg: '',
}