import {
  axiosGetRequestHandler,
  axiosPostRequestHandler,
} from "./index.ts";
import type {
  GetKycSessionApiResponse,
  GetKycStatusApiResponse,
  KycActionApiResponse,
} from "../types/kyc.types.ts";

class KycServiceApi {
  private static instance: KycServiceApi;

  private constructor() {}

  public static getInstance(): KycServiceApi {
    if (!KycServiceApi.instance) {
      KycServiceApi.instance = new KycServiceApi();
    }
    return KycServiceApi.instance;
  }

  async startOrResumeSession(): Promise<KycActionApiResponse> {
    return axiosPostRequestHandler("/kyc/start", {});
  }

  async getSession(): Promise<GetKycSessionApiResponse> {
    return axiosGetRequestHandler("/kyc/session");
  }

  async saveNin(nin: string, firstName: string): Promise<KycActionApiResponse> {
    return axiosPostRequestHandler("/kyc/nin", { nin, firstName });
  }

  async startDiditVerification(): Promise<KycActionApiResponse> {
    return axiosPostRequestHandler("/kyc/didit/start", {});
  }

  async reconcileDiditCallback(
    verificationSessionId?: string | null,
    status?: string | null
  ): Promise<KycActionApiResponse> {
    const params = new URLSearchParams();
    if (verificationSessionId)
      params.set("verificationSessionId", verificationSessionId);
    if (status) params.set("status", status);
    const query = params.toString();
    const endpoint = query
      ? `/kyc/didit/callback/reconcile?${query}`
      : "/kyc/didit/callback/reconcile";
    return axiosGetRequestHandler(endpoint);
  }

  async getStatus(): Promise<GetKycStatusApiResponse> {
    return axiosGetRequestHandler("/kyc/status");
  }

  async retryVerification(): Promise<KycActionApiResponse> {
    return axiosPostRequestHandler("/kyc/retry", {});
  }
}

export const kycServiceApi = KycServiceApi.getInstance();
