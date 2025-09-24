import { axiosGetRequestHandler, axiosPostRequestHandler } from "./index.ts";
import type {
  AllBanksResponse,
  SupportedPlatformBankAccountResponse, UserBankAccountResponse
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
    const { data, message, success }: { data: UserBankAccountResponse[], message: string, success: boolean} = await axiosGetRequestHandler(`/bank/user/bank-accounts`);

    return { data, message, success };
  }

  async createUserBankAccount(payload: Record<string, any>) {
    const { data, message, success }: { data: null, message: string, success: boolean} = await axiosPostRequestHandler("/bank/user/create", payload);

    return { data, message, success };
  }
}

export const bankServiceApi = BankServiceApi.getInstance();
