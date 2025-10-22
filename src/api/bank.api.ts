import { axiosGetRequestHandler, axiosPostRequestHandler } from "./index.ts";
import type {
  AllBanksResponse, BaseApiResponse,
  SupportedPlatformBankAccountResponse, UserBanksAPIResponse
} from "../types/response.payload.types.ts";

class BankServiceApi {
  private static instance: BankServiceApi;

  private constructor() {}

  public static getInstance(): BankServiceApi {
    if (!BankServiceApi.instance) {
      BankServiceApi.instance = new BankServiceApi();
    }

    return BankServiceApi.instance;
  }

  async getPlatformBankDetails() {
    const { data, message, success }: { data: SupportedPlatformBankAccountResponse[], message: string, success: boolean} = await axiosGetRequestHandler(`/bank/supported-bank/platform`);

    return { data, message, success };
  }

  async getAllBanks() {
    const { data, message, success }: { data: AllBanksResponse[], message: string, success: boolean} = await axiosGetRequestHandler(`/bank/supported-bank/all`);

    return { data, message, success };
  }

  async getUserBankAccounts() {
    return  await axiosGetRequestHandler(`/bank/user/bank-accounts`) as UserBanksAPIResponse;
  }
  
  async getAnonymousUserBankAccounts(email: string) {
    return await axiosGetRequestHandler(`/bank/anonymous-user/bank-accounts`, { email }) as UserBanksAPIResponse;
  }
  
  async createUserBankAccount(payload: Record<string, any>) {
    return await axiosPostRequestHandler("/bank/user/create", payload) as BaseApiResponse<null>;
  }
  
  async createAnonymousUserBankAccount(payload: Record<string, any>) {
    return await axiosPostRequestHandler("/bank/anonymous-user/create", payload) as BaseApiResponse<null>;
  }
}

export const bankServiceApi = BankServiceApi.getInstance();
