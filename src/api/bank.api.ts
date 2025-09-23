import {axiosGetRequestHandler} from "./index.ts";
import type {
  SupportedPlatformBankAccountResponse
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
}

export const bankServiceApi = BankServiceApi.getInstance();
