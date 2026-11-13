import {API_KIT} from "./index.ts";
import type { SupportedExchangeRateResponse } from "../types/response.payload.types.ts";

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
    const { data: { data, message, success } } = await API_KIT.get<{
      data: SupportedExchangeRateResponse; message: string; success: boolean;
    }>(`/rate/crypto-rate/${cryptoId}/${currencyId}/${action}`, { timeout: 20000 });

    return { data, message, success };
  }
}

export const exchangeRateServiceApi = ExchangeRateServiceApi.getInstance();
