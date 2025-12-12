import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {exchangeRateServiceApi} from "../api/rate.api.ts";

export const useRateQuery = (cryptoId: string, currencyId: string, action: 'BUY' | 'SELL', enabled: boolean = true, disableRefetch: boolean = false) => {
  const { data: exchangeRate, isLoading: loadingExchangeRate } = useQuery({
    queryKey: [QUERY_KEYS.EXCHANGE_RATE.GET_CRYPTO_TO_CURRENCY_EXCHANGE_RATE, cryptoId, currencyId, action],
    queryFn: async () => {
      const { data } = await exchangeRateServiceApi.getExchangeRate(cryptoId, currencyId, action);

      return data;
    },
    enabled: enabled && !!cryptoId && !!currencyId && !!action,
    refetchOnWindowFocus: enabled && !disableRefetch, // Only refetch on window focus if enabled and not disabled
    refetchOnMount: enabled && !disableRefetch, // Only refetch on mount if enabled and not disabled
    staleTime: disableRefetch ? Infinity : undefined, // Prevent refetching when disabled
  });

  return {
    // Values
    exchangeRate,
    loadingExchangeRate,


    // Functions
  };
};
