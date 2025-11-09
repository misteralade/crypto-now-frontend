import {
  axiosPostRequestHandler,
} from "./index.ts";
import type {CreateDisputeRequestType} from "../schemas/dispute.schema.ts";

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
}

export const disputeServiceApi = DisputeServiceApi.getInstance();
