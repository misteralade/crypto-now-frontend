import {useQuery} from "@tanstack/react-query";
import {cryptoServiceApi} from "../api/crypto.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {type RootState, store} from "../store.ts";
import {toast} from "react-toastify";

export const useCryptoQuery = () => {
  const { data: supportedCryptoCurrencies, isLoading: loadingSupportedCryptocurrencies } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.SUPPORTED_CRYPTO],
    queryFn: async () => {
      const { data, success } = await cryptoServiceApi.getSupportedCrypto();

      if (success) {
        return data;
      }

      return [];
    }
  });

  const { data: supportedCrypto, isLoading: loadingSupportedCrypto } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.GET_SUPPORTED_CRYPTO_BY_ID],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const crypto = rootState.crypto;

      if (!crypto.tradeCrypto.selectedCryptoId) {
        toast.error("Please select a crypto");
        return;
      }

      const { data, success } = await cryptoServiceApi.getSupportedCryptoById(crypto.tradeCrypto.selectedCryptoId);

      if (success) {
        return data;
      } else {
        throw new Error("Failed to fetch crypto by ID");
      }
    },
    enabled: !!(store.getState() as RootState).crypto.tradeCrypto.selectedCryptoId, // Only run this query if selectedCryptoId is available
  })

  return {
    // Values
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,


    supportedCrypto,
    loadingSupportedCrypto,

    // Functions
  };
};
