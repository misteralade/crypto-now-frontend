import { axiosPostRequestHandler, axiosGetRequestHandler, axiosPatchRequestHandler} from "./index.ts";
// import {LoginRequestSchema} from "../schema/auth.schema.ts";

class AuthServiceApi {
  private static instance: AuthServiceApi;

  private constructor() {}

  public static getInstance(): AuthServiceApi {
    if (!AuthServiceApi.instance) {
      AuthServiceApi.instance = new AuthServiceApi();
    }
    return AuthServiceApi.instance;
  }

  async login(payload: any) {
    console.log('Login payload:', payload);
    return await axiosPostRequestHandler("/admin/auth/sign-in", payload);
  }
  async signup(payload: any){
    return await axiosPostRequestHandler("/admin/auth/sign-up", payload);
  }
  async forgotPassword(email: string) {
  return await axiosGetRequestHandler(`/user/auth/password-reset/request?email=${email}`);
}
   async confirmPasswordRequest(token: string, newPassword: string){
    return await axiosPatchRequestHandler(`/user/auth/password-reset/confirm`, {token, newPassword});
}
  async activateAccount(token: string){
  return await axiosPatchRequestHandler(`/user/auth/activate?token=${token}`);
}

}

export const authServiceApi = AuthServiceApi.getInstance();
