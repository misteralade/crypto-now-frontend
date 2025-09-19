import {axiosGetRequestHandler} from "./index.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../types/response.api.types.ts";

class CryptoServiceApi {
  private static instance: CryptoServiceApi;

  private constructor() {}

  public static getInstance(): CryptoServiceApi {
    if (!CryptoServiceApi.instance) {
      CryptoServiceApi.instance = new CryptoServiceApi();
    }

    return CryptoServiceApi.instance;
  }

  async getSupportedCrypto() {
    const { data, message, success }: { data: SupportedCryptoOrCurrencyResponse[], message: string, success: boolean} = await axiosGetRequestHandler("/crypto/supported-cryptos");

    return { data, message, success };
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
