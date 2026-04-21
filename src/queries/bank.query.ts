import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {bankServiceApi} from "../api/bank.api.ts";
import {toast} from "react-toastify";
import {type RootState, store} from "../store.ts";
import {ROUTES} from "../util/constants.util.ts";
import {useMatchRoute} from "@tanstack/react-router";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {extractErrorMessage} from "../util/index.util.ts";

export const useBankQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();

  const { data: allBanks, isLoading: loadingAllBanks } = useQuery({
    queryKey: [QUERY_KEYS.BANK.ALL_BANKS],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.getAllBanks();
      
      if (success) {
        return data;
      }

      return [];
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours — bank list rarely changes
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: userBankAccounts, isLoading: loadingUserBankAccounts } = useQuery({
    queryKey: [QUERY_KEYS.BANK.USER_BANK_ACCOUNTS],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const userEmail = rootState.user.trade.anonymous.email;
      const isAnonymous = rootState.user.trade.anonymous.isAnonymousUser;
      
      if (userEmail && isAnonymous) {
        const { data, success } = await bankServiceApi.getAnonymousUserBankAccounts(userEmail);

        if (success) {
          return data;
        }

        return [];
      }
      
      const { data, success } = await bankServiceApi.getUserBankAccounts();

      if (success) {
        return data;
      }

      return [];
    },
    enabled: !!(matchRoute({ to: ROUTES.PROFILE }) || matchRoute({ to: ROUTES.TRADE_CRYPTO }) || matchRoute({ to: ROUTES.DASHBOARD_TRADE }) || matchRoute({ to: ROUTES.DASHBOARD_WALLETS })),
    staleTime: 1000 * 60 * 5, // 5 minutes — bank accounts don't change often
  });

  const createUserBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT],
    mutationFn: async () => {
      toast.loading(`Creating bank account...`, { toastId: QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT });
      const rootState = store.getState() as RootState;
      const userEmail = rootState.user.trade.anonymous.email;
      const isAnonymous = rootState.user.trade.anonymous.isAnonymousUser;
      const bank = rootState.bank;

      if (!bank.createBankAccount.bankId || !bank.createBankAccount.accountName || !bank.createBankAccount.accountNumber) {
        toast.error("Please select a bank", { toastId: QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT });
        throw new Error("No bank selected");
      }

      const payload = {
        bankId: bank.createBankAccount.bankId,
        accountHolderName: bank.createBankAccount.accountName,
        accountNumber: bank.createBankAccount.accountNumber,
        isDefault: bank.createBankAccount.isDefault,
      }
      
      if (userEmail && isAnonymous) {
        return bankServiceApi.createAnonymousUserBankAccount({...payload, email: userEmail});
      }

      return bankServiceApi.createUserBankAccount(payload);
    },
    onSuccess: ({ success, message}) => {
      // Invalidate and refetch user bank accounts after mutation
      if (success) {
        toast.dismiss(QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT);
        toast.success(message || 'Account created successfully.');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.BANK.USER_BANK_ACCOUNTS]
        });
      }
      
      return { success, message };
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || "Failed to create bank account. Please try again."
      toast.error(message);
    },
  });
  
  const updateDefaultBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.UPDATE_DEFAULT_BANK_ACCOUNT],
    mutationFn: async () => {
      toast.loading(`Making bank account a default...`)
      const rootState = store.getState() as RootState;
      const id = rootState.bank.update.selectedBankAccountId;
      
      if (!id) {
        throw new Error(`No bank selected`)
      }
      
      return await bankServiceApi.makeBankAccountDefault(id);
    },
    onSuccess: ({ success, message}) => {
      // Invalidate and refetch user bank accounts after mutation
      if (success) {
        toast.dismiss();
        toast.success(message || 'Default bank account updated successfully.');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.BANK.USER_BANK_ACCOUNTS]
        });
      }
      
      return { success, message };
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || 'Failed to update bank account default. Please try again.'
      toast.error(message);
    },
  });
  
  const deleteBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.UPDATE_DEFAULT_BANK_ACCOUNT],
    mutationFn: async () => {
      toast.loading(`Deleting bank account...`)
      const rootState = store.getState() as RootState;
      const id = rootState.bank.update.selectedBankAccountId;
      
      if (!id) {
        throw new Error(`No bank selected`)
      }
      
      return await bankServiceApi.deleteBankAccount(id);
    },
    onSuccess: ({ success, message}) => {
      // Invalidate and refetch user bank accounts after mutation
      toast.dismiss();
      if (success) {
        toast.success(message || 'Bank account successfully deleted.');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.BANK.USER_BANK_ACCOUNTS]
        });
      } else {
        toast.error(message)
      }
      
      return { success, message };
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || 'Failed to delete bank account. Please try again.'
      toast.error(message);
    },
  });

  return {
    // Values
    allBanks,
    loadingAllBanks,
    userBankAccounts,


    // Functions
    createUserBankAccountMutation,
    loadingUserBankAccounts,
    updateDefaultBankAccountMutation,
    deleteBankAccountMutation,
  };
};
