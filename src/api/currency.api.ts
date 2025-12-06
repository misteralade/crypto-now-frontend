import {axiosGetRequestHandler} from "./index.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../types/response.payload.types.ts";

class CurrencyServiceApi {
  private static instance: CurrencyServiceApi;

  private constructor() {}

  public static getInstance(): CurrencyServiceApi {
    if (!CurrencyServiceApi.instance) {
      CurrencyServiceApi.instance = new CurrencyServiceApi();
    }

    return CurrencyServiceApi.instance;
  }

  async getSupportedCurrency() {
    const { data, message, success }: { data: SupportedCryptoOrCurrencyResponse[], message: string, success: boolean} = await axiosGetRequestHandler("/currency/supported-currency");

    return { data, message, success };
  }
}

export const currencyServiceApi = CurrencyServiceApi.getInstance();
