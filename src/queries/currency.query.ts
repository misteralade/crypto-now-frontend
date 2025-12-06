import {useQuery} from "@tanstack/react-query";
import {currencyServiceApi} from "../api/currency.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";

export const useCurrencyQuery = () => {
  const { data: supportedCurrencies, isLoading: loadingSupportedCurrencies } = useQuery({
    queryKey: [QUERY_KEYS.CURRENCY.SUPPORTED_CURRENCY],
    queryFn: async () => {
      const { data, success } = await currencyServiceApi.getSupportedCurrency();

      if (success) {
        return data;
      }

      return [];
    }
  });

  return {
    // Values
    supportedCurrencies,
    loadingSupportedCurrencies,


    // Functions
  };
};
