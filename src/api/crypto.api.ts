import {
  axiosGetRequestHandler,
  axiosPostRequestHandler
} from "./index.ts";
import type {
  BaseApiResponse,
  CustodialWalletResponse,
  SupportedCryptoOrCurrencyResponse,
  SupportedPlatformCryptoWalletResponse,
} from "../types/response.payload.types.ts";

class CryptoServiceApi {
  private static instance: CryptoServiceApi;

  private constructor()  {}

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

  async getPlatformWallet(id: string) {
    return  await axiosGetRequestHandler(`/crypto/supported-crypto/platform/receiving/${id}`) as BaseApiResponse<SupportedPlatformCryptoWalletResponse>;
  }

  async getSupportedCryptoById(selectedCryptoId: string) {
    const { data, message, success }: { data: SupportedCryptoOrCurrencyResponse, message: string, success: boolean} = await axiosGetRequestHandler(`/crypto/supported-crypto/${selectedCryptoId}`);

    return { data, message, success };
  }

  async getMyCustodialWallets() {
    return await axiosGetRequestHandler(`/custodial-wallet/my`) as BaseApiResponse<CustodialWalletResponse[]>;
  }

  async generateCustodialWallet(cryptoId: string, network: string) {
    return await axiosPostRequestHandler(`/custodial-wallet/generate/${cryptoId}/${network}`, {}) as BaseApiResponse<CustodialWalletResponse>;
  }

  async generateAllCustodialWallets() {
    return await axiosPostRequestHandler(`/custodial-wallet/generate/all`, {}) as BaseApiResponse<CustodialWalletResponse[]>;
  }

  async allocateGuestSellWallet(payload: { sessionId: string; cryptoId: string; network: string }) {
    return await axiosPostRequestHandler(
      `/custodial-wallet/guest/allocate`,
      payload,
    ) as BaseApiResponse<CustodialWalletResponse>;
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
