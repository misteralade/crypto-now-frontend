export type BaseApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SupportedCryptoOrCurrencyResponse = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  logoUrl: string;
}