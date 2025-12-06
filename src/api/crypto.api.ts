import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from "./index.ts";
import type {
  BaseApiResponse,
  SupportedCryptoOrCurrencyResponse,
  SupportedPlatformCryptoWalletResponse, UserCryptoWalletResponse
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

  async getUserCryptoWallets(selectedCryptoId: string) {
    const { data, message, success }: { data: any, message: string, success: boolean} = await axiosGetRequestHandler(`/crypto/user/wallets/${selectedCryptoId}`);

    return { data: data.data as UserCryptoWalletResponse[], message, success };
  }
  
  async getAllUserCryptoWallets() {
    const { data, message, success }: { data: any, message: string, success: boolean} = await axiosGetRequestHandler(`/crypto/user/wallets`);
    
    return { data: data.data as UserCryptoWalletResponse[], message, success };
  }
  
  async getAnonymousUserCryptoWallets(selectedCryptoId: string, email: string ) {
    const { data, message, success }: { data: any, message: string, success: boolean} = await axiosGetRequestHandler(`/crypto/anonymous-user/wallets/${selectedCryptoId}`, { email });
    
    return { data: data.data as UserCryptoWalletResponse[], message, success };
  }

  async userCreateCryptoWallet(selectedCryptoId: string, payload: Record<string, any>) {
    return await axiosPostRequestHandler(`/crypto/user/wallet/${selectedCryptoId}/create`, payload) as BaseApiResponse<null>;
  }
  
  async anonymousUserCreateCryptoWallet(selectedCryptoId: string, payload: Record<string, any>) {
    return await axiosPostRequestHandler(`/crypto/anonymous-user/wallet/${selectedCryptoId}/create`, payload) as BaseApiResponse<null>;
  }
  
  async userMakeWalletPrimary(walletId: string) {
    return await axiosPatchRequestHandler(`/crypto/user/${walletId}/make-primary`) as BaseApiResponse<null>;
  }
  
  async userDeleteCryptoWallet(walletId: string) {
    return await axiosDeleteRequestHandler(`/crypto/user/${walletId}/delete`) as BaseApiResponse<null>;
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
