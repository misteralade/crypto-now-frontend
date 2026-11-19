import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sweepServiceApi, type SweepHistoryParams } from "../api/sweep.api.ts";
import { QUERY_KEYS } from "./query.keys.ts";
import type { AxiosServerError } from "../types/response.payload.types.ts";
import { extractErrorMessage } from "../util/index.util.ts";
import { toast } from "react-toastify";

const TERMINAL_STATUSES = ["COMPLETED", "FAILED", "PARTIAL"];

export const useSweepQuery = () => {
  const queryClient = useQueryClient();

  // ─── Preview ────────────────────────────────────────────────────────────────
  const useSweepPreview = (cryptocurrencyId: string | undefined, network: string | undefined) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.PREVIEW, cryptocurrencyId, network],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.previewSweep(
          cryptocurrencyId!,
          network!
        );
        if (!success) throw new Error(message);
        return data;
      },
      enabled: !!cryptocurrencyId && !!network,
      staleTime: 30_000,
      retry: 1,
    });
  };

  // ─── History ────────────────────────────────────────────────────────────────
  const useSweepHistory = (params?: SweepHistoryParams) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.HISTORY, params],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.getSweepHistory(params);
        if (!success) throw new Error(message);
        return data;
      },
      staleTime: 15_000,
    });
  };

  // ─── Single sweep status (polling) ──────────────────────────────────────────
  const useSweepStatus = (sweepId: string | undefined) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.BY_ID, sweepId],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.getSweepById(sweepId!);
        if (!success) throw new Error(message);
        return data;
      },
      enabled: !!sweepId,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (!status || TERMINAL_STATUSES.includes(status)) return false;
        return 3000; // Poll every 3s while IN_PROGRESS / PENDING
      },
    });
  };

  // ─── Initiate Sweep Mutation ─────────────────────────────────────────────────
  const initiateSweepMutation = useMutation({
    mutationKey: [QUERY_KEYS.SWEEP.INITIATE],
    mutationFn: async ({
      cryptocurrencyId,
      network,
    }: {
      cryptocurrencyId: string;
      network: string;
    }) => {
      return await sweepServiceApi.initiateSweep({ cryptocurrencyId, network });
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        // Refresh the history list
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SWEEP.HISTORY] });
        toast.success("Sweep initiated. Tracking progress...");
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      const message = extractErrorMessage(error) || "Failed to initiate sweep. Please try again.";
      toast.error(message);
    },
  });

  return {
    useSweepPreview,
    useSweepHistory,
    useSweepStatus,
    initiateSweepMutation,
  };
};
