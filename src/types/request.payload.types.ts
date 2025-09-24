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