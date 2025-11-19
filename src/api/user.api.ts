import {axiosGetRequestHandler, axiosPatchRequestHandler, axiosPostRequestHandler} from "./index.ts";
import type {BaseApiResponse, GetUserProfileResponse} from "../types/response.payload.types.ts";
import type {UserProfileUpdateRequestType} from "../schemas/user.schema.ts";

// import {LoginRequestSchema} from "../schema/auth.schema.ts";

class UserServiceApi {
  private static instance: UserServiceApi;

  private constructor() {
  }

  public static getInstance(): UserServiceApi {
    if (!UserServiceApi.instance) {
      UserServiceApi.instance = new UserServiceApi();
    }
    return UserServiceApi.instance;
  }

  async getUserProfile() {
    const { data, message, success }:{ data: GetUserProfileResponse, message: string, success: boolean }  = await axiosGetRequestHandler('/user/profile');

    return { data, message, success };
  }
  
  async pingUser() {
    return await axiosGetRequestHandler('/user/ping-user') as BaseApiResponse<null>;
  }
  
  async uploadProfilePicture(formData: FormData) {
    const response =  await axiosPostRequestHandler(
      `/upload/profile-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.message);
  }
  
  async updateUserProfile(payload: UserProfileUpdateRequestType) {
    return await axiosPatchRequestHandler("/user/profile", payload);
  }
}

export const userServiceApi = UserServiceApi.getInstance();
