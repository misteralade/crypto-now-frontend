import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {cryptoServiceApi} from "../api/crypto.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {type RootState, store} from "../store.ts";
import {toast} from "react-toastify";
import {LOCAL_STORAGE_KEYS} from "../util/constants.util.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {extractErrorMessage} from "../util/index.util.ts";

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

  // Fetch authenticated user's custodial wallets (deposit addresses)
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  const { data: custodialWallets, isLoading: loadingCustodialWallets, refetch: refetchCustodialWallets } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.GET_CUSTODIAL_WALLETS],
    queryFn: async () => {
      const { data, success } = await cryptoServiceApi.getMyCustodialWallets();
      if (success) return data;
      return [];
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  // Generate a custodial wallet for a specific crypto + network on demand
  const generateCustodialWalletMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.GENERATE_CUSTODIAL_WALLET],
    mutationFn: async ({ cryptoId, network }: { cryptoId: string; network: string }) => {
      return await cryptoServiceApi.generateCustodialWallet(cryptoId, network);
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CRYPTO.GET_CUSTODIAL_WALLETS] });
      } else {
        toast.error(message);
      }
    },
    onError: (error: AxiosServerError) => {
      const message = extractErrorMessage(error) || 'Failed to generate deposit wallet. Please try again.';
      toast.error(message);
    },
  });

  // Generate all missing custodial wallets at once (called after registration)
  const generateAllCustodialWalletsMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.GENERATE_ALL_CUSTODIAL_WALLETS],
    mutationFn: async () => {
      return await cryptoServiceApi.generateAllCustodialWallets();
    },
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CRYPTO.GET_CUSTODIAL_WALLETS] });
      }
    },
    onError: (error: AxiosServerError) => {
      const message = extractErrorMessage(error) || 'Failed to generate wallets.';
      toast.error(message);
    },
  });

  return {
    // Values
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,
    supportedCrypto,
    loadingSupportedCrypto,
    custodialWallets,
    loadingCustodialWallets,
    refetchCustodialWallets,

    // Mutations
    generateCustodialWalletMutation,
    generateAllCustodialWalletsMutation,
  };
};
