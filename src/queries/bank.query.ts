import {useMutation, useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {bankServiceApi} from "../api/bank.api.ts";

export const useBankQuery = () => {
  const { data: allBanks, isLoading: loadingAllBanks } = useQuery({
    queryKey: [QUERY_KEYS.CURRENCY.SUPPORTED_CURRENCY],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.getAllBanks();

      if (success) {
        return data;
      }

      return [];
    }
  });

  const createUserBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.CREATE_USER_BANK_ACCOUNT],
    mutationFn: async ()
  })

  return {
    // Values
    allBanks,
    loadingAllBanks,


    // Functions
  };
};
