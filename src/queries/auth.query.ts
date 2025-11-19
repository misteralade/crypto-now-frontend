import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authServiceApi} from "../api/auth.api.ts";
import {useState} from "react";
import {toast} from "react-toastify";
import {ROUTES} from "../util/constants.util.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {type RootState, store} from "../store.ts";
import {extractErrorMessage} from "../util/index.util.ts";

export const useAuthQuery = () => {
  const queryClient = useQueryClient();
  
  const [loggingInLoading, setLoggingInLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      toast.loading("Logging in...");
      setLoggingInLoading(true);
      return await authServiceApi.login(data);
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      toast.success("Login successfully.");
      setLoggingInLoading(false);
      if (success) {
        toast.success(message);
        setTimeout(() => {
          window.location.href = ROUTES.DASHBOARD;
        }, 3000);
      } else {
        toast.error(message || "Login failed");
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      setLoggingInLoading(false);
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to initiate password change'
      toast.error(message);
    },
  });
  
  const userCreateAccountMutation = useMutation({
    mutationFn: async () => {
      toast.loading(`Signing up...`)
      const rootState = store.getState() as RootState;
      const payload = rootState.user.createUser;
      
      return await authServiceApi.signup(payload);
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
      const message = extractErrorMessage(error)
      toast.error(message || 'Failed to create new account');
    },
  })
  
  const userRequestPasswordChangeMutation = useMutation({
    mutationFn: async () => {
      toast.loading(`Request password update...`);
      return await authServiceApi.changePassword();
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
      } else {
        toast.error(message || "Failed to change password");
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to initiate password change'
      toast.error(message);
    },
  });
  
  const userToggleTwoFactorAuthenticationMutation = useMutation({
    mutationFn: async () => {
      toast.loading(`Updating Two-Factor authentication...`);
      return await authServiceApi.toggleTwoFactorAuthentication();
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.GET_PROFILE] });
      } else {
        toast.error(message || "Failed to update Two-Factor authentication");
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to update Two-Factor authentication'
      toast.error(message);
    },
  });
  
  const verifyCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      toast.loading(`Updating Two-Factor authentication...`);
      return await authServiceApi.verifyTwoFactorAuthenticationCode(code);
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.GET_PROFILE] });
      } else {
        toast.error(message || "Failed to verify your code");
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to verify your code'
      toast.error(message);
    },
  })

  return {
    // Values
    loggingInLoading,

    // Functions
    loginMutation,
    userRequestPasswordChangeMutation,
    userToggleTwoFactorAuthenticationMutation,
    verifyCodeMutation,
    userCreateAccountMutation,
  };
};
