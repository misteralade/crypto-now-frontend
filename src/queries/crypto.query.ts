import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {cryptoServiceApi} from "../api/crypto.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {type RootState, store} from "../store.ts";
import {toast} from "react-toastify";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.util.ts";
import {useMatchRoute, useSearch} from "@tanstack/react-router";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {extractErrorMessage} from "../util/index.util.ts";

export const useCryptoQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const searchParams: { option?: string } = useSearch({ strict: false });
  const isBuyTransaction = searchParams?.option?.toLowerCase() !== 'sell';

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
    queryKey: [QUERY_KEYS.CRYPTO.GET_USER_CRYPTO_WALLETS],
    queryFn: async () => {
      const rootState = store.getState() as RootState;
      const selectedCryptoId = rootState.crypto.tradeCrypto.selectedCryptoId || "";
      const userEmail = rootState.user.trade.anonymous.email;

      if (!selectedCryptoId) {
        return null;
      }

      if (userEmail) {
        const { data, success } = await cryptoServiceApi.getAnonymousUserCryptoWallets(selectedCryptoId, userEmail);
        
        if (success) {
          return data;
        }
        
        return [];
      }
      
      const { data, success } = await cryptoServiceApi.getUserCryptoWallets(selectedCryptoId);

      if (success) {
        return data;
      }

      return [];
    },
    // Only needed for BUY (wallet address autosuggest) — disable on sell to avoid unnecessary polling
    enabled: isBuyTransaction && !!(store.getState() as RootState).crypto.tradeCrypto.selectedCryptoId && (!!matchRoute({ to: ROUTES.DASHBOARD_TRADE }) || !!matchRoute({ to: ROUTES.TRADE_CRYPTO })),
    refetchInterval: false,
  });
  
  const { data: allUserCryptoWallets, isLoading: loadingAllUserCryptoWallets } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS, (store.getState() as RootState).crypto.tradeCrypto.selectedCryptoId],
    queryFn: async () => {
      const { data, success } = await cryptoServiceApi.getAllUserCryptoWallets();

      if (success) {
        return data;
      }

      return [];
    },
    enabled: !!matchRoute({ to: ROUTES.PROFILE }),
  });

  const createUserCryptoWalletMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET],
    mutationFn: async (overridePayload?: Record<string, any>) => {
      const rootState = store.getState() as RootState;
      const rawPayload = overridePayload ?? rootState.crypto.tradeCrypto.userCreateCrypto;
      const userEmail = rootState.user.trade.anonymous.email;

      if (!rootState.crypto.tradeCrypto.selectedCryptoId) {
        toast.error("Please select a crypto", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
        throw new Error("No crypto selected");
      }

      // Strip null walletLabel — backend schema expects string | undefined, not null
      const { walletLabel, ...rest } = rawPayload as Record<string, any>;
      const createCryptoPayload = walletLabel != null ? { ...rest, walletLabel } : rest;

      if (userEmail) {
        return cryptoServiceApi.anonymousUserCreateCryptoWallet(rootState.crypto.tradeCrypto.selectedCryptoId, {
          ...createCryptoPayload,
          email: userEmail,
        });
      }

      return cryptoServiceApi.userCreateCryptoWallet(rootState.crypto.tradeCrypto.selectedCryptoId, createCryptoPayload);
    },
    onSuccess: ( { success, message }) => {
      if (success) {
        // No success message - silently proceed
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS, QUERY_KEYS.CRYPTO.GET_USER_CRYPTO_WALLETS]
        });
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      const message = extractErrorMessage(error) || 'Failed to create crypto wallet. Please try again."'
      toast.error(message);
    },
  });
  
  const createUserWalletMutation = useMutation(({
    mutationKey: [QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET],
    mutationFn: async () => {
      toast.loading("Creating crypto wallet...", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
      const rootState = store.getState() as RootState;
      
      const payload = rootState.crypto.profile.createWallet;
      const cryptoId = payload.cryptoId || '';
      return await cryptoServiceApi.userCreateCryptoWallet(cryptoId, payload);
    },
    onSuccess: ( { success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        const rootState = store.getState() as RootState;
        const selectedCryptoId = rootState.crypto.tradeCrypto.selectedCryptoId;
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS, selectedCryptoId],
        });
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || 'Failed to create crypto wallet. Please try again."'
      toast.error(message);
    },
  }));
  
  const makeWalletPrimaryMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.USER_MAKE_WALLET_PRIMARY],
    mutationFn: async () => {
      toast.loading("Making wallet primary...")
      const rootState = store.getState() as RootState;
      const id = rootState.crypto.profile.update.walletId;
      
      return await cryptoServiceApi.userMakeWalletPrimary(id || '');
    },
    onSuccess: ( { success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        const rootState = store.getState() as RootState;
        const selectedCryptoId = rootState.crypto.tradeCrypto.selectedCryptoId;
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS, selectedCryptoId],
        });
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || 'Failed to make primary wallet'
      toast.error(message);
    },
  });
  
  const deleteUserWalletMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.DELETE_WALLET],
    mutationFn: async () => {
      // Loading message should match the delete action to avoid confusion.
      toast.loading("Deleting wallet...")
      const rootState = store.getState() as RootState;
      const id = rootState.crypto.profile.update.walletId;
      
      return await cryptoServiceApi.userDeleteCryptoWallet(id || '');
    },
    onSuccess: ( { success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS]
        });
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const message = extractErrorMessage(error) || 'Failed to delete wallet'
      toast.error(message);
    },
  });

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
    userCryptoWallets,
    loadingUserCryptoWallets,
    allUserCryptoWallets,
    loadingAllUserCryptoWallets,
    custodialWallets,
    loadingCustodialWallets,
    refetchCustodialWallets,

    // Mutations
    createUserCryptoWalletMutation,
    createUserWalletMutation,
    makeWalletPrimaryMutation,
    deleteUserWalletMutation,
    generateCustodialWalletMutation,
    generateAllCustodialWalletsMutation,
  };
};
