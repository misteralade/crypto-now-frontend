import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query.keys.ts";
import { LOCAL_STORAGE_KEYS } from "../util/constants.util.ts";
import { userServiceApi } from "../api/user.api.ts";

export const useOnboardingQuery = () => {
  const { data: onboardingStatus, isLoading: loadingOnboardingStatus, refetch: refetchOnboardingStatus } = useQuery({
    queryKey: [QUERY_KEYS.USER.ONBOARDING_STATUS, localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)],
    queryFn: async () => {
      const { data, success, message } = await userServiceApi.getOnboardingStatus();

      if (!success) {
        throw new Error(message || "Failed to fetch onboarding status");
      }

      return data;
    },
    enabled: !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
    staleTime: 0,
  });

  return {
    onboardingStatus,
    loadingOnboardingStatus,
    refetchOnboardingStatus,
  };
};
