import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {cryptoServiceApi} from "../api/crypto.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {type RootState, store} from "../store.ts";
import {toast} from "react-toastify";
import {SESSION_STORAGE_KEYS} from "../util/constants.ts";

export const useCryptoQuery = () => {
  const queryClient = useQueryClient();

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

  const { data: userCryptoWallets, isLoading: loadingUserCryptoWallets } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.GET_USER_CRYPTO_WALLETS, (store.getState() as RootState).crypto.tradeCrypto.selectedCryptoId],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const selectedCryptoId = rootState.crypto.tradeCrypto.selectedCryptoId || "";

      const { data, success } = await cryptoServiceApi.getUserCryptoWallets(selectedCryptoId);

      if (success) {
        return data;
      }

      return [];
    },
    enabled: !!(store.getState() as RootState).crypto.tradeCrypto.selectedCryptoId && !!sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID), // Only run this query if selectedCryptoId and userId are available
  });

  const createUserCryptoWalletMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET],
    mutationFn: async () => {
      toast.loading("Creating crypto wallet...", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
      const rootState = store.getState() as RootState;
      const createCryptoPayload = rootState.crypto.tradeCrypto.userCreateCrypto;

      if (!rootState.crypto.tradeCrypto.selectedCryptoId) {
        toast.error("Please select a crypto", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
        throw new Error("No crypto selected");
      }

      return cryptoServiceApi.userCreateCryptoWallet(rootState.crypto.tradeCrypto.selectedCryptoId, createCryptoPayload);
    },
    onSuccess: () => {
      // Invalidate and refetch user crypto wallets after mutation
      toast.dismiss(QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET);
      toast.success("Crypto wallet created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CRYPTO.GET_USER_CRYPTO_WALLETS]
      });
    },
    onError: () => {
      toast.dismiss(QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET);
      toast.error("Failed to create crypto wallet. Please try again.", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
    }
  })

  return {
    // Values
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,
    supportedCrypto,
    loadingSupportedCrypto,
    userCryptoWallets,
    loadingUserCryptoWallets,

    // Mutations
    createUserCryptoWalletMutation,
  };
};
