import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {cryptoServiceApi} from "../api/crypto.api.ts";
import {QUERY_KEYS} from "./query.keys.ts";
import {type RootState, store} from "../store.ts";
import {toast} from "react-toastify";
import {ROUTES, SESSION_STORAGE_KEYS} from "../util/constants.util.ts";
import {useMatchRoute} from "@tanstack/react-router";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {extractErrorMessage} from "../util/index.util.ts";

export const useCryptoQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();

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
    enabled: !!(store.getState() as RootState).crypto.tradeCrypto.selectedCryptoId && !!sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID) && !!matchRoute({ to: ROUTES.TRADE_CRYPTO }), // Only run this query if selectedCryptoId and userId are available
    refetchInterval: 2000, // refetch every 2 seconds to get real-time updates
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
    enabled: !!matchRoute({ to: ROUTES.PROFILE })
  });

  const createUserCryptoWalletMutation = useMutation({
    mutationKey: [QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET],
    mutationFn: async () => {
      toast.loading("Creating crypto wallet...", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
      const rootState = store.getState() as RootState;
      const createCryptoPayload = rootState.crypto.tradeCrypto.userCreateCrypto;
      const userEmail = rootState.user.trade.anonymous.email;

      if (!rootState.crypto.tradeCrypto.selectedCryptoId) {
        toast.error("Please select a crypto", { toastId: QUERY_KEYS.CRYPTO.USER_CREATE_CRYPTO_WALLET });
        throw new Error("No crypto selected");
      }
      
      if (userEmail) {
        return cryptoServiceApi.anonymousUserCreateCryptoWallet(rootState.crypto.tradeCrypto.selectedCryptoId, {
          ...createCryptoPayload,
          email: userEmail,
        });
      }

      return cryptoServiceApi.userCreateCryptoWallet(rootState.crypto.tradeCrypto.selectedCryptoId, createCryptoPayload);
    },
    onSuccess: ( { success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS, QUERY_KEYS.CRYPTO.GET_USER_CRYPTO_WALLETS]
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
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS]
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
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CRYPTO.GET_USER_ALL_CRYPTO_WALLETS]
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
      toast.loading("Making wallet primary...")
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

    // Mutations
    createUserCryptoWalletMutation,
    createUserWalletMutation,
    makeWalletPrimaryMutation,
    deleteUserWalletMutation,
  };
};
