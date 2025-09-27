import type {
  InitiateTransactionRequestPayload,
  SearchTransactionsRequestPayload
} from "../../types/request.payload.types.ts";

export const initiateTransactionInitialState: InitiateTransactionRequestPayload | null = {
  exchangeRateId: undefined,
  action: undefined,
  tokenId: undefined,
  currencyId: undefined,
  amountToReceive: undefined,
  amountToSend: undefined,
  receiptUrl: undefined,
  transactionHash: undefined,
}

export const userSearchTransactionInitialState: SearchTransactionsRequestPayload | null = {
  id: null,
  sessionId: null,
  userId: null,
  cryptoCurrencyId: null,
  exchangeRateId: null,
  type: null,
  amountCrypto: null,
  amountFiat: null,
  cryptoToStableRate: null,
  stableToCryptoRate: null,
  currency: null,
  status: null,
  priority: null,
  userBankAccountId: null,
  adminBankAccountId: null,
  userCryptoWalletId: null,
  bankTransferReference: null,
  receiptImageUrl: null,
  adminCryptoWalletId: null,
  cryptoTxHash: null,
  adminNotes: null,
  userNotes: null,
  internalNotes: null,
  failureReason: null,
  processedBy: null,
  processedAt: null,
  rate: null,

  // Date Range Filters
  createdAtFrom: null,
  createdAtTo: null,

  // Include Relations
  includeUser: false,
  includeCryptoCurrency: false,
  includeExchangeRate: false,
  includeAdminBankAccount: false,
  includeAdminCryptoWallet: false,
  includeUserBankAccount: false,
  includeUserCryptoWallet: false,
  includeProcessedBy: false,

  // Pagination
  page: 1,
  size: 10,

  // Ordering
  sortModel: {
    orderBy: "DESC",
    colId: "createdAt",
  },
}