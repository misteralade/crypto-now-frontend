import {axiosGetRequestHandler} from "./index.ts";
import type { SupportedExchangeRateResponse } from "../types/response.api.types.ts";

class ExchangeRateServiceApi {
  private static instance: ExchangeRateServiceApi;

  private constructor() {}

  public static getInstance(): ExchangeRateServiceApi {
    if (!ExchangeRateServiceApi.instance) {
      ExchangeRateServiceApi.instance = new ExchangeRateServiceApi();
    }

    return ExchangeRateServiceApi.instance;
  }

  async getExchangeRate(cryptoId: string, currencyId: string, action: "BUY" | "SELL") {
    const { data, message, success }: { data: SupportedExchangeRateResponse, message: string, success: boolean} = await axiosGetRequestHandler(`/rate/crypto-rate/${cryptoId}/${currencyId}/${action}`);

    return { data, message, success };
  }
}

export const exchangeRateServiceApi = ExchangeRateServiceApi.getInstance();
