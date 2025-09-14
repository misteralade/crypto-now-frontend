import {useQuery} from "@tanstack/react-query";
import {cryptoServiceApi} from "../api/crypto.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";

export const useCryptoQuery = () => {
  const { data: supportedCryptoCurrencies, isLoading: loadingSupportedCrypto } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.SUPPORTED_CRYPTO],
    queryFn: async () => {
      const { data, success } = await cryptoServiceApi.getSupportedCrypto();

      if (success) {
        return data;
      }

      return [];
    }
  });

  return {
    // Values
    supportedCryptoCurrencies,
    loadingSupportedCrypto,


    // Functions
  };
};
