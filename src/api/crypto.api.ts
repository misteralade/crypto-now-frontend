import {axiosGetRequestHandler} from "./index.ts";
import type {
  SupportedCryptoOrCurrencyResponse,
  SupportedPlatformCryptoWalletResponse
} from "../types/response.payload.types.ts";

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

  async getPlatformWallets() {
    const { data, message, success }: { data: SupportedPlatformCryptoWalletResponse[], message: string, success: boolean} = await axiosGetRequestHandler("/crypto/supported-cryptos/platform/receiving");

    return { data, message, success };
  }

  async getSupportedCryptoById(selectedCryptoId: string) {
    const { data, message, success }: { data: SupportedCryptoOrCurrencyResponse, message: string, success: boolean} = await axiosGetRequestHandler(`/crypto/supported-crypto/${selectedCryptoId}`);

    return { data, message, success };
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
