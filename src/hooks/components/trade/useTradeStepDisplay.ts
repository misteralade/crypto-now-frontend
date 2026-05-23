import React, { useEffect, useState, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import type {
  TradeAdditionalInfoInterface,
  TradeType,
} from "../../../types/trade.types.ts";
import { useCurrencyQuery } from "../../../queries/currency.query.ts";
import type { CustodialWalletResponse, SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import { useCryptoQuery } from "../../../queries/crypto.query.ts";
import { useRateQuery } from "../../../queries/rate.query.ts";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";
import { QUERY_KEYS } from "../../../queries/query.keys.ts";
import type { InitiateTransactionRequestPayload } from "../../../types/request.payload.types.ts";
import { useBankQuery } from "../../../queries/bank.query.ts";
import { transactionServiceApi } from "../../../api/transaction.api.ts";
import { useQuery } from "@tanstack/react-query";
import {
  setAmountToSend, setInitiateTransactionField,
} from "../../../redux/transaction.slice.ts";
import { setSelectedCryptoId } from "../../../redux/crypto.slice.ts";
import {LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS} from "../../../util/constants.util.ts";
import {
  loadTradeProgress,
  saveTradeProgress,
} from "../../../util/tradeProgress.storage.util.ts";
import {type RootState, store} from "../../../store.ts";
import {clearAnonymousUserEmail, setAnonymousUserEmail, setIsAnonymousUser} from "../../../redux/user.slice.ts";
import { convertToMillify, formatNumber, isExchangeRateExpiryError } from "../../../util/index.util.ts";
import { toast } from "react-toastify";
import { userServiceApi } from "../../../api/user.api.ts";

// Debounce
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
};

// shallow compare helper
const shallowEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (a[k] !== b[k]) return false;
  }
  return true;
};

export const useTradeStepDisplay = ( token: string, activeTab: TradeType, currency: string, setStep: (value: number) => void, _setActiveTab: (value: TradeType) => void, initialAmount?: string, currentStep?: number, sessionId?: string, sellNetwork?: string, skipBuyRateFetch?: boolean ) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const countdownIntervalRef = useRef<any>();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { userBankAccounts, loadingUserBankAccounts } = useBankQuery();
  const { supportedCurrencies } = useCurrencyQuery();
  const { supportedCryptoCurrencies, loadingSupportedCryptocurrencies, custodialWallets, generateCustodialWalletMutation } = useCryptoQuery();
  const { initiateTransactionMutation, makePaymentTransactionMutation, receivingPaymentAccountConfirmationMutation, createAndSubmitTransactionMutation } = useTransactionQuery();
  
  const [transactionSessionId, setTransactionSessionId] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<SupportedCryptoOrCurrencyResponse>();
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCryptoOrCurrencyResponse>();
  const [countdown, setCountdown] = useState<string>("");
  const [transactionForm, setTransactionForm] = useState<InitiateTransactionRequestPayload>();
  const transactionFormRef = useRef<InitiateTransactionRequestPayload | undefined>(undefined);
  
  const [isCountdownLocked, setIsCountdownLocked] = useState(false);
  
  // Only disable rate query on Step 2 when receipt is uploaded
  // On Step 1, always allow rate to load
  // When continuing a transaction, we allow the rate to fetch once, then lock it
  const saved = useMemo(() => loadTradeProgress(), []);
  const isContinuingTransaction = !!sessionId;
  const shouldDisableRateQuery = currentStep === 2 && isCountdownLocked && saved?.receiptUrl;

  // For BUY local-first flow: BuyFields manages its own rate fetch, so skip here entirely
  const isBuyLocalFlow = activeTab.toUpperCase() === "BUY" && !!skipBuyRateFetch;

  // When continuing a transaction, allow rate to fetch once but prevent refetching
  const shouldFetchRate = !shouldDisableRateQuery && !isBuyLocalFlow;
  const shouldDisableRefetch = isContinuingTransaction && currentStep === 2;
  const refreshExchangeRateSilently = async () => {
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.EXCHANGE_RATE.GET_CRYPTO_TO_CURRENCY_EXCHANGE_RATE],
    });
  };
  const { exchangeRate, loadingExchangeRate } = useRateQuery(
    selectedToken?.id || "",
    selectedCurrency?.id || "",
    activeTab.toUpperCase() === "BUY" ? "BUY" : "SELL",
    shouldFetchRate, // Allow fetch when not disabled
    shouldDisableRefetch // Disable refetching when continuing a transaction
  );


  const [numberOfToken, setNumberOfToken] = useState<string | number>("");
  const [amountToBuy, setAmountToBuy] = useState<string | number>(initialAmount || "");
  
  // Track last calculation to prevent circular updates
  const lastCalculationRef = useRef<{from: "numberOfToken" | "amountToBuy", to: "numberOfToken" | "amountToBuy"} | null>(null);
  
  // Track which field is currently focused to prevent calculations while typing
  const focusedFieldRef = useRef<"numberOfToken" | "amountToBuy" | null>(null);

  // Modals
  const [showPaymentReceivingModal, setShowPaymentReceivingModal] = useState(false);
  const [, setShowConfirmBankDetails] = useState<boolean>(false);
  const [showUserEnterEmail, setShowUserEnterEmail] = useState<boolean>(false);
  const [hasAnonymousUserEmail, setHasAnonymousUserEmail] = useState<boolean>(false);

  // Custodial wallet for sell flow (deposit address the user sends crypto to)
  const [sellDepositWallet, setSellDepositWallet] = useState<CustodialWalletResponse | null>(null);

  // Ping user to check authentication status
  const { isLoading: isLoadingPingUser } = useQuery({
    queryKey: [QUERY_KEYS.USER.PING, "trade-step-display"],
    queryFn: async () => {
      try {
        const { success, message } = await userServiceApi.pingUser();

        if (!success) {
          // User is anonymous - this is expected behavior
          dispatch(setIsAnonymousUser(true));
          return { success: false, message, isAnonymous: true };
        }

        // User is authenticated
        dispatch(setIsAnonymousUser(false));
        
        // If user is authenticated, clear any stored anonymous user email
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken) {
          dispatch(clearAnonymousUserEmail());
        }

        return { success, message, isAnonymous: false };
      } catch {
        // If ping fails (e.g., network error), treat as anonymous
        dispatch(setIsAnonymousUser(true));
        return { success: false, message: "Failed to ping user", isAnonymous: true };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Amount to send
  const amountToSend =
    activeTab === "sell" ? Number(numberOfToken) : Number(amountToBuy);
  const debouncedAmountToSend = useDebounce(amountToSend, 500);
  useEffect(() => {
    dispatch(
      setAmountToSend(
        debouncedAmountToSend > 0 ? debouncedAmountToSend : undefined
      )
    );
  }, [debouncedAmountToSend, dispatch]);
  
  // Update the show Enter email modal for anonymous users
  // Only show after ping is complete and user is confirmed as anonymous
  // By default, modal is false - only show when we know user is anonymous after ping
  useEffect(() => {
    // Don't show modal while pinging
    if (isLoadingPingUser) {
      setShowUserEnterEmail(false);
      return;
    }

    // Check access token first - if user has access token, they're authenticated
    const hasAccessToken = !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    
    // If user has access token, they're authenticated - don't show modal
    if (hasAccessToken) {
      setShowUserEnterEmail(false);
      return;
    }

    // After ping completes and no access token, check if user is confirmed as anonymous
    const currentState = store.getState() as RootState;
    const isAnonymous = currentState.user.trade.anonymous.isAnonymousUser;
    const hasEmail = currentState.user.trade.anonymous.email;

    // Only show email modal if user is confirmed as anonymous AND doesn't already have an email
    // (If they have an email, they can manually open it via the "Change email" button)
    if (isAnonymous === true && !hasEmail) {
      setShowUserEnterEmail(true);
    } else {
      // User status is unclear or not anonymous, or already has email - don't auto-show email modal
      setShowUserEnterEmail(false);
    }
  }, [isLoadingPingUser])

  const generationLockRef = useRef<string | null>(null);

  // Resolve custodial deposit wallet for sell flow
  useEffect(() => {
    if (activeTab !== "sell" || !selectedToken) {
      setSellDepositWallet(null);
      return;
    }

    const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!isAuthenticated) return;

    // Ensure a valid network is configured; never fall back to symbol
    if (!selectedToken.networks || selectedToken.networks.length === 0) {
      toast.error(
        `No network is configured for ${selectedToken.symbol}. Please contact support or choose another asset.`
      );
      setSellDepositWallet(null);
      return;
    }

    // Use the caller-selected network if provided, else fall back to first configured network
    const network = (sellNetwork && selectedToken.networks.includes(sellNetwork))
      ? sellNetwork
      : selectedToken.networks[0];

    // Try to find an existing custodial wallet for this crypto + network
    const existing = custodialWallets?.find(
      (w) => w.cryptocurrencyId === selectedToken.id && w.network === network && w.isActive
    );

    if (existing) {
      setSellDepositWallet(existing);
      dispatch(
        setInitiateTransactionField({
          field: "custodialWalletId",
          value: existing.id,
        })
      );
      dispatch(
        setInitiateTransactionField({
          field: "network",
          value: existing.network,
        })
      );
      generationLockRef.current = null; // Clear lock once loaded
    } else {
      const lockKey = `${selectedToken.id}-${network}`;
      if (generationLockRef.current === lockKey || generateCustodialWalletMutation.isPending) {
         return; // Already generating this specific wallet, skip duplicate call
      }
      
      generationLockRef.current = lockKey;
      
      // Clear stale address and generate for the selected network via the HD wallet service
      setSellDepositWallet(null);
      generateCustodialWalletMutation.mutate(
        { cryptoId: selectedToken.id, network },
        {
          onSuccess: ({ success, data }) => {
            if (success && data) {
              setSellDepositWallet(data);
              dispatch(
                setInitiateTransactionField({
                  field: "custodialWalletId",
                  value: data.id,
                })
              );
              dispatch(
                setInitiateTransactionField({
                  field: "network",
                  value: data.network,
                })
              );
            }
          },
          onSettled: () => {
             // Unlock after completion (whether success or fail) so we can retry if needed
             generationLockRef.current = null;
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedToken?.id, custodialWallets, sellNetwork, dispatch]);

  // 🔹 Hydration guard to avoid saving empty defaults on first paint
  const hydratedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // ---------- Restore persisted progress ----------
  useEffect(() => {
    const saved = loadTradeProgress();
    if (!saved) {
      // If there's no saved progress, reset locked state (new transaction)
      setIsCountdownLocked(false);
      hydratedRef.current = true;
      return;
    }

    // On reload, clear session storage values and don't restore locked state
    // This allows rate to be refetched and fresh data to be loaded
    const nav = performance?.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = nav?.type === "reload";
    
    if (isReload) {
      // Clear session storage values on reload
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.YOU_PAY_VALUE);
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.YOU_RECEIVE_VALUE);
      // Don't restore locked state - allow fresh rate fetch
      setIsCountdownLocked(false);
    } else {
      // Only restore locked state if not a reload
      if (saved.isCountdownLocked !== undefined)
        setIsCountdownLocked(saved.isCountdownLocked);
      // Lock countdown if receipt was already uploaded (only if not reload)
      if (saved.receiptUrl && saved.receiptUrl.trim() !== "") {
        setIsCountdownLocked(true);
        setCountdown("Rate Locked");
      }
    }

    // amounts & flags - ensure they're not empty strings or 0
    if (saved.numberOfToken !== undefined && saved.numberOfToken !== "" && Number(saved.numberOfToken) > 0)
      setNumberOfToken(saved.numberOfToken);
    if (saved.amountToBuy !== undefined && saved.amountToBuy !== "" && Number(saved.amountToBuy) > 0) 
      setAmountToBuy(saved.amountToBuy);
    
    // Only restore receipt URL if not a reload (treat reload as fresh start)
    if (!isReload && saved.receiptUrl && saved.receiptUrl.trim() !== "") {
      // Restore receipt URL to Redux state and transaction form
      const receiptPartial: Partial<InitiateTransactionRequestPayload> = {
        receiptUrl: saved.receiptUrl,
      };
      const receiptMerged: InitiateTransactionRequestPayload = {
        ...(transactionFormRef.current || {}),
        ...receiptPartial,
      } as InitiateTransactionRequestPayload;
      transactionFormRef.current = receiptMerged;
      setTransactionForm(receiptMerged);
      dispatch(setInitiateTransactionField({
        field: "receiptUrl",
        value: saved.receiptUrl
      }));
    }
    
    // Restore transaction session ID from saved progress or sessionStorage
    const sessionIdFromStorage = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID);
    if (saved.transactionSessionId) {
      setTransactionSessionId(saved.transactionSessionId);
      // Also ensure it's in sessionStorage
      if (!sessionIdFromStorage) {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, saved.transactionSessionId);
      }
    } else if (sessionIdFromStorage) {
      // If not in saved progress but exists in sessionStorage, restore it
      setTransactionSessionId(sessionIdFromStorage);
      saveTradeProgress({ transactionSessionId: sessionIdFromStorage });
    }
    // Restore transaction hash if exists
    if (saved.transactionHash) {
      const hashPartial: Partial<InitiateTransactionRequestPayload> = {
        transactionHash: saved.transactionHash,
      };
      const hashMerged: InitiateTransactionRequestPayload = {
        ...(transactionFormRef.current || {}),
        ...hashPartial,
      } as InitiateTransactionRequestPayload;
      transactionFormRef.current = hashMerged;
      setTransactionForm(hashMerged);
      dispatch(setInitiateTransactionField({
        field: "transactionHash",
        value: saved.transactionHash
      }));
    }

    // mark hydrated after we push restored state
    // small timeout ensures our "save" effects don't run with pre-hydrate empties
    setTimeout(() => {
      hydratedRef.current = true;
      setIsHydrated(true);
    }, 0);
  }, []);
  
  // Set the fields on the redux store (only if not already set from saved progress)
  useEffect(() => {
    const saved = loadTradeProgress();
    // Only set from URL params if not restored from saved progress
    if (!saved?.selectedCurrencyId && currency) {
      dispatch(setInitiateTransactionField({
        field: "currencyId",
        value: currency,
      }));
    }
    if (!saved?.selectedTokenId && token) {
      dispatch(setInitiateTransactionField({
        field: "tokenId",
        value: token,
      }));
    }
    // Always set action based on activeTab
    dispatch(setInitiateTransactionField({
      field: "action",
      value: activeTab,
    }));
  }, [currency, token, activeTab, dispatch]);

  // If user has anonymous user email, show enter email modal
  useEffect(() => {
    const hasEmail = store.getState().user.trade.anonymous.email;
    if (hasEmail) {
      setHasAnonymousUserEmail(true);
    }
  }, []);

  // Fetch and restore transaction when sessionId is provided
  const { data: restoredTransaction } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.USER_TRANSACTION_DETAILS, sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const { data, success } = await transactionServiceApi.getTransactionDetails(sessionId);
      if (success && data) {
        return data;
      }
      return null;
    },
    enabled: !!sessionId,
  });

  // Track if restoration has already happened for current sessionId to prevent re-restoration
  const hasRestoredRef = useRef<string | null>(null);

  // Restore transaction state when sessionId is provided (only once per sessionId)
  useEffect(() => {
    if (!sessionId || !restoredTransaction) return;
    
    // If already restored for this sessionId, skip
    if (hasRestoredRef.current === sessionId) return;

    const transaction = restoredTransaction;
    
    // Mark as restored for this sessionId to prevent re-restoration
    hasRestoredRef.current = sessionId;
    
    // Set session ID
    setTransactionSessionId(sessionId);
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, sessionId);
    saveTradeProgress({ transactionSessionId: sessionId });

    // Restore token using cryptocurrencyId
    if (transaction.cryptocurrencyId && supportedCryptoCurrencies) {
      const tokenObj = supportedCryptoCurrencies.find(t => t.id === transaction.cryptocurrencyId);
      if (tokenObj) {
        setSelectedToken(tokenObj);
        dispatch(setSelectedCryptoId(tokenObj.id));
        dispatch(setInitiateTransactionField({
          field: "tokenId",
          value: tokenObj.id,
        }));
        saveTradeProgress({ selectedTokenId: tokenObj.id });
      }
    }

    // Restore currency using currency code
    if (transaction.currency && supportedCurrencies) {
      const currencyObj = supportedCurrencies.find(c => c.code === transaction.currency);
      if (currencyObj) {
        setSelectedCurrency(currencyObj);
        dispatch(setInitiateTransactionField({
          field: "currencyId",
          value: currencyObj.id,
        }));
        saveTradeProgress({ selectedCurrencyId: currencyObj.id });
      }
    }

    // Restore amounts
    if (transaction.amountFiat) {
      const fiatAmount = Number(transaction.amountFiat);
      if (fiatAmount > 0) {
        setAmountToBuy(fiatAmount);
        saveTradeProgress({ amountToBuy: fiatAmount });
      }
    }

    if (transaction.amountCrypto) {
      const cryptoAmount = Number(transaction.amountCrypto);
      if (cryptoAmount > 0) {
        setNumberOfToken(cryptoAmount);
        saveTradeProgress({ numberOfToken: cryptoAmount });
      }
    }

    // When continuing a transaction, always lock the exchange rate
    // This ensures the rate doesn't change while the user completes the transaction
    setIsCountdownLocked(true);
    setCountdown("Rate Locked");
    saveTradeProgress({ isCountdownLocked: true });
    
    // Clear any existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Restore receipt URL if exists (check adminPaymentReceiptUrl for receipt)
    if (transaction.adminPaymentReceiptUrl) {
      dispatch(setInitiateTransactionField({
        field: "receiptUrl",
        value: transaction.adminPaymentReceiptUrl,
      }));
      saveTradeProgress({ receiptUrl: transaction.adminPaymentReceiptUrl });
    }

    // Determine step based on transaction status.
    // Ongoing public transactions always resume on step 2, where the UI now
    // decides between action form vs live monitoring based on current status.
    const status = transaction.status;
    if (['INITIATED', 'PENDING', 'AWAITING_PAYMENT', 'PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'AWAITING_CRYPTO', 'CRYPTO_SENT', 'CRYPTO_RECEIVED', 'CRYPTO_CONFIRMED'].includes(status)) {
      setStep(2);
      saveTradeProgress({ step: 2 });
      
      // Only sell transactions in AWAITING_CRYPTO still need the payout-bank
      // confirmation modal on resume. Buy transactions at AWAITING_PAYMENT are
      // already submitted and should go straight into monitoring.
      if (transaction.type === 'SELL' && status === 'AWAITING_CRYPTO') {
        saveTradeProgress({ shouldOpenBankDetailsModal: true });
      }
    }

    // Set active tab based on transaction type
    if (transaction.type) {
      const tradeType = transaction.type.toLowerCase() === 'sell' ? 'sell' : 'buy';
      _setActiveTab(tradeType);
      saveTradeProgress({ activeTab: tradeType });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, restoredTransaction, supportedCryptoCurrencies, supportedCurrencies, dispatch]);

  // Open bank details modal automatically only for resumed sell transactions
  // that are still waiting on payout-account confirmation.
  useEffect(() => {
    if (!sessionId || !restoredTransaction) return;
    
    const saved = loadTradeProgress();
    const status = restoredTransaction.status;
    const shouldOpen = saved?.shouldOpenBankDetailsModal;
    
    if (
      restoredTransaction.type === 'SELL' &&
      status === 'AWAITING_CRYPTO' &&
      shouldOpen &&
      !loadingUserBankAccounts &&
      currentStep === 2
    ) {
      setShowPaymentReceivingModal(true);
      // Clear the flag so it doesn't open again
      saveTradeProgress({ shouldOpenBankDetailsModal: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, restoredTransaction, loadingUserBankAccounts, currentStep, setShowPaymentReceivingModal]);

  // Track when the current exchange rate was received so we can drive a 3-min countdown
  const rateReceivedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (exchangeRate) {
      rateReceivedAtRef.current = Date.now();
    }
  }, [exchangeRate]);

  // Countdown — 3 minutes TTL driven by rateReceivedAtRef
  const RATE_TTL_MS = 3 * 60 * 1000;
  useEffect(() => {
    if (!rateReceivedAtRef.current || isCountdownLocked) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = rateReceivedAtRef.current! + RATE_TTL_MS;
      const diff = target - now;

      if (diff <= 0) {
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
        
        // Don't unlock or refetch if receipt has been uploaded
        const rootState = store.getState() as RootState;
        const hasReceipt = rootState.transaction.initiate.initiateTransaction?.receiptUrl;
        
        if (!hasReceipt) {
          setIsCountdownLocked(false);
          void refreshExchangeRateSilently();
          rateReceivedAtRef.current = Date.now();
        }
        setCountdown("");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
      );
    };

    dispatch(setSelectedCryptoId(selectedToken?.id || ""));
    updateCountdown();
    if (!isCountdownLocked) {
      countdownIntervalRef.current = setInterval(updateCountdown, 1000);
    }
    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [
    exchangeRate,
    isCountdownLocked,
    selectedToken?.id,
    selectedCurrency?.id,
    queryClient,
    dispatch,
  ]);

  // Get the correct rate for calculations based on currency
  // When USD: use usdRate, when NGN: use fiatRate
  const getCalculationRate = (): number | null => {
    if (!exchangeRate) return null;
    if (exchangeRate.currency === "USD" && exchangeRate.usdRate !== undefined) {
      return exchangeRate.usdRate;
    }
    return exchangeRate.fiatRate;
  };

  // Auto-calc opposite field (guarded)
  useEffect(() => {
    // Don't run calculations if we're still hydrating or if countdown is locked
    if (!isHydrated || isCountdownLocked) return;
    
    const calculationRate = getCalculationRate();
    if (!calculationRate || loadingExchangeRate)
      return;

    let nextAmountToBuy = amountToBuy;
    let nextNumberOfToken = numberOfToken;
    let calculationPerformed = false;

    // Determine which field is being edited based on focus
    const isEditingNumberOfToken = focusedFieldRef.current === "numberOfToken";
    const isEditingAmountToBuy = focusedFieldRef.current === "amountToBuy";
    const noFieldFocused = focusedFieldRef.current === null;

    // Forward calculations: from "enter amount" to "You will receive"
    // For SELL: numberOfToken (enter amount) -> amountToBuy (receive)
    // Calculate when user is editing numberOfToken OR when no field is focused (initial/after blur)
    if (
      activeTab === "sell" &&
      numberOfToken !== "" &&
      Number(numberOfToken) > 0 &&
      (isEditingNumberOfToken || (noFieldFocused && lastCalculationRef.current?.from !== "amountToBuy")) &&
      lastCalculationRef.current?.from !== "amountToBuy"
    ) {
      const calculated = (Number(numberOfToken) * calculationRate).toFixed(5);
      // Update the receive field (user is not typing here, so it's safe to format)
      if (calculated !== String(amountToBuy)) {
        nextAmountToBuy = calculated;
        setAmountToBuy(nextAmountToBuy);
        lastCalculationRef.current = { from: "numberOfToken", to: "amountToBuy" };
        calculationPerformed = true;
      }
    }
    // For BUY: amountToBuy (enter amount) -> numberOfToken (receive)
    // Calculate when user is editing amountToBuy OR when no field is focused (initial/after blur)
    if (
      activeTab === "buy" &&
      amountToBuy !== "" &&
      Number(amountToBuy) > 0 &&
      (isEditingAmountToBuy || (noFieldFocused && lastCalculationRef.current?.from !== "numberOfToken")) &&
      lastCalculationRef.current?.from !== "numberOfToken" &&
      !calculationPerformed
    ) {
      const calculated = (Number(amountToBuy) / calculationRate).toFixed(8);
      // Update the receive field (user is not typing here, so it's safe to format)
      if (calculated !== String(numberOfToken)) {
        nextNumberOfToken = calculated;
        setNumberOfToken(nextNumberOfToken);
        lastCalculationRef.current = { from: "amountToBuy", to: "numberOfToken" };
        calculationPerformed = true;
      }
    }

    // Reverse calculations: from "You will receive" to "enter amount"
    // Only run if forward calculation didn't run (prevents circular updates)
    if (!calculationPerformed) {
      // For SELL: amountToBuy (receive) -> numberOfToken (enter amount)
      // Calculate when user is editing amountToBuy OR when no field is focused (initial/after blur)
      if (
        activeTab === "sell" &&
        amountToBuy !== "" &&
        Number(amountToBuy) > 0 &&
        (isEditingAmountToBuy || (noFieldFocused && lastCalculationRef.current?.from !== "numberOfToken")) &&
        lastCalculationRef.current?.from !== "numberOfToken"
      ) {
        const calculated = (Number(amountToBuy) / calculationRate).toFixed(8);
        // Update the enter amount field (user is not typing here, so it's safe to format)
        if (calculated !== String(numberOfToken) && Number(calculated) > 0) {
          nextNumberOfToken = calculated;
          setNumberOfToken(nextNumberOfToken);
          lastCalculationRef.current = { from: "amountToBuy", to: "numberOfToken" };
          calculationPerformed = true;
        }
      }
      // For BUY: numberOfToken (receive) -> amountToBuy (enter amount)
      // Calculate when user is editing numberOfToken OR when no field is focused (initial/after blur)
      if (
        activeTab === "buy" &&
        numberOfToken !== "" &&
        Number(numberOfToken) > 0 &&
        (isEditingNumberOfToken || (noFieldFocused && lastCalculationRef.current?.from !== "amountToBuy")) &&
        lastCalculationRef.current?.from !== "amountToBuy"
      ) {
        const calculated = (Number(numberOfToken) * calculationRate).toFixed(5);
        // Update the enter amount field (user is not typing here, so it's safe to format)
        if (calculated !== String(amountToBuy) && Number(calculated) > 0) {
          nextAmountToBuy = calculated;
          setAmountToBuy(nextAmountToBuy);
          lastCalculationRef.current = { from: "numberOfToken", to: "amountToBuy" };
        }
      }
    }

    const partial: Partial<InitiateTransactionRequestPayload> = {
      amountToReceive:
        activeTab.toUpperCase() === "SELL"
          ? Number(nextAmountToBuy)
          : Number(nextNumberOfToken),
      amountToSend:
        activeTab.toUpperCase() === "SELL"
          ? Number(nextNumberOfToken)
          : Number(nextAmountToBuy),
    };

    const merged: InitiateTransactionRequestPayload = {
      ...(transactionFormRef.current || {}),
      ...partial,
    } as InitiateTransactionRequestPayload;

    if (!shallowEqual(transactionFormRef.current, merged)) {
      transactionFormRef.current = merged;
      setTransactionForm(merged);
      dispatch(setInitiateTransactionField({
        field: "amountToReceive",
        value: partial.amountToReceive
      }));
      dispatch(setInitiateTransactionField({
        field: "amountToSend",
        value: partial.amountToSend
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isHydrated,
    numberOfToken,
    amountToBuy,
    activeTab,
    exchangeRate?.fiatRate,
    exchangeRate?.usdRate,
    exchangeRate?.currency,
    loadingExchangeRate,
    isCountdownLocked,
  ]);

  // Initial selection from route params (or auto-select NGN when no currency param)
  useEffect(() => {
    const foundToken = supportedCryptoCurrencies?.find((c) => c.id === token);
    // If no currency param, default to NGN so the exchange rate query can fire immediately
    const foundCurrency = currency
      ? supportedCurrencies?.find((c) => c.id === currency)
      : supportedCurrencies?.find((c) => c.code === "NGN" || c.symbol === "NGN") ?? supportedCurrencies?.[0];
    setSelectedToken(foundToken);
    setSelectedCurrency(foundCurrency);

    const partial: Partial<InitiateTransactionRequestPayload> = {
      tokenId: foundToken?.id,
      currencyId: foundCurrency?.id,
    };
    const merged: InitiateTransactionRequestPayload = {
      ...(transactionFormRef.current || {}),
      ...partial,
    } as InitiateTransactionRequestPayload;

    if (!shallowEqual(transactionFormRef.current, merged)) {
      transactionFormRef.current = merged;
      setTransactionForm(merged);
    }
  }, [
    supportedCurrencies,
    supportedCryptoCurrencies,
    token,
    currency,
    dispatch,
  ]);

  // Restore selections by saved IDs once lists are ready
  useEffect(() => {
    const saved = loadTradeProgress();
    if (!saved) return;

    if (saved.selectedTokenId && supportedCryptoCurrencies?.length) {
      const found = supportedCryptoCurrencies.find(
        (c) => c.id === saved.selectedTokenId
      );
      if (found) {
        setSelectedToken(found);
        // Restore tokenId to Redux state and transaction form
        dispatch(setInitiateTransactionField({
          field: "tokenId",
          value: found.id
        }));
        const tokenPartial: Partial<InitiateTransactionRequestPayload> = {
          tokenId: found.id,
        };
        const tokenMerged: InitiateTransactionRequestPayload = {
          ...(transactionFormRef.current || {}),
          ...tokenPartial,
        } as InitiateTransactionRequestPayload;
        transactionFormRef.current = tokenMerged;
        setTransactionForm(tokenMerged);
      }
    }
    if (saved.selectedCurrencyId && supportedCurrencies?.length) {
      const found = supportedCurrencies.find(
        (c) => c.id === saved.selectedCurrencyId
      );
      if (found) {
        setSelectedCurrency(found);
        // Restore currencyId to Redux state and transaction form
        dispatch(setInitiateTransactionField({
          field: "currencyId",
          value: found.id
        }));
        const currencyPartial: Partial<InitiateTransactionRequestPayload> = {
          currencyId: found.id,
        };
        const currencyMerged: InitiateTransactionRequestPayload = {
          ...(transactionFormRef.current || {}),
          ...currencyPartial,
        } as InitiateTransactionRequestPayload;
        transactionFormRef.current = currencyMerged;
        setTransactionForm(currencyMerged);
      }
    }

    if (saved.anonymousEmail) {
      dispatch(setAnonymousUserEmail(saved.anonymousEmail));
    }
  }, [supportedCryptoCurrencies, supportedCurrencies, dispatch]);

  // Exchange rate updates (guarded)
  useEffect(() => {
    // Reset calculation tracking when exchange rate changes to allow recalculation
    lastCalculationRef.current = null;

    if (exchangeRate) {
      // Don't unlock countdown if receipt has been uploaded or if continuing a transaction
      const rootState = store.getState() as RootState;
      const hasReceipt = rootState.transaction.initiate.initiateTransaction?.receiptUrl;
      const isContinuing = !!sessionId;
      if (isCountdownLocked && !hasReceipt && !isContinuing) {
        setIsCountdownLocked(false);
      }
    }
  }, [exchangeRate, isCountdownLocked, sessionId]);

  // 🔹 Only clear amounts when the tab ACTUALLY changes (not on mount)
  const prevActiveTabRef = useRef<TradeType>(activeTab);
  useEffect(() => {
    const prev = prevActiveTabRef.current;
    if (prev !== activeTab) {
      setNumberOfToken("");
      setAmountToBuy("");
      setIsCountdownLocked(false);
      lastCalculationRef.current = null;
      prevActiveTabRef.current = activeTab;
    }
    // if same tab, do nothing (prevents clearing after refresh)
  }, [activeTab]);

  const isDebouncing =
    amountToSend !== debouncedAmountToSend && amountToSend > 0;

  const amountToReceive: number = useMemo(() => {
    const calculationRate = getCalculationRate();
    if (calculationRate && amountToSend > 0) {
      return activeTab === "sell"
        ? Number(amountToBuy) || 0
        : Number(numberOfToken) || 0;
    }
    return 0;
  }, [
    exchangeRate?.fiatRate,
    exchangeRate?.usdRate,
    exchangeRate?.currency,
    amountToSend,
    activeTab,
    amountToBuy,
    numberOfToken,
  ]);

  // Format rate display - show NGN rate in parentheses when currency is USD
  const formatRateDisplay = (): string | React.ReactNode => {
    if (loadingExchangeRate) return "Loading...";
    if (!exchangeRate) return "0";
    
    const tokenSymbol = selectedToken?.symbol;
    const currencyCode = selectedCurrency?.code;
    const usdRate = Number(exchangeRate.usdRate ?? 0);
    const fiatRate = Number(exchangeRate.fiatRate ?? 0);
    const platformRate = Number(exchangeRate.platformRate ?? 0);
    
    // Quote equation:
    // NGN rate per 1 crypto = USD market rate per 1 crypto × platform rate (NGN per USD)
    let marketRate = "";
    
    if (usdRate > 0 && fiatRate > 0) {
      marketRate = `1 ${tokenSymbol} = ${convertToMillify(usdRate)} USD (${convertToMillify(fiatRate)} NGN)`;
    } else {
      // Show fiat rate for other currencies
      marketRate = `1 ${tokenSymbol} = ${convertToMillify(fiatRate)} ${currencyCode}`;
    }
    
    // Add platform rate if available - return as ReactNode to allow wrapping on mobile
    if (platformRate > 0) {
      const platformCurrency = exchangeRate.currency === "USD" ? "NGN" : currencyCode;
      const ourRate = `Quote equation: NGN rate = USD rate × platform rate = ${convertToMillify(usdRate)} USD × ${formatNumber(platformRate)} ${platformCurrency}/USD = ${convertToMillify(fiatRate)} ${platformCurrency}`;
      
      return React.createElement(
        'span',
        { className: 'flex flex-col md:flex-row md:items-center gap-1 md:justify-end md:gap-2' },
        React.createElement('span', { className: 'text-black text-end md:text-start' }, marketRate),
        React.createElement('span', { className: 'text-black text-end md:text-start' }, `• ${ourRate}`)
      );
    }
    
    return marketRate;
  };

  const AdditionalInfo: TradeAdditionalInfoInterface[] = [
    {
      title: "Rate",
      value: formatRateDisplay(),
    },
    {
      title: "Valid until",
      value: loadingExchangeRate
        ? "Loading..."
        : isCountdownLocked
          ? "Rate Locked"
          : countdown || "Loading...",
    },
  ];

  const handleReceiptUrl = (url: string) => {
    const partial: Partial<InitiateTransactionRequestPayload> = {
      receiptUrl: url,
    };
    const merged: InitiateTransactionRequestPayload = {
      ...(transactionFormRef.current || {}),
      ...partial,
    } as InitiateTransactionRequestPayload;

    if (!shallowEqual(transactionFormRef.current, merged)) {
      transactionFormRef.current = merged;
      setTransactionForm(merged);
      dispatch(setInitiateTransactionField({
        field: "receiptUrl",
        value: url
      }));
    }
    
    // Lock the exchange rate when receipt is uploaded (non-empty URL)
    if (url && url.trim() !== "") {
      // Clear the countdown interval immediately
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setIsCountdownLocked(true);
      setCountdown("Rate Locked");
      
      // Ensure amounts are saved when receipt is uploaded
      // This ensures they persist correctly after refresh
      saveTradeProgress({ 
        receiptUrl: url,
        isCountdownLocked: true,
        numberOfToken,
        amountToBuy
      });
      
      // Store formatted "You pay" and "You receive" values in session storage
      if (numberOfToken && amountToBuy && selectedToken && selectedCurrency) {
        const numToken = Number(numberOfToken);
        const numAmount = Number(amountToBuy);
        
        if (!isNaN(numToken) && !isNaN(numAmount) && numToken > 0 && numAmount > 0) {
          // Format "You pay" value - convert ReactNode to string if needed
          const youPayFormatted = formatSendAmount 
            ? formatSendAmount(activeTab.toUpperCase() === "SELL" ? numToken : numAmount, activeTab.toUpperCase() === "SELL" ? selectedToken?.symbol : selectedCurrency?.code)
            : activeTab.toUpperCase() === "SELL" 
              ? `${numToken} ${selectedToken?.symbol}`
              : `${numAmount} ${selectedCurrency?.code}`;
          
          // Format "You receive" value - convert ReactNode to string if needed
          const youReceiveFormatted = formatReceiveAmount
            ? formatReceiveAmount(activeTab.toUpperCase() === "SELL" ? numAmount : numToken, activeTab.toUpperCase() === "SELL" ? selectedCurrency?.code : selectedToken?.symbol)
            : activeTab.toUpperCase() === "SELL"
              ? `${numAmount} ${selectedCurrency?.code}`
              : `${numToken} ${selectedToken?.symbol}`;
          
          // Convert to string for storage (ReactNode can't be stored directly)
          // Extract text content from ReactNode if it's an object
          let youPayString: string;
          let youReceiveString: string;
          
          if (typeof youPayFormatted === 'string') {
            youPayString = youPayFormatted;
          } else if (React.isValidElement(youPayFormatted)) {
            // If it's a React element, extract text from children
            const extractText = (node: any): string => {
              if (typeof node === 'string') return node;
              if (typeof node === 'number') return String(node);
              if (Array.isArray(node)) return node.map(extractText).join('');
              if (node?.props?.children) return extractText(node.props.children);
              return '';
            };
            youPayString = extractText(youPayFormatted) || String(youPayFormatted);
          } else {
            // Fallback: use simple string conversion
            youPayString = String(youPayFormatted);
          }
          
          if (typeof youReceiveFormatted === 'string') {
            youReceiveString = youReceiveFormatted;
          } else if (React.isValidElement(youReceiveFormatted)) {
            // If it's a React element, extract text from children
            const extractText = (node: any): string => {
              if (typeof node === 'string') return node;
              if (typeof node === 'number') return String(node);
              if (Array.isArray(node)) return node.map(extractText).join('');
              if (node?.props?.children) return extractText(node.props.children);
              return '';
            };
            youReceiveString = extractText(youReceiveFormatted) || String(youReceiveFormatted);
          } else {
            // Fallback: use simple string conversion
            youReceiveString = String(youReceiveFormatted);
          }
          
          // Store in session storage
          sessionStorage.setItem(SESSION_STORAGE_KEYS.YOU_PAY_VALUE, youPayString);
          sessionStorage.setItem(SESSION_STORAGE_KEYS.YOU_RECEIVE_VALUE, youReceiveString);
          
          const amountToReceive = activeTab.toUpperCase() === "SELL"
            ? numAmount
            : numToken;
          const amountToSend = activeTab.toUpperCase() === "SELL"
            ? numToken
            : numAmount;
          
          const amountsPartial: Partial<InitiateTransactionRequestPayload> = {
            amountToReceive,
            amountToSend,
          };
          const amountsMerged: InitiateTransactionRequestPayload = {
            ...(transactionFormRef.current || {}),
            ...amountsPartial,
          } as InitiateTransactionRequestPayload;
          
          transactionFormRef.current = amountsMerged;
          setTransactionForm(amountsMerged);
          dispatch(setInitiateTransactionField({
            field: "amountToReceive",
            value: amountToReceive
          }));
          dispatch(setInitiateTransactionField({
            field: "amountToSend",
            value: amountToSend
          }));
        }
      }
    } else {
      saveTradeProgress({ receiptUrl: url });
    }
  };

  const handleTransactionHash = (hash: string) => {
    const partial: Partial<InitiateTransactionRequestPayload> = {
      transactionHash: hash,
    };
    const merged: InitiateTransactionRequestPayload = {
      ...(transactionFormRef.current || {}),
      ...partial,
    } as InitiateTransactionRequestPayload;

    if (!shallowEqual(transactionFormRef.current, merged)) {
      transactionFormRef.current = merged;
      setTransactionForm(merged);
      dispatch(setInitiateTransactionField({
        field: "transactionHash",
        value: hash
      }))
    }
    saveTradeProgress({ transactionHash: hash });
  };

  const togglePaymentReceivingModal = () =>
    setShowPaymentReceivingModal((prev) => !prev);

  const toggleConfirmBankDetails = () =>
    setShowConfirmBankDetails((prev) => !prev);
  
  const toggleShowUserEnterEmail = () => setShowUserEnterEmail((prev) => !prev);

  // Validate required fields before initiating a transaction.
  const canInitiateTransaction = () => {
    if (!exchangeRate) {
      toast.error("Exchange rate is still loading. Please wait a moment and try again.");
      return false;
    }

    // Sell flow: amounts are unknown upfront (user sends crypto to custodial wallet).
    // Only buy flow requires amounts to be entered before proceeding.
    if (activeTab === "buy") {
      const tokenAmount = Number(numberOfToken || 0);
      const receiveAmount = Number(amountToBuy || 0);
      if (!receiveAmount || receiveAmount <= 0 || !tokenAmount || tokenAmount <= 0) {
        toast.error(`Please enter a valid ${selectedCurrency?.code || "fiat"} amount before continuing.`);
        return false;
      }
    }

    return true;
  };

  const initiateTransaction = async () => {
    try {
      if (!canInitiateTransaction()) return;

      if (activeTab === "buy") {
        // BUY: no API call here — just advance to step 2 with amounts synced.
        // Transaction is created at AWAITING_PAYMENT when receipt is submitted.
        const tokenAmount = Number(numberOfToken || 0);
        const receiveAmount = Number(amountToBuy || 0);
        dispatch(setInitiateTransactionField({ field: "amountToSend", value: receiveAmount }));
        dispatch(setInitiateTransactionField({ field: "amountToReceive", value: tokenAmount }));
        saveTradeProgress({ step: 2 });
        setStep(2);
      } else {
        // SELL: keep existing flow — create INITIATED transaction to lock the rate
        const { data: { sessionId }} = await initiateTransactionMutation.mutateAsync();
        setTransactionSessionId(sessionId);
        sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, sessionId);
        saveTradeProgress({ transactionSessionId: sessionId, step: 2 });
        setStep(2);
      }
    } catch (error) {
      if (isExchangeRateExpiryError(error)) {
        void refreshExchangeRateSilently();
        return;
      }
      // Error already handled by mutation's onError (toast shown); just let button re-enable
    }
  };

  const makePaymentTransaction = async () => {
    if (activeTab === "buy") {
      // BUY: create transaction at AWAITING_PAYMENT in one shot
      try {
        const res = await createAndSubmitTransactionMutation.mutateAsync();
        setIsCountdownLocked(true);
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        
        if (res?.success && res.data?.sessionId) {
          const sessionId = res.data.sessionId;
          setTransactionSessionId(sessionId);
          sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, sessionId);
          saveTradeProgress({ transactionSessionId: sessionId, step: 2 });
          // We stay on step 2 to show the monitoring view
          setStep(2);
        }
      } catch (error) {
        if (isExchangeRateExpiryError(error)) {
          void refreshExchangeRateSilently();
          return;
        }
        return;
      }
    } else {
      // SELL: existing flow — update INITIATED → AWAITING_CRYPTO + open bank modal
      try {
        await makePaymentTransactionMutation.mutateAsync();
        setIsCountdownLocked(true);
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        togglePaymentReceivingModal();
      } catch (error) {
        if (isExchangeRateExpiryError(error)) {
          void refreshExchangeRateSilently();
          return;
        }
        return;
      }
    }
  };

  const handleConfirmBankDetails = async (step: number) => {
    try {
      console.log('handleConfirmBankDetails', step);
      const { success } = await receivingPaymentAccountConfirmationMutation.mutateAsync();
      if (success) {
        // We stay on step 2 to show the monitoring view
        setStep(2);
        setShowPaymentReceivingModal(false);
        setShowConfirmBankDetails(false);
      }
    } catch (error) {
      console.error("Failed to confirm bank details:", error);
      toast.error("Failed to confirm bank details. Please try again.");
    }
  };
  
  const handleAnonymousUserEmailInput = (value: string) => {
    dispatch(setAnonymousUserEmail(value));
    saveTradeProgress({ anonymousEmail: value });
    toggleShowUserEnterEmail();
  }

  // ---------- Persist deltas (guarded by hydration) ----------
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveTradeProgress({
      selectedTokenId: selectedToken?.id,
      selectedCurrencyId: selectedCurrency?.id,
    });
  }, [selectedToken?.id, selectedCurrency?.id]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    // Always save amounts and isCountdownLocked state
    // The restoration logic will filter out invalid values
    saveTradeProgress({ numberOfToken, amountToBuy, isCountdownLocked });
  }, [numberOfToken, amountToBuy, isCountdownLocked]);

  // Reset countdown locked state when starting a new transaction (step 1 with no saved progress)
  useEffect(() => {
    if (currentStep === 1) {
      const saved = loadTradeProgress();
      // If we're on step 1 and there's no saved progress (or saved step is 1), reset locked state
      if (!saved || saved.step === 1) {
        setIsCountdownLocked(false);
        setCountdown("");
      }
    }
  }, [currentStep]);

  // Restore amounts to transaction form after restoration
  // This should run even when countdown is locked to ensure amounts are set correctly
  useEffect(() => {
    if (!isHydrated) return;
    
    const saved = loadTradeProgress();
    // Restore amounts if we're on step 2 and have the necessary data
    // Also restore if countdown is locked (receipt uploaded) to ensure amounts persist
    if ((saved?.step === 2 || isCountdownLocked || currentStep === 2) && selectedToken && selectedCurrency) {
      // Use saved amounts if current state amounts are empty/0, otherwise use current state
      const tokenValue = (numberOfToken && Number(numberOfToken) > 0) 
        ? numberOfToken 
        : (saved?.numberOfToken && Number(saved.numberOfToken) > 0) 
          ? saved.numberOfToken 
          : null;
      const amountValue = (amountToBuy && Number(amountToBuy) > 0) 
        ? amountToBuy 
        : (saved?.amountToBuy && Number(saved.amountToBuy) > 0) 
          ? saved.amountToBuy 
          : null;
      
      if (!tokenValue || !amountValue) return;
      
      const numToken = Number(tokenValue);
      const numAmount = Number(amountValue);
      
      // Only proceed if amounts are valid numbers
      if (isNaN(numToken) || isNaN(numAmount) || numToken <= 0 || numAmount <= 0) {
        return;
      }
      
      // Update state if needed (only if they're different and valid)
      if (tokenValue !== numberOfToken) {
        if (typeof tokenValue === 'string' || typeof tokenValue === 'number') {
          setNumberOfToken(tokenValue);
        }
      }
      if (amountValue !== amountToBuy) {
        if (typeof amountValue === 'string' || typeof amountValue === 'number') {
          setAmountToBuy(amountValue);
        }
      }
      
      const amountToReceive = activeTab.toUpperCase() === "SELL"
        ? numAmount
        : numToken;
      const amountToSend = activeTab.toUpperCase() === "SELL"
        ? numToken
        : numAmount;
      
      const amountsPartial: Partial<InitiateTransactionRequestPayload> = {
        amountToReceive,
        amountToSend,
      };
      const amountsMerged: InitiateTransactionRequestPayload = {
        ...(transactionFormRef.current || {}),
        ...amountsPartial,
      } as InitiateTransactionRequestPayload;
      
      if (!shallowEqual(transactionFormRef.current, amountsMerged)) {
        transactionFormRef.current = amountsMerged;
        setTransactionForm(amountsMerged);
        dispatch(setInitiateTransactionField({
          field: "amountToReceive",
          value: amountToReceive
        }));
        dispatch(setInitiateTransactionField({
          field: "amountToSend",
          value: amountToSend
        }));
      }
    }
  }, [isHydrated, numberOfToken, amountToBuy, selectedToken, selectedCurrency, activeTab, dispatch, isCountdownLocked, currentStep]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (transactionSessionId) saveTradeProgress({ transactionSessionId });
  }, [transactionSessionId]);

  const formatReceiveAmount = (amount: number | string, currencyCode: string | undefined): string | React.ReactNode => {
    if (!exchangeRate || !currencyCode) return String(amount);
    
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum === 0) return String(amount);
    
    // For BUY transactions, just show the crypto amount
    if (activeTab.toLocaleLowerCase() === 'buy') {
      return `${Number(numberOfToken)} ${selectedToken?.symbol}`;
    }
    
    // For SELL transactions, show fiat conversions
    // When currency is USD, show both USD and NGN amounts
    if (exchangeRate.currency === "USD" && exchangeRate.fiatRate && exchangeRate.usdRate) {
      // Calculate NGN amount: USD amount * (NGN rate / USD rate)
      const ngnAmount = amountNum * (exchangeRate.fiatRate / exchangeRate.usdRate);
      return React.createElement(
        'span',
        null,
        `${amountNum.toLocaleString()} ${currencyCode} (`,
        React.createElement('strong', null, `${ngnAmount.toLocaleString()} NGN`),
        ')'
      );
    }
    
    // When currency is NGN, just show NGN amount in bold
    if (exchangeRate.currency === "NGN") {
      return React.createElement(
        'span',
        null,
        React.createElement('strong', null, `${amountNum.toLocaleString()} ${currencyCode}`)
      );
    }
    
    // Fallback: just show the amount
    return `${amountNum.toLocaleString()} ${currencyCode}`;
  };

  const formatSendAmount = (amount: number | string, currencyCode: string | undefined): string | React.ReactNode => {
    if (!exchangeRate || !currencyCode) return String(amount);
    
    const amountNum = Number(String(amount).replace(/,/g, '')); // Remove commas before parsing
    if (isNaN(amountNum) || amountNum === 0) return String(amount);
    
    // For SELL transactions, show the crypto amount being sent
    if (activeTab.toLowerCase() === 'sell') {
      return `${Number(numberOfToken).toLocaleString()} ${selectedToken?.symbol}`;
    }
    
    // For BUY transactions, show fiat amount with proper formatting
    // When currency is NGN, show NGN amount in bold
    if (exchangeRate.currency === "NGN") {
      return React.createElement(
        'span',
        null,
        React.createElement('strong', null, `${amountNum.toLocaleString()} ${currencyCode}`)
      );
    }
    
    // When currency is USD, show both USD and NGN amounts
    if (exchangeRate.currency === "USD" && exchangeRate.fiatRate && exchangeRate.usdRate) {
      // Calculate NGN amount: USD amount * (NGN rate / USD rate)
      const ngnAmount = amountNum * (exchangeRate.fiatRate / exchangeRate.usdRate);
      return React.createElement(
        'span',
        null,
        React.createElement('strong', null, `${ngnAmount.toLocaleString()} NGN`),
        ' (',
        `${amountNum.toLocaleString()} ${currencyCode}`,
        ')'
      );
    }
    
    // Fallback: show the amount with currency code
    return `${amountNum.toLocaleString()} ${currencyCode}`;
  };

  // Handle focus events to prevent calculations while typing
  const handleFocusNumberOfToken = () => {
    focusedFieldRef.current = "numberOfToken";
  };

  const handleFocusAmountToBuy = () => {
    focusedFieldRef.current = "amountToBuy";
  };

  // Handle blur events to trigger calculation
  const handleBlurNumberOfToken = () => {
    focusedFieldRef.current = null;
    // Reset calculation ref to allow recalculation when user finishes editing
    lastCalculationRef.current = null;
  };

  const handleBlurAmountToBuy = () => {
    focusedFieldRef.current = null;
    // Reset calculation ref to allow recalculation when user finishes editing
    lastCalculationRef.current = null;
  };

  return {
    // Values
    selectedToken,
    numberOfToken,
    AdditionalInfo,
    amountToBuy,
    amountToReceive,
    amountToSend,
    selectedCurrency,
    supportedCurrencies,
    supportedCryptoCurrencies,
    countdown,
    exchangeRate,
    loadingExchangeRate,
    isDebouncing,
    transactionForm,
    transactionSessionId,
    isCountdownLocked,
    showPaymentReceivingModal,
    userBankAccounts,
    isInitiatingTrade: initiateTransactionMutation.isPending || createAndSubmitTransactionMutation.isPending,
    showUserEnterEmail,
    isLoadingPingUser,
    loadingSupportedCryptocurrencies,
    loadingUserBankAccounts,
    hasAnonymousUserEmail,
    sellDepositWallet,
    isGeneratingDepositWallet: generateCustodialWalletMutation.isPending,

    // Functions
    setAmountToBuy,
    setTransactionSessionId,
    setNumberOfToken,
    setSelectedCurrency,
    setSelectedToken,
    handleReceiptUrl,
    handleTransactionHash,
    toggleConfirmBankDetails,
    initiateTransaction,
    makePaymentTransaction,
    handleConfirmBankDetails,
    handleAnonymousUserEmailInput,
    toggleShowUserEnterEmail,
    togglePaymentReceivingModal,
    formatReceiveAmount,
    formatSendAmount,
    handleFocusNumberOfToken,
    handleFocusAmountToBuy,
    handleBlurNumberOfToken,
    handleBlurAmountToBuy,
  };
};
