export type BaseApiResponse<T> = {
  success: boolean;
  message: string;
  error: any;
  data: T;
};

export type SupportedCryptoOrCurrencyResponse = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  logoUrl: string;
}

export type SupportedExchangeRateResponse = {
  fiatRate: number;
  coinGeckoRate: number;
  validUntil: string; // ISO date string
  rateId: string;
}

export type SupportedPlatformBankAccountResponse = {
  id: string;
  bankName: string;
  bankLogo: string;
  type: string;
  accountNumber: string;
  accountHolderName: string;
}

export type SupportedPlatformCryptoWalletResponse = {
  id: string;
  walletAddress: string;
  network: string;
}
