import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query.keys.ts";
import { getAccessToken } from "../util/auth-session.util.ts";
import { userServiceApi } from "../api/user.api.ts";

export const useOnboardingQuery = () => {
  const { data: onboardingStatus, isLoading: loadingOnboardingStatus, refetch: refetchOnboardingStatus } = useQuery({
    queryKey: [QUERY_KEYS.USER.ONBOARDING_STATUS, getAccessToken()],
    queryFn: async () => {
      const { data, success, message } = await userServiceApi.getOnboardingStatus();

      if (!success) {
        throw new Error(message || "Failed to fetch onboarding status");
      }

      return data;
    },
    enabled: !!getAccessToken(),
    staleTime: 0,
  });

  return {
    onboardingStatus,
    loadingOnboardingStatus,
    refetchOnboardingStatus,
  };
};
