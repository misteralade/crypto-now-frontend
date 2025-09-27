import {toast} from "react-toastify";
import {axiosPatchRequestHandler, axiosPostRequestHandler, axiosPutRequestHandler} from "./index.ts";
import type {SearchTransactionsRequestPayload} from "../types/request.payload.types.ts";

class TransactionServiceApi {
  private static instance: TransactionServiceApi;

  private constructor() {}

  public static getInstance(): TransactionServiceApi {
    if (!TransactionServiceApi.instance) {
      TransactionServiceApi.instance = new TransactionServiceApi();
    }

    return TransactionServiceApi.instance;
  }

  async uploadTransactionReceipt(formData: FormData) {
    const response = await axiosPostRequestHandler(
      '/transaction/receipt/anonymous/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    if (response.success) {
      toast.success(response.message);
      return response.data;
    } else {
      toast.error(response.message);
    }
  }

  async calculateAmountToReceive(exchangeRateId: string, amountToSend: number) {
    const { data, success }: { data: string, success: boolean} = await axiosPostRequestHandler(
      `/transaction/calculate/amount/${exchangeRateId}`,
      { amountToSend }
    )

    return { data, success };
  }

  async initiateTransaction(transactionData: Record<string, any>) {
    const {data, message, success, error}: {
      data: { sessionId: string },
      message: string,
      success: boolean,
      error: any
    } = await axiosPostRequestHandler(
      '/transaction/initiate',
      transactionData
    )

    if (!success || error) {
      toast.error(error.message || message || error || "Failed to initiate transaction");
      return;
    }

    return data.sessionId;
  }

  async makeTransactionPayment(paymentData: Record<string, any>) {
    const {data, message, success, error}: {
      data: { sessionId: string },
      message: string,
      success: boolean,
      error: any
    } = await axiosPutRequestHandler(
      `/transaction/make-payment/${paymentData.sessionId}`,
      paymentData
    )

    if (!success || error) {
      toast.error(error.message || message || error || "Failed to initiate transaction");
      return;
    }

    return data.sessionId;
  }

  async confirmReceivingPaymentAccount(sessionId: string, accountData: Record<string, any>) {
    const {data, message, success, error}: {
      data: { sessionId: string },
      message: string,
      success: boolean,
      error: any
    } = await axiosPatchRequestHandler(
      `/transaction/confirm-receiving-payment-account/${sessionId}`,
      {
        ...(accountData.walletId ? { walletId: accountData.walletId } : {}),
        ...(accountData.accountId ? { accountId: accountData.accountId } : {}),
      }
    )

    if (!success || error) {
      toast.error(error.message || message || error || "Failed to confirm receiving account");
      return;
    }

    return data.sessionId;
  }

  async searchUserTransactions(payload: SearchTransactionsRequestPayload) {
    const { data, message, success }: { data: { transactions: any[] }, message: string, success: boolean } = await axiosPostRequestHandler("/transaction/user/search-history", payload);

    return { data, message, success };
  }
}

export const transactionServiceApi = TransactionServiceApi.getInstance();
