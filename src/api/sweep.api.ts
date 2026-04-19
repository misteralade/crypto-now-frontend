import {
  axiosGetRequestHandler,
  axiosPostRequestHandler,
} from "./index.ts";
import type { BaseApiResponse } from "../types/response.payload.types.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SweepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "PARTIAL";

export interface SweepPreviewData {
  cryptocurrencyId: string;
  network: string;
  targetAdminWallet: { id: string; address: string };
  totalWallets: number;
  estimatedAmount: number;
}

export interface SweepWalletResult {
  walletAddress: string;
  derivationPath: string;
  status: "pending" | "success" | "failed" | "skipped";
  balance?: number;
  amount: number;
  txHash: string | null;
  error: string | null;
}

export interface SweepRequest {
  id: string;
  cryptocurrencyId: string;
  network: string;
  adminWalletId: string;
  initiatedBy: string;
  status: SweepStatus;
  totalWalletsFound: number;
  totalWalletsSwept: number;
  totalWalletsFailed: number;
  totalWalletsSkipped: number;
  estimatedTotalAmount: number;
  actualTotalAmount: number;
  targetAddress: string;
  sweepResults: SweepWalletResult[] | null;
  failureReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SweepHistoryData {
  data: SweepRequest[];
  total: number;
  page: number;
  size: number;
}

export interface InitiateSweepParams {
  cryptocurrencyId: string;
  network: string;
}

export interface SweepHistoryParams {
  page?: number;
  size?: number;
  cryptocurrencyId?: string;
  network?: string;
  status?: SweepStatus;
}

// ─── API Class ────────────────────────────────────────────────────────────────

class SweepServiceApi {
  private static instance: SweepServiceApi;

  private constructor() {}

  public static getInstance(): SweepServiceApi {
    if (!SweepServiceApi.instance) {
      SweepServiceApi.instance = new SweepServiceApi();
    }
    return SweepServiceApi.instance;
  }

  /** Dry-run: preview how many wallets + estimated balance before sweeping */
  async previewSweep(cryptocurrencyId: string, network: string) {
    return await axiosGetRequestHandler(
      `/sweep/admin/sweep/preview/${cryptocurrencyId}/${network}`
    ) as BaseApiResponse<SweepPreviewData>;
  }

  /** Initiate a real sweep — returns immediately with sweepId */
  async initiateSweep(params: InitiateSweepParams) {
    return await axiosPostRequestHandler("/sweep/admin/sweep/initiate", params) as BaseApiResponse<{
      sweepId: string;
    }>;
  }

  /** Poll the real-time status of a sweep */
  async getSweepById(sweepId: string) {
    return await axiosGetRequestHandler(`/sweep/admin/sweep/${sweepId}`) as BaseApiResponse<SweepRequest>;
  }

  /** Paginated history of all sweep requests */
  async getSweepHistory(params?: SweepHistoryParams) {
    return await axiosGetRequestHandler("/sweep/admin/sweep/history", params) as BaseApiResponse<SweepHistoryData>;
  }
}

export const sweepServiceApi = SweepServiceApi.getInstance();
