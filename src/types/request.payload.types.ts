export type InitiateTransactionRequestPayload = {
  exchangeRateId?: string;
  action?: "BUY" | "SELL";
  tokenId?: string;
  currencyId?: string;
  amountToReceive?: number;
  amountToSend?: number;
  receiptUrl?: string;
  transactionHash?: string;
}

export type CreateBankAccountRequestPayload = {
  bankId: string | null;
  accountName: string | null;
  accountNumber: string | null;
}

export type UserCreateCryptoWalletRequestPayload = {
  walletAddress: string;
  network: string;
  isVerified: boolean;
  isPrimary: boolean;
  walletLabel?: string | null;
}

export type SearchTransactionsRequestPayload = {
  id: string | null;
  sessionId: string | null;
  userId: string | null;
  cryptoCurrencyId: string | null;
  exchangeRateId: string | null;
  type: "BUY" | "SELL" | null;
  amountCrypto: number | null;
  amountFiat: number | null;
  cryptoToStableRate: number | null;
  stableToCryptoRate: number | null;
  currency: string | null;
  status: "INITIATED" | "PENDING" | "AWAITING_PAYMENT" | "PAYMENT_RECEIVED" | "PAYMENT_CONFIRMED" | "PROCESSING" | "AWAITING_CRYPTO" | "CRYPTO_SENT" | "CRYPTO_RECEIVED" | "CRYPTO_CONFIRMED" | "COMPLETED" | "FAILED" | "EXPIRED" | "CANCELLED" | "DISPUTED" | "REFUNDING" | "REFUNDED" | "PAYMENT_ACCOUNT_CONFIRMED" | null;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | null
  userBankAccountId: string | null;
  adminBankAccountId: string | null;
  userCryptoWalletId: string | null;
  bankTransferReference: string | null;
  receiptImageUrl: string | null;
  adminCryptoWalletId: string | null;
  cryptoTxHash: string | null;
  adminNotes: string | null;
  userNotes: string | null;
  internalNotes: string | null;
  failureReason: string | null;
  processedBy: string | null;
  processedAt: string | null;
  rate: string | null;

  // Date Range Filters
  createdAtFrom: string | null;
  createdAtTo: string | null;

  // Include Relations
  includeUser: boolean | null;
  includeCryptoCurrency: boolean | null;
  includeExchangeRate: boolean | null;
  includeAdminBankAccount: boolean | null;
  includeAdminCryptoWallet: boolean | null;
  includeUserBankAccount: boolean | null;
  includeUserCryptoWallet: boolean | null;
  includeProcessedBy: boolean | null;

  // Pagination
  page: number | null;
  size: number | null;

  // Ordering
  sortModel: {
    orderBy: "ASC" | "DESC";
    colId: string;
  } | null;
}
