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

export type AllBanksResponse = {
  id: string;
  name: string;
  logoUrl: string;
}

export type UserBankAccountResponse = {
  id: string;
  bankName: string;
  bankLogo: string;
  accountNumber: string;
  accountName: string;
  createdAt: Date;
}

export type UserCryptoWalletResponse = {
  id: string;
  walletAddress: string;
  network: string;
  walletLabel: string | null;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export type UserProfilePayload = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GetUserProfileResponse = {
  id: string;
  email: string;
  createdAt: Date;
  profile: UserProfilePayload;
}
