import {toast} from "react-toastify";
import {
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler,
} from "./index.ts";
import type {SearchTransactionsRequestPayload} from "../types/request.payload.types.ts";
import type {
  BaseApiResponse,
  GetTransactionDetailsAPIResponse,
  InitiateTransactionAPIResponse,
  TransactionSummaryResponse,
  UserTransactionsHistoryResponse
} from "../types/response.payload.types.ts";
import {SESSION_STORAGE_KEYS} from "../util/constants.util.ts";

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
    const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID)
    const response = await axiosPostRequestHandler(
      `/upload/user/transaction/${sessionId}/payment-receipt/anonymous`,
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
  
  async uploadDisputeAttachment(formData: FormData) {
    const response =  await axiosPostRequestHandler(
      `/upload/transaction/dispute/attachment-upload`,
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
  
  async initiateTransactionAnonymousUser(transactionData: Record<string, any>): Promise<InitiateTransactionAPIResponse> {
    return await axiosPostRequestHandler(
      '/transaction/initiate/anonymous',
      transactionData
    ) as InitiateTransactionAPIResponse
  }

  async createAndSubmitTransaction(payload: Record<string, any>): Promise<InitiateTransactionAPIResponse> {
    return await axiosPostRequestHandler('/transaction/create-and-submit', payload) as InitiateTransactionAPIResponse;
  }

  async anonymousCreateAndSubmitTransaction(payload: Record<string, any>): Promise<InitiateTransactionAPIResponse> {
    return await axiosPostRequestHandler('/transaction/create-and-submit/anonymous', payload) as InitiateTransactionAPIResponse;
  }

  async initiateTransaction(transactionData: Record<string, any>) {
    return await axiosPostRequestHandler(
      '/transaction/initiate',
      transactionData
    ) as InitiateTransactionAPIResponse
  }

  async makeTransactionPayment(paymentData: Record<string, any>) {
    const {data, message, success, error}: {
      data: { sessionId: string },
      message: string,
      success: boolean,
      error: any
    } = await axiosPatchRequestHandler(
      `/transaction/make-payment/${paymentData.sessionId}`,
      paymentData
    )

    if (!success || error) {
      toast.error(error.message || message || error || "Failed to initiate transaction");
      return;
    }

    return data.sessionId;
  }
  
  async anonymousUserMakeTransactionPayment(paymentData: Record<string, any>) {
    const {data, message, success, error}: {
      data: { sessionId: string },
      message: string,
      success: boolean,
      error: any
    } = await axiosPatchRequestHandler(
      `/transaction/make-payment/${paymentData.sessionId}/anonymous`,
      paymentData
    )
    
    if (!success || error) {
      toast.error(error.message || message || error || "Failed to initiate transaction");
      return;
    }
    
    return data.sessionId;
  }

  async confirmReceivingPaymentAccount(sessionId: string, accountData: Record<string, any>) {
     return await axiosPatchRequestHandler(
      `/transaction/confirm-receiving-payment-account/${sessionId}`,
      {
        ...(accountData.walletId ? { walletId: accountData.walletId } : {}),
        ...(accountData.accountId ? { accountId: accountData.accountId } : {}),
      }
    ) as BaseApiResponse<{ sessionId: string }>
  }
  
  async confirmAnonymousUserReceivingPaymentAccount(sessionId: string, accountData: Record<string, any>) {
    return await axiosPatchRequestHandler(
      `/transaction/confirm-receiving-payment-account/${sessionId}/anonymous`,
      {
        ...(accountData.walletId ? { walletId: accountData.walletId } : {}),
        ...(accountData.accountId ? { accountId: accountData.accountId } : {}),
        ...(accountData.email ? { email: accountData.email }: {}),
      }
    ) as BaseApiResponse<{ sessionId: string }>
  }

  async searchUserTransactions(payload: SearchTransactionsRequestPayload) {
    const { data, message, success }: { data: UserTransactionsHistoryResponse, message: string, success: boolean } = await axiosPostRequestHandler("/transaction/user/search-history", payload);

    return { data, message, success };
  }
  
  async getUserTransactionSummary() {
    const { data, message, success }: { data: TransactionSummaryResponse, message: string, success: boolean } = await axiosGetRequestHandler("/transaction/user/summary");

    return { data, message, success };
  }

  async getIncompleteTransactionsCount() {
    const { data, message, success }: { data: number, message: string, success: boolean } = await axiosGetRequestHandler("/transaction/user/incomplete-transactions/count");

    return { data, message, success };
  }
  
  async getTransactionDetails(sessionId: string) {
    return await axiosGetRequestHandler(`/transaction/details/${sessionId}`) as GetTransactionDetailsAPIResponse
  }

  async downloadSingleTransactionDetails(sessionId: string) {
    return await axiosGetRequestHandler(`/transaction/user/csv-download/${sessionId}`) as BaseApiResponse<BlobPart>
  }

  async downloadAllTransactionDetails(payload: SearchTransactionsRequestPayload, fileType: "CSV" | "PDF") {
    return await axiosPostRequestHandler(`/transaction/user/csv-download/all?fileType=${fileType}`, payload) as BaseApiResponse<null>
  }
}

export const transactionServiceApi = TransactionServiceApi.getInstance();
