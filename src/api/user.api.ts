import { axiosGetRequestHandler } from "./index.ts";
import type { GetUserProfileResponse } from "../types/response.payload.types.ts";

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
}

export const userServiceApi = UserServiceApi.getInstance();
