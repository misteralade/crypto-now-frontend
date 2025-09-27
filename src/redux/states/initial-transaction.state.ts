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
  id: undefined,
  sessionId: undefined,
  userId: undefined,
  cryptoCurrencyId: undefined,
  exchangeRateId: undefined,
  type: undefined,
  amountCrypto: undefined,
  amountFiat: undefined,
  cryptoToStableRate: undefined,
  stableToCryptoRate: undefined,
  currency: undefined,
  status: undefined,
  priority: undefined,
  userBankAccountId: undefined,
  adminBankAccountId: undefined,
  userCryptoWalletId: undefined,
  bankTransferReference: undefined,
  receiptImageUrl: undefined,
  adminCryptoWalletId: undefined,
  cryptoTxHash: undefined,
  adminNotes: undefined,
  userNotes: undefined,
  internalNotes: undefined,
  failureReason: undefined,
  processedBy: undefined,
  processedAt: undefined,
  rate: undefined,

  // Date Range Filters
  createdAtFrom: undefined,
  createdAtTo: undefined,

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