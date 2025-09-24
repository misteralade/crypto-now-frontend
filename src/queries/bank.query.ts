import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {bankServiceApi} from "../api/bank.api.ts";
import {toast} from "react-toastify";
import {type RootState, store} from "../store.ts";

export const useBankQuery = () => {
  const queryClient = useQueryClient();

  const { data: allBanks, isLoading: loadingAllBanks } = useQuery({
    queryKey: [QUERY_KEYS.BANK.ALL_BANKS],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.getAllBanks();

      if (success) {
        return data;
      }

      return [];
    }
  });

  const { data: userBankAccounts, isLoading: loadingUserBankAccounts } = useQuery({
    queryKey: [QUERY_KEYS.BANK.USER_BANK_ACCOUNTS],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.getUserBankAccounts();

      if (success) {
        return data;
      }

      return [];
    },
  });

  const createUserBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT],
    mutationFn: async () => {
      toast.loading(`Creating bank account...`, { toastId: QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT });
      const rootState = store.getState() as RootState;
      const bank = rootState.bank;

      if (!bank.createBankAccount.bankId || !bank.createBankAccount.accountName || !bank.createBankAccount.accountNumber) {
        toast.error("Please select a bank", { toastId: QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT });
        throw new Error("No bank selected");
      }

      const payload = {
        bankId: bank.createBankAccount.bankId,
        accountHolderName: bank.createBankAccount.accountName,
        accountNumber: bank.createBankAccount.accountNumber,
      }

      return bankServiceApi.createUserBankAccount(payload);
    },
    onSuccess: () => {
      // Invalidate and refetch user bank accounts after mutation
      toast.dismiss(QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT);
      toast.success("Account created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BANK.USER_BANK_ACCOUNTS]
      });
    },
    onError: () => {
      toast.dismiss(QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT);
      toast.error("Failed to create bank account. Please try again.", { toastId: QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT });
    }
  });

  return {
    // Values
    allBanks,
    loadingAllBanks,
    userBankAccounts,


    // Functions
    createUserBankAccountMutation,
    loadingUserBankAccounts,
  };
};
