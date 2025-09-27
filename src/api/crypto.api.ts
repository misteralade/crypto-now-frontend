import {axiosGetRequestHandler, axiosPostRequestHandler} from "./index.ts";
import type {
  SupportedCryptoOrCurrencyResponse,
  SupportedPlatformCryptoWalletResponse, UserCryptoWalletResponse
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

  async getUserCryptoWallets(selectedCryptoId: string) {
    const { data, message, success }: { data: any, message: string, success: boolean} = await axiosGetRequestHandler(`/crypto/user/wallets/${selectedCryptoId}`);

    return { data: data.data as UserCryptoWalletResponse[], message, success };
  }

  async userCreateCryptoWallet(selectedCryptoId: string, payload: Record<string, any>) {
    const { data, message, success }: { data: UserCryptoWalletResponse, message: string, success: boolean} = await axiosPostRequestHandler(`/crypto/user/wallet/${selectedCryptoId}/create`, payload);

    return { data, message, success };
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
