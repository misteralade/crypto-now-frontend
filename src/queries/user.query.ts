import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {LOCAL_STORAGE_KEYS} from "../util/constants.ts";
import {userServiceApi} from "../api/user.api.ts";

export const useUserQuery = () => {
  const { data: userProfileData, isLoading: loadingUserProfile } = useQuery({
    queryKey: [QUERY_KEYS.USER.GET_PROFILE, localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)],
    queryFn: async () => {
      const { data, success, message} = await userServiceApi.getUserProfile()

      if (!success) {
        throw new Error(message || "Failed to fetch user profile");
      }

      return data;
    },
    enabled: !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
  })

  return {
    userProfileData,
    loadingUserProfile,
  }
}