import {axiosPostRequestHandler, axiosGetRequestHandler, axiosPatchRequestHandler} from "./index.ts";
import type {AuthRequestSchema} from "../types/request.api.types.ts";
import type { BaseApiResponse} from "../types/response.payload.types.ts";

// import {LoginRequestSchema} from "../schema/auth.schema.ts";

class AuthServiceApi {
  private static instance: AuthServiceApi;
  
  private constructor() {
  }
  
  public static getInstance(): AuthServiceApi {
    if (!AuthServiceApi.instance) {
      AuthServiceApi.instance = new AuthServiceApi();
    }
    return AuthServiceApi.instance;
  }
  
  async login(payload: AuthRequestSchema) {
    return await axiosPostRequestHandler("/user/auth/sign-in", payload) as BaseApiResponse<null | { twoFactorRequired: boolean }>;
  }
  
  async signup(payload: AuthRequestSchema) {
    return await axiosPostRequestHandler("/user/auth/sign-up", payload);
  }
  
  async forgotPassword(email: string) {
    return await axiosGetRequestHandler(`/user/auth/password-reset/request?email=${email}`);
  }
  
  async changePassword() {
    return await axiosGetRequestHandler(`/user/auth/change-password/request`) as BaseApiResponse<null>;
  }
  
  async confirmPasswordRequest(token: string, newPassword: string, confirmPassword: string) {
    return await axiosPatchRequestHandler(`/user/auth/password-reset/confirm`, { token, password: newPassword, confirmPassword });
  }
  
  async toggleTwoFactorAuthentication() {
    return await axiosPatchRequestHandler('/user/auth/two-factor-authentication')
  }
  
  async verifyTwoFactorAuthenticationCode(code: string) {
    return await axiosPostRequestHandler(`/user/auth/two-factor-authentication/verify`, { code }) as BaseApiResponse<null>;
  }
  
  // async activateAccount(token: string) {
  //     return await axiosPatchRequestHandler(`/user/auth/activate?token=${token}`);
  // }
  
}

export const authServiceApi = AuthServiceApi.getInstance();
