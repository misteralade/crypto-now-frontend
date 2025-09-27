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
  id: string | undefined;
  sessionId: string | undefined;
  userId: string | undefined;
  cryptoCurrencyId: string | undefined;
  exchangeRateId: string | undefined;
  type: "BUY" | "SELL" | undefined;
  amountCrypto: number | undefined;
  amountFiat: number | undefined;
  cryptoToStableRate: number | undefined;
  stableToCryptoRate: number | undefined;
  currency: string | undefined;
  status: "INITIATED" | "PENDING" | "AWAITING_PAYMENT" | "PAYMENT_RECEIVED" | "PAYMENT_CONFIRMED" | "PROCESSING" | "AWAITING_CRYPTO" | "CRYPTO_SENT" | "CRYPTO_RECEIVED" | "CRYPTO_CONFIRMED" | "COMPLETED" | "FAILED" | "EXPIRED" | "CANCELLED" | "DISPUTED" | "REFUNDING" | "REFUNDED" | "PAYMENT_ACCOUNT_CONFIRMED" | undefined;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined
  userBankAccountId: string | undefined;
  adminBankAccountId: string | undefined;
  userCryptoWalletId: string | undefined;
  bankTransferReference: string | undefined;
  receiptImageUrl: string | undefined;
  adminCryptoWalletId: string | undefined;
  cryptoTxHash: string | undefined;
  adminNotes: string | undefined;
  userNotes: string | undefined;
  internalNotes: string | undefined;
  failureReason: string | undefined;
  processedBy: string | undefined;
  processedAt: string | undefined;
  rate: string | undefined;

  // Date Range Filters
  createdAtFrom: string | undefined;
  createdAtTo: string | undefined;

  // Include Relations
  includeUser: boolean | undefined;
  includeCryptoCurrency: boolean | undefined;
  includeExchangeRate: boolean | undefined;
  includeAdminBankAccount: boolean | undefined;
  includeAdminCryptoWallet: boolean | undefined;
  includeUserBankAccount: boolean | undefined;
  includeUserCryptoWallet: boolean | undefined;
  includeProcessedBy: boolean | undefined;

  // Pagination
  page: number | undefined;
  size: number | undefined;

  // Ordering
  sortModel: {
    orderBy: "ASC" | "DESC";
    colId: string;
  } | undefined;
}
