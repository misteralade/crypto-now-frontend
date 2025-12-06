import {
  axiosGetRequestHandler,
  axiosPostRequestHandler,
} from "./index.ts";
import type {CreateDisputeRequestType} from "../schemas/dispute.schema.ts";
import type {
  BaseApiResponse,
  GetDisputeDetailsAPIResponse,
  GetDisputeMessagesAPIResponse
} from "../types/response.payload.types.ts";
import type {MessageAttachment} from "../types/transaction.types.ts";

class DisputeServiceApi {
  private static instance: DisputeServiceApi;

  private constructor() {}

  public static getInstance(): DisputeServiceApi {
    if (!DisputeServiceApi.instance) {
      DisputeServiceApi.instance = new DisputeServiceApi();
    }

    return DisputeServiceApi.instance;
  }
  
  async initiateDisputeTransaction(sessionId: string, payload: CreateDisputeRequestType) {
    return await axiosPostRequestHandler(`/dispute/${sessionId}/create`, payload);
  }
  
  async getDisputeMessage(disputeId: string) {
    return await axiosGetRequestHandler(`/dispute/messages/${disputeId}`) as GetDisputeMessagesAPIResponse;
  }
  
  async getDisputeDetails(disputeId: string) {
    return await axiosGetRequestHandler(`/dispute/${disputeId}`) as GetDisputeDetailsAPIResponse;
  }
  
  async sendDisputeMessage(disputeId: string, message: string, attachments: Array<MessageAttachment>) {
    return await axiosPostRequestHandler(`/dispute/message/${disputeId}/send`, {
      message,
      attachments,
    }) as BaseApiResponse<null>;
  }
}

export const disputeServiceApi = DisputeServiceApi.getInstance();
