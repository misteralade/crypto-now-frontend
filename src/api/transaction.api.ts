import {toast} from "react-toastify";
import {axiosPostRequestHandler} from "./index.ts";

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
      console.log(response.data);
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
}

export const transactionServiceApi = TransactionServiceApi.getInstance();
