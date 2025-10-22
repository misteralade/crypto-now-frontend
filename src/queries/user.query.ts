import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.ts";
import {userServiceApi} from "../api/user.api.ts";
import { useMatchRoute } from "@tanstack/react-router";
import {useDispatch} from "react-redux";
import { setIsAnonymousUser } from "../redux/user.slice.ts";

export const useUserQuery = () => {
  const matchRoute = useMatchRoute();
  const dispatch = useDispatch();
  
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
  
  useQuery({
    queryKey: [QUERY_KEYS.USER.PING],
    queryFn: async () => {
      const { success, message} = await userServiceApi.pingUser()

      if (!success) {
        dispatch(setIsAnonymousUser(true));
        throw new Error(message || "Failed to ping user");
      }

      dispatch(setIsAnonymousUser(false));
    },
    // refetchInterval: 30_000, // ⏱ 30 seconds (in ms)
    refetchInterval: 100000,
    refetchIntervalInBackground: true, // ✅ keeps pinging even when tab is inactive
    refetchOnWindowFocus: false,
    enabled: !!matchRoute({ to: ROUTES.TRADE_CRYPTO })
  });

  return {
    userProfileData,
    loadingUserProfile,
  }
}