import { useEffect, useState, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import type {
  TradeAdditionalInfoInterface,
  TradeType,
} from "../../../types/trade.types.ts";
import { useCurrencyQuery } from "../../../queries/currency.query.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import { useCryptoQuery } from "../../../queries/crypto.query.ts";
import { useRateQuery } from "../../../queries/rate.query.ts";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";
import { QUERY_KEYS } from "../../../queries/query.keys.ts";
import type { InitiateTransactionRequestPayload } from "../../../types/request.payload.types.ts";
import { useBankQuery } from "../../../queries/bank.query.ts";
import {
  setExchangeRateId as setReduxExchangeRateId,
  setAmountToSend, setInitiateTransactionField,
} from "../../../redux/transaction.slice.ts";
import { setSelectedCryptoId } from "../../../redux/crypto.slice.ts";
import { SESSION_STORAGE_KEYS } from "../../../util/constants.util.ts";
import {
  loadTradeProgress,
  saveTradeProgress,
} from "../../../util/tradeProgress.storage.util.ts";
import {useUserQuery} from "../../../queries/user.query.ts";
import {type RootState, store} from "../../../store.ts";
import {setAnonymousUserEmail} from "../../../redux/user.slice.ts";

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

export const useTradeStepDisplay = (
  token: string,
  activeTab: TradeType,
  currency: string,
  setStep: (value: number) => void
) => {
  const rootState = store.getState() as RootState;
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const countdownIntervalRef = useRef<any>();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  useUserQuery();
  const { userBankAccounts } = useBankQuery();
  const { supportedCurrencies } = useCurrencyQuery();
  const { supportedCryptoCurrencies, userCryptoWallets } = useCryptoQuery();
  const { calculatedAmount, loadingCalculation, initiateTransactionMutation, makePaymentTransactionMutation, receivingPaymentAccountConfirmationMutation } = useTransactionQuery();
  
  const isAnonymousUser = rootState.user.trade.anonymous.isAnonymousUser

  const [transactionSessionId, setTransactionSessionId] = useState<string>();
  const [selectedToken, setSelectedToken] =
    useState<SupportedCryptoOrCurrencyResponse>();
  const [selectedCurrency, setSelectedCurrency] =
    useState<SupportedCryptoOrCurrencyResponse>();
  const [countdown, setCountdown] = useState<string>("");
  const [transactionForm, setTransactionForm] =
    useState<InitiateTransactionRequestPayload>();
  const transactionFormRef = useRef<
    InitiateTransactionRequestPayload | undefined
  >(undefined);

  const [isCountdownLocked, setIsCountdownLocked] = useState(false);
  const { exchangeRate, loadingExchangeRate } = useRateQuery(
    selectedToken?.id || "",
    selectedCurrency?.id || "",
    activeTab.toUpperCase() === "BUY" ? "BUY" : "SELL"
  );

  const [numberOfToken, setNumberOfToken] = useState<string | number>("");
  const [exchangeRateId, setExchangeRateId] = useState("");
  const [validUntil, setValidUntil] = useState<Date>();
  const [amountToBuy, setAmountToBuy] = useState<string | number>("");

  // Modals
  const [showPaymentReceivingModal, setShowPaymentReceivingModal] = useState(false);
  const [, setShowConfirmBankDetails] = useState<boolean>(false);
  const [showUserEnterEmail, setShowUserEnterEmail] = useState<boolean>(false)

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
  useEffect(() => {
    if (isAnonymousUser !== undefined && isAnonymousUser) {
      toggleShowUserEnterEmail();
    }
  }, [isAnonymousUser])

  // 🔹 Hydration guard to avoid saving empty defaults on first paint
  const hydratedRef = useRef(false);

  // ---------- Restore persisted progress ----------
  useEffect(() => {
    const saved = loadTradeProgress();
    if (!saved) {
      hydratedRef.current = true;
      return;
    }

    // amounts & flags
    if (saved.numberOfToken !== undefined)
      setNumberOfToken(saved.numberOfToken);
    if (saved.amountToBuy !== undefined) setAmountToBuy(saved.amountToBuy);
    if (saved.isCountdownLocked !== undefined)
      setIsCountdownLocked(saved.isCountdownLocked);
    if (saved.exchangeRateId) setExchangeRateId(saved.exchangeRateId);
    if (saved.transactionSessionId)
      setTransactionSessionId(saved.transactionSessionId);

    // mark hydrated after we push restored state
    // small timeout ensures our "save" effects don't run with pre-hydrate empties
    setTimeout(() => {
      hydratedRef.current = true;
    }, 0);
  }, []);
  
  // Set the fields on the redux store
  useEffect(() => {
    dispatch(setInitiateTransactionField({
      field: "currencyId",
      value: currency,
    }))
    dispatch(setInitiateTransactionField({
      field: "tokenId",
      value: token,
    }));
  }, [])

  // Countdown
  useEffect(() => {
    if (!validUntil || isCountdownLocked) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = validUntil.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("Expired");
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
        setIsCountdownLocked(false);
        if (selectedToken?.id && selectedCurrency?.id) {
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.EXCHANGE_RATE.GET_CRYPTO_TO_CURRENCY_EXCHANGE_RATE,
              selectedToken.id,
              selectedCurrency.id,
            ],
          });
        }
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
    validUntil,
    isCountdownLocked,
    selectedToken?.id,
    selectedCurrency?.id,
    queryClient,
    dispatch,
  ]);

  // Auto-calc opposite field (guarded)
  useEffect(() => {
    if (!exchangeRate?.fiatRate || loadingExchangeRate || isCountdownLocked)
      return;

    let nextAmountToBuy = amountToBuy;
    let nextNumberOfToken = numberOfToken;

    if (
      activeTab === "sell" &&
      numberOfToken !== "" &&
      Number(numberOfToken) > 0
    ) {
      nextAmountToBuy = (Number(numberOfToken) * exchangeRate.fiatRate).toFixed(
        5
      );
      if (nextAmountToBuy !== amountToBuy) setAmountToBuy(nextAmountToBuy);
    }
    if (activeTab === "buy" && amountToBuy !== "" && Number(amountToBuy) > 0) {
      nextNumberOfToken = (Number(amountToBuy) / exchangeRate.fiatRate).toFixed(
        8
      );
      if (nextNumberOfToken !== numberOfToken)
        setNumberOfToken(nextNumberOfToken);
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
    numberOfToken,
    amountToBuy,
    activeTab,
    exchangeRate?.fiatRate,
    loadingExchangeRate,
    isCountdownLocked,
  ]);

  // Initial selection from route params
  useEffect(() => {
    const foundToken = supportedCryptoCurrencies?.find((c) => c.id === token);
    const foundCurrency = supportedCurrencies?.find((c) => c.id === currency);
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
      if (found) setSelectedToken(found);
    }
    if (saved.selectedCurrencyId && supportedCurrencies?.length) {
      const found = supportedCurrencies.find(
        (c) => c.id === saved.selectedCurrencyId
      );
      if (found) setSelectedCurrency(found);
    }
  }, [supportedCryptoCurrencies, supportedCurrencies]);

  // Exchange rate updates (guarded)
  useEffect(() => {
    const rateId = exchangeRate?.rateId || "";
    setExchangeRateId(rateId);
    dispatch(setReduxExchangeRateId(rateId));
    setValidUntil(
      exchangeRate?.validUntil ? new Date(exchangeRate.validUntil) : undefined
    );

    const partial: Partial<InitiateTransactionRequestPayload> = {
      exchangeRateId: rateId,
    };
    const merged: InitiateTransactionRequestPayload = {
      ...(transactionFormRef.current || {}),
      ...partial,
    } as InitiateTransactionRequestPayload;

    if (!shallowEqual(transactionFormRef.current, merged)) {
      transactionFormRef.current = merged;
      setTransactionForm(merged);
      dispatch(setInitiateTransactionField({
        field: "exchangeRateId",
        value: rateId
      }))
    }

    if (rateId) {
      sessionStorage.setItem("exchangeRateId", rateId);
      saveTradeProgress({ exchangeRateId: rateId });
    }
    if (rateId && isCountdownLocked) setIsCountdownLocked(false);
  }, [exchangeRate, dispatch, isCountdownLocked]);

  // 🔹 Only clear amounts when the tab ACTUALLY changes (not on mount)
  const prevActiveTabRef = useRef<TradeType>(activeTab);
  useEffect(() => {
    const prev = prevActiveTabRef.current;
    if (prev !== activeTab) {
      setNumberOfToken("");
      setAmountToBuy("");
      setIsCountdownLocked(false);
      prevActiveTabRef.current = activeTab;
    }
    // if same tab, do nothing (prevents clearing after refresh)
  }, [activeTab]);

  const isDebouncing =
    amountToSend !== debouncedAmountToSend && amountToSend > 0;

  const amountToReceive: number = useMemo(() => {
    if (calculatedAmount && !loadingCalculation && !isDebouncing) {
      return Number(calculatedAmount);
    }
    if (exchangeRate?.fiatRate && amountToSend > 0) {
      return activeTab === "sell"
        ? Number(amountToBuy) || 0
        : Number(numberOfToken) || 0;
    }
    return 0;
  }, [
    calculatedAmount,
    loadingCalculation,
    isDebouncing,
    exchangeRate?.fiatRate,
    amountToSend,
    activeTab,
    amountToBuy,
    numberOfToken,
  ]);

  const AdditionalInfo: TradeAdditionalInfoInterface[] = [
    {
      title: "Rate",
      value: loadingExchangeRate
        ? "Loading..."
        : `1 ${selectedToken?.symbol} = ${exchangeRate?.fiatRate?.toLocaleString() || 0} ${selectedCurrency?.code}`,
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
    saveTradeProgress({ receiptUrl: url });
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

  const initiateTransaction = async () => {
    await initiateTransactionMutation.mutateAsync();
    const sid = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID) || "";
    setTransactionSessionId(sid);
    saveTradeProgress({ transactionSessionId: sid, step: 2 });
    setStep(2);
  };

  const makePaymentTransaction = async () => {
    await makePaymentTransactionMutation.mutateAsync();
    setIsCountdownLocked(true);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    togglePaymentReceivingModal();
  };

  const handleConfirmBankDetails = async (step: number) => {
    await receivingPaymentAccountConfirmationMutation.mutateAsync();
    toggleConfirmBankDetails();
    togglePaymentReceivingModal();
    setStep(step);
  };
  
  const handleAnonymousUserEmailInput = (value: string) => {
    dispatch(setAnonymousUserEmail(value));
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
    saveTradeProgress({ numberOfToken, amountToBuy, isCountdownLocked });
  }, [numberOfToken, amountToBuy, isCountdownLocked]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (exchangeRateId) saveTradeProgress({ exchangeRateId });
  }, [exchangeRateId]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (transactionSessionId) saveTradeProgress({ transactionSessionId });
  }, [transactionSessionId]);

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
    exchangeRateId,
    loadingCalculation,
    isDebouncing,
    transactionForm,
    transactionSessionId,
    isCountdownLocked,
    showPaymentReceivingModal,
    userBankAccounts,
    userCryptoWallets,
    isInitiatingTrade: initiateTransactionMutation.isPending,
    showUserEnterEmail,

    // Functions
    setAmountToBuy,
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
    toggleShowUserEnterEmail
  };
};
