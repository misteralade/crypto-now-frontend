import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query.keys.ts";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";
import { userServiceApi } from "../api/user.api.ts";
import { useMatchRoute } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { setIsAnonymousUser } from "../redux/user.slice.ts";
import { type RootState, store } from "../store.ts";
import { toast } from "react-toastify";
import type { AxiosServerError } from "../types/response.payload.types.ts";
import { extractErrorMessage } from "../util/index.util.ts";

export const useUserQuery = () => {
  const matchRoute = useMatchRoute();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
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
      return { success, message };
    },
    // refetchInterval: 30_000, // ⏱ 30 seconds (in ms)
    refetchInterval: 100000,
    refetchIntervalInBackground: true, // ✅ keeps pinging even when tab is inactive
    refetchOnWindowFocus: false,
    enabled: !!matchRoute({ to: ROUTES.TRADE_CRYPTO }) || !!matchRoute({ to: ROUTES.HOMEPAGE }) || !!matchRoute({ to: ROUTES.PROFILE })
  });
  
  const updateProfileMutation = useMutation({
    mutationKey: [QUERY_KEYS.USER.UPDATE_USER_PROFILE],
    mutationFn: async () => {
      toast.loading(`Updating profile...`)
      const rootState = store.getState() as RootState;
      const payload = rootState.user.profile.personalInfo;
      
      return await userServiceApi.updateUserProfile(payload);
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.GET_PROFILE] });
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to update profile. Please try again."
      toast.error(message);
    },
  });
  
  const contactUsMutation = useMutation({
    mutationFn: async () => {
      toast.loading(`Sending Message...`)
      const rootState = store.getState() as RootState;
      const payload = rootState.user.contactUs;
      
      return await userServiceApi.contactUsMessage(payload);
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to send message. Please try again."
      toast.error(message);
    },
  })

  return {
    userProfileData,
    loadingUserProfile,
    
    // Mutation Function
    updateProfileMutation,
    contactUsMutation,
  }
}