import { axiosPostRequestHandler } from "./index.ts";
import {LoginRequestSchema} from "../schema/auth.schema.ts";

class AuthServiceApi {
  private static instance: AuthServiceApi;

  private constructor() {}

  public static getInstance(): AuthServiceApi {
    if (!AuthServiceApi.instance) {
      AuthServiceApi.instance = new AuthServiceApi();
    }

    return AuthServiceApi.instance;
  }

  async login(payload: LoginRequestSchema) {
    return await axiosPostRequestHandler("/admin/auth/sign-in", payload);
  }
}

export const authServiceApi = AuthServiceApi.getInstance();
