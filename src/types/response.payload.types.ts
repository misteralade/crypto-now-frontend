import type { AxiosError } from "axios";
import type {
  TradeType,
  TransactionPriority,
  TransactionStatus,
} from "./request.payload.types.ts";
import type { TransactionAction } from "../schemas/enum.schema.ts";
import type { MessageAttachment } from "./transaction.types.ts";

export interface StandardizedServerError {
  success: false;
  message: string;
  data: any;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type AxiosServerError = AxiosError<StandardizedServerError>;

export type BaseApiResponse<T> = {
  success: boolean;
  message: string;
  error:
    | {
        [key: string]: {
          _errors?: string[];
        };
      }
    | any;
  data: T;
};

// Start Auth
export type AuthResponse = {
  message: string;
  success: boolean;
};

// End Auth

export type SupportedCryptoOrCurrencyResponse = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  logoUrl: string;
  buyRate: string;
  sellRate: string;
  minTransactionLimit: string;
  maxTransactionLimit: string;
  minTradeAmountForAnonymous: string;
  maxTradeAmountForAnonymous: string;
  networks?: string[]; // Blockchain networks this crypto supports (e.g. ['TRC20', 'BTC'])
};

export type SupportedExchangeRateResponse = {
  fiatRate: number;
  coinGeckoRate: number;
  currency: string; // "NGN" or "USD"
  platformRate: number;
  usdRate?: number; // Only present when currency is "USD"
};

export type SupportedPlatformBankAccountResponse = {
  id: string;
  bankName: string;
  bankLogo: string;
  type: string;
  accountNumber: string;
  accountHolderName: string;
};

export type SupportedPlatformCryptoWalletResponse = {
  id: string;
  walletAddress: string;
  network: string;
};

// Banks Start
export type UserBanksAPIResponse = BaseApiResponse<
  Array<UserBankAccountResponse>
>;

export type AllBanksResponse = {
  id: string;
  name: string;
  logoUrl: string;
  bankCode: string;
};

export type UserBankAccountResponse = {
  id: string;
  bankName: string;
  bankLogo: string;
  label: string;
  isDefault: boolean;
  accountNumber: string;
  accountName: string;
  isDeleted: boolean;
  createdAt: Date;
};
// Banks End

// Crypto Start
export type UserCryptoWalletAPIResponse = BaseApiResponse<
  Array<UserCryptoWalletResponse>
>;

export type CustodialWalletResponse = {
  id: string;
  userId: string;
  cryptocurrencyId: string;
  network: string;
  walletAddress: string;
  derivationIndex: number;
  isActive: boolean;
  createdAt: Date;
  note?: string;
};

export type UserCryptoWalletResponse = {
  id: string;
  walletAddress: string;
  network: string;
  walletLabel: string | null;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: Date;
  cryptocurrency: CryptoCurrencyResponseEntity | undefined;
};

export type UserProfilePayload = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  profileImg: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetUserProfileResponse = {
  id: string;
  email: string;
  createdAt: Date;
  twoFactorEnabled: boolean;
  profile: UserProfilePayload;
};

// Start Transactions
export type CryptoCurrencyResponseEntity = {
  id: string;
  name: string;
  description: string;
  symbol: string;
  maxTransactionLimit: string;
  minTransactionLimit: string;
  maxTradeAmountForAnonymous: string;
  minTradeAmountForAnonymous: string;
  isStableCoin: boolean;
  logoUrl: string;
  buyRate: string;
  sellRate: string;
  isActive: boolean;
  websiteUrl: string;
  whitepaperUrl: string;
  createdAt: Date;
};

export type UserResponseEntity = {
  id: string;
  email: string;
  profile?: UserProfilePayload;
  isVerified: boolean;
  createdAt: Date;
};

export type ExchangeRateResponseEntity = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  platformRate: string;
  rate: string;
  action: TradeType;
  createdAt: Date;
};

export type UserBankAccountResponseEntity = {
  id: string;
  userId: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankLogo: string;
  createdAt: string;
};

export type AdminBankAccountResponseEntity = {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  isActive: boolean;
  bankName: string;
  bankLogo: string;
  instructions: string;
  createdAt: Date;
};

export type AdminAndUserCryptoWalletResponseEntity = {
  id: string;
  userId: string;
  createdBy: string;
  walletAddress: string;
  isActive: boolean;
  isPrimary: boolean;
  isVerified: boolean;
  network: string;
  createdAt: Date;
};

export type AdminResponseEntity = {
  id: string;
  email: string;
  active: boolean;
  lastActive: Date;
  createdAt: Date;
};

// Transaction Response
export type InitiateTransactionAPIResponse = BaseApiResponse<{
  sessionId: string;
}>;

export type TransactionResponseEntity = {
  id: string;
  userId: string;
  sessionId: string;
  cryptocurrencyId: string;
  rateSnapshot: Record<string, any> | null;
  type: TradeType;
  amountCrypto: string;
  amountFiatNGN: string;
  amountFiat: string;
  cryptoToStableRate: string;
  stableToFiatRate: string;
  stableToCryptoRate: string;
  currency: string;
  status: TransactionStatus;
  priority: TransactionPriority;
  userBankAccountId: string | null;
  adminBankAccountId: string | null;
  userCryptoWalletId: string | null;
  bankTransferReference: string | null;
  receiptImageUrl: string;
  adminCryptoWalletId: string | null;
  cryptoTxHash: string | null;
  adminNotes: string | null;
  userNotes: string | null;
  internalNotes: string | null;
  failureReason: string | null;
  payoutFailureReason?: string | null;
  confirmationCount?: number;
  requiredConfirmations?: number;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: Date;
  updatedAt: Date;
  cryptocurrency: CryptoCurrencyResponseEntity;
  dispute: DisputeDetailsResponse;
  user: UserResponseEntity;
  userBankAccount: UserBankAccountResponseEntity | null;
  adminBankAccount: AdminBankAccountResponseEntity | null;
  userCryptoWallet: AdminAndUserCryptoWalletResponseEntity | null;
  adminCryptoWallet: AdminAndUserCryptoWalletResponseEntity | null;
  admin: AdminResponseEntity | null;
};

export type UserTransactionsHistoryResponse = {
  count: number;
  limit: number;
  page: number;
  totalPages: number;
  transactions: TransactionResponseEntity[];
};

// Stat Transaction
export type GetTransactionDetailsAPIResponse =
  BaseApiResponse<SearchTransactionsResponse>;

export type GetDisputeMessagesAPIResponse = BaseApiResponse<
  Array<DisputeMessageResponse>
>;

export type GetDisputeDetailsAPIResponse =
  BaseApiResponse<DisputeDetailsResponse>;

export type DisputeDetailsResponse = {
  id: string;
  disputeReason: string;
  status:
    | "OPEN"
    | "UNDER_REVIEW"
    | "AWAITING_EVIDENCE"
    | "AWAITING_USER_RESPONSE"
    | "AWAITING_ADMIN_RESPONSE"
    | "ESCALATED"
    | "RESOLVED"
    | "REJECTED"
    | "CLOSED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  lastMessageAt: Date;
  attachments: MessageAttachment[];
  resolutionNotes: string | null;
  transaction: SearchTransactionsResponse | null;
  creator: UserResponseEntity | null;
  resolver: AdminResponseEntity | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DisputeMessageResponse = {
  id: string;
  disputeId: string;
  messageText: string;
  attachments: MessageAttachment[];
  senderType: "USER" | "ADMIN";
  adminId: string | null;
  userId: string | null;
  email: string;
  admin: AdminResponseEntity;
  user: UserResponseEntity;
  createdAt: Date;
};

export type SearchTransactionsResponse = {
  adminPaymentReceiptUrl: string | undefined;
  id: string;
  userId: string;
  sessionId: string;
  cryptocurrencyId: string;
  rateSnapshot: Record<string, any> | null;
  type: TransactionAction;
  amountCrypto: string;
  amountFiat: string;
  cryptoToStableRate: string;
  stableToFiatRate: string;
  stableToCryptoRate: string;
  currency: string;
  status: TransactionStatus;
  email: string | undefined;
  priority: TransactionPriority;
  userBankAccountId: string;
  adminBankAccountId: string;
  userCryptoWalletId: string;
  bankTransferReference: string;
  receiptImageUrl: string;
  adminCryptoWalletId: string;
  cryptoTxHash: string;
  adminNotes: string;
  userNotes: string;
  internalNotes: string;
  failureReason: string;
  payoutFailureReason?: string | null;
  confirmationCount?: number;
  requiredConfirmations?: number;
  processedBy: string;
  processedAt: Date;
  usdAmount: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: GetUserProfileResponse;
  profile?: UserProfilePayload;
  cryptocurrency?: CryptoCurrencyResponseEntity;
  userBankAccount?: UserBankAccountResponse;
  userCryptoWallet?: UserCryptoWalletResponse;
};

export type TransactionSummaryResponseEntity = {
  cryptoCurrencySymbol: string;
  cryptoCurrencyName: string;
  cryptoCurrencyId: string;
  cryptoCurrencyImageUrl: string;
  transactionCount: string;
  totalFiatAmount: string;
  totalCryptoAmount: string;
  totalUsdAmount: string;
  cryptoBought: string;
  cryptoSold: string;
  usdSpentOnBuying: string;
  usdReceivedFromSelling: string;
  fiatSpentOnBuying: string;
  fiatReceivedFromSelling: string;
  buyTransactionCount: string;
  sellTransactionCount: string;
  currency: string;
};

export type TotalTransactionSummaryEntity = {
  cryptoSymbol: string;
  cryptoName: string;
  transactionCount: string;
  buyCount: string;
  sellCount: string;
  cryptoBought: string;
  cryptoSold: string;
  totalCryptoAmount: string;
  totalFiatAmount: string;
  fiatSpentOnBuying: string;
  fiatReceivedFromSelling: string;
  totalUsdAmount: string;
  usdSpentOnBuying: string;
  usdReceivedFromSelling: string;
};

export type TransactionSummaryResponse = {
  summary: TransactionSummaryResponseEntity[];
  total: TotalTransactionSummaryEntity[];
};
// End Transactions

// Testimonials
export type TestimonialResponse = {
  id: string;
  creatorId: string;
  isPublished: boolean;
  contentLink: string;
  name: string;
  description: string;
  contentType: "VIDEO" | "IMAGE" | "TEXT";
  createdAt: string;
  updatedAt: string;
};

export type TestimonialPaginationResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TestimonialsDataResponse = {
  testimonials: TestimonialResponse[];
  pagination: TestimonialPaginationResponse;
};

export type GetTestimonialsAPIResponse =
  BaseApiResponse<TestimonialsDataResponse>;
// End Testimonials
