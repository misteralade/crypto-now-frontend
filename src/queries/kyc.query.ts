import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { QUERY_KEYS } from "./query.keys.ts";
import { kycServiceApi } from "../api/kyc.api.ts";
import { setKycSession, clearKycSession } from "../redux/kyc.slice.ts";
import { LOCAL_STORAGE_KEYS } from "../util/constants.util.ts";
import type { AxiosServerError } from "../types/response.payload.types.ts";

function extractErrorMessage(error: AxiosServerError): string {
  return (
    error.response?.data?.message || error.message || "Something went wrong"
  );
}

export const useKycQuery = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch: refetchSession,
  } = useQuery({
    queryKey: [QUERY_KEYS.KYC.GET_SESSION],
    queryFn: async () => {
      const { data, success } = await kycServiceApi.getSession();
      if (success && data) {
        dispatch(setKycSession(data));
      }
      return data ?? null;
    },
    enabled: !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
    staleTime: 0,
    retry: 1,
  });

  const startSessionMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.START_SESSION],
    mutationFn: async () => kycServiceApi.startOrResumeSession(),
    retry: false,
    onSuccess: ({ success, data, message }) => {
      if (success && data) {
        dispatch(setKycSession(data));
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.KYC.GET_SESSION],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const saveNinMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.SAVE_NIN],
    mutationFn: ({ nin, firstName }: { nin: string; firstName: string }) =>
      kycServiceApi.saveNin(nin, firstName),
    retry: false,
    onSuccess: ({ success, data, message }) => {
      if (success && data) {
        dispatch(setKycSession(data));
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.KYC.GET_SESSION],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const startDiditMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.SUBMIT],
    mutationFn: () => kycServiceApi.startDiditVerification(),
    retry: false,
    onError: (error: AxiosServerError) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const reconcileCallbackMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.GET_STATUS],
    mutationFn: ({
      verificationSessionId,
      status,
    }: {
      verificationSessionId?: string | null;
      status?: string | null;
    }) => kycServiceApi.reconcileDiditCallback(verificationSessionId, status),
    retry: false,
    onSuccess: ({ success, data, message }) => {
      if (success && data) {
        dispatch(setKycSession(data));
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const statusMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.GET_STATUS],
    mutationFn: () => kycServiceApi.getStatus(),
    retry: false,
    onError: (error: AxiosServerError) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const retryMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.RETRY],
    mutationFn: () => kycServiceApi.retryVerification(),
    retry: false,
    onSuccess: ({ success, data, message }) => {
      if (success && data) {
        dispatch(setKycSession(data));
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.KYC.GET_SESSION],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const restartMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.RESTART],
    mutationFn: () => kycServiceApi.restartSession(),
    retry: false,
    onSuccess: ({ success, data, message }) => {
      if (success && data) {
        dispatch(setKycSession(data));
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.KYC.GET_SESSION],
        });
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      dispatch(clearKycSession());
      toast.error(extractErrorMessage(error));
    },
  });

  return {
    sessionData,
    loadingSession,
    refetchSession,
    startSessionMutation,
    saveNinMutation,
    startDiditMutation,
    reconcileCallbackMutation,
    statusMutation,
    retryMutation,
    restartMutation,
  };
};
