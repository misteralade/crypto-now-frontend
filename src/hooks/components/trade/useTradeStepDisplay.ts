import {useEffect, useState, useMemo, useRef} from "react";
import { useQueryClient} from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import type {
  TradeAdditionalInfoInterface,
  TradeType,
  WalletDetailsData
} from "../../../types/trade.types.ts";
import {useCurrencyQuery} from "../../../queries/currency.query.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import {useCryptoQuery} from "../../../queries/crypto.query.ts";
import {useRateQuery} from "../../../queries/rate.query.ts";
import {useTransactionQuery} from "../../../queries/transaction.query.ts";
import {QUERY_KEYS} from "../../../queries/query.keys.ts";
import type {InitiateTransactionRequestPayload} from "../../../types/request.payload.types.ts";
import {useBankQuery} from "../../../queries/bank.query.ts";
import { setExchangeRateId as setReduxExchangeRateId, setInitiateTransaction, setAmountToSend } from '../../../redux/transaction.slice.ts'
import {SESSION_STORAGE_KEYS} from "../../../util/constants.ts";

// Custom debounce hook
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useTradeStepDisplay = (token: string, tradeType: TradeType, activeTab: TradeType, currency: string, setStep: (value: number) => void) => {
  const countdownIntervalRef = useRef<any>();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { userBankAccounts } = useBankQuery();
  const { supportedCurrencies } = useCurrencyQuery();
  const { supportedCryptoCurrencies } = useCryptoQuery();
  const { calculatedAmount, loadingCalculation, initiateTransactionMutation, makePaymentTransactionMutation } = useTransactionQuery();

  const WalletDetails: WalletDetailsData = {
    coinType: "USDT",
    walletAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    networkType: "BEP20"
  }

  const [transactionSessionId, setTransactionSessionId] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<SupportedCryptoOrCurrencyResponse>();
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCryptoOrCurrencyResponse>();
  const [countdown, setCountdown] = useState<string>("");
  const [transactionForm, setTransactionForm] = useState<InitiateTransactionRequestPayload>()
  const [isCountdownLocked, setIsCountdownLocked] = useState(false); // New state to lock countdown
  const { exchangeRate, loadingExchangeRate } = useRateQuery(selectedToken?.id || '', selectedCurrency?.id || '', tradeType.toUpperCase() === 'BUY' ? 'BUY' : 'SELL');

  const [numberOfToken, setNumberOfToken] = useState<string | number>("");
  const [exchangeRateId, setExchangeRateId] = useState("");
  const [validUntil, setValidUntil] = useState<Date>();
  const [amountToBuy, setAmountToBuy] = useState<string | number>("");

  // Modals
  const [showPaymentReceivingModal, setShowPaymentReceivingModal] = useState(false)
  const [showConfirmBankDetails, setShowConfirmBankDetails] = useState<boolean>(false)

  // Get the amount to send for the transaction query
  const amountToSend = activeTab === "sell" ? Number(numberOfToken) : Number(amountToBuy);

  // Debounce the amount to send to prevent excessive API calls (500ms delay)
  const debouncedAmountToSend = useDebounce(amountToSend, 500);
  dispatch(setAmountToSend(debouncedAmountToSend > 0 ? debouncedAmountToSend : undefined))

  // Countdown timer effect
  useEffect(() => {
    if (!validUntil || isCountdownLocked) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = validUntil.getTime();
      const timeDifference = targetTime - now;

      if (timeDifference <= 0) {
        setCountdown("Expired");

        // Clear the interval
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }

        // Don't reset amounts - just unlock countdown and refresh rates
        setIsCountdownLocked(false);

        // Refetch exchange rate when expired to get new rates
        if (selectedToken?.id && selectedCurrency?.id) {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.EXCHANGE_RATE.GET_CRYPTO_TO_CURRENCY_EXCHANGE_RATE, selectedToken.id, selectedCurrency.id]
          });
        }
        return;
      }

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every second only if countdown is not locked
    if (!isCountdownLocked) {
      countdownIntervalRef.current = setInterval(updateCountdown, 1000);
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [validUntil, selectedToken?.id, selectedCurrency?.id, queryClient, isCountdownLocked]);

  // Auto-calculate the opposite field based on exchange rate (only if countdown is not locked)
  useEffect(() => {
    if (!exchangeRate?.fiatRate || loadingExchangeRate || isCountdownLocked) return;

    if (activeTab === "sell" && numberOfToken !== "" && Number(numberOfToken) > 0) {
      const calculatedAmount = (Number(numberOfToken) * exchangeRate.fiatRate).toFixed(5);
      setAmountToBuy(calculatedAmount);
    }

    if (activeTab === "buy" && amountToBuy !== "" && Number(amountToBuy) > 0) {
      const calculatedTokens = (Number(amountToBuy) / exchangeRate.fiatRate).toFixed(8);
      setNumberOfToken(calculatedTokens);
    }

    setTransactionForm((prev) => ({
      ...prev,
      amountToReceive: activeTab.toUpperCase() === "SELL" ? Number(amountToBuy) : Number(numberOfToken),
      amountToSend: activeTab.toUpperCase() === "SELL" ? Number(numberOfToken) : Number(amountToBuy),
    }))
    dispatch(setInitiateTransaction({
      ...transactionForm,
      amountToReceive: activeTab.toUpperCase() === "SELL" ? Number(amountToBuy) : Number(numberOfToken),
      amountToSend: activeTab.toUpperCase() === "SELL" ? Number(numberOfToken) : Number(amountToBuy),
    }));
  }, [numberOfToken, amountToBuy, activeTab, exchangeRate?.fiatRate, loadingExchangeRate, isCountdownLocked]);

  useEffect(() => {
    // Find the selected token from the supportedCryptoCurrencies array
    const foundToken = supportedCryptoCurrencies?.find(
      (crypto) => crypto.id === token
    );
    setSelectedToken(foundToken);

    // Find the selected currency from the supportedCurrencies array
    const foundCurrency = supportedCurrencies?.find(
      (curr) => curr.id === currency
    );
    setSelectedCurrency(foundCurrency);

    setTransactionForm((prev) => ({
      ...prev,
      tokenId: foundToken?.id,
      currencyId: foundCurrency?.id,
    }))
    dispatch(setInitiateTransaction({
      ...transactionForm,
      tokenId: foundToken?.id,
      currencyId: foundCurrency?.id,
    }));
  }, [supportedCurrencies, supportedCryptoCurrencies, token, currency])

  useEffect(() => {
    const rateId = exchangeRate?.rateId || '';

    setExchangeRateId(rateId);
    dispatch(setReduxExchangeRateId(rateId))
    setValidUntil(exchangeRate?.validUntil ? new Date(exchangeRate.validUntil) : undefined);

    setTransactionForm((val) => ({
      ...val,
      exchangeRateId: rateId,
    }));
    dispatch(setInitiateTransaction({
      ...transactionForm,
      exchangeRateId: rateId,
    }));

    // Store exchange rate ID in session storage
    if (rateId) {
      sessionStorage.setItem("exchangeRateId", rateId);
    }

    // Reset countdown lock when new exchange rate is received
    if (rateId && isCountdownLocked) {
      setIsCountdownLocked(false);
    }
  }, [exchangeRate]);

  // Reset form when switching between buy/sell tabs
  useEffect(() => {
    setNumberOfToken("");
    setAmountToBuy("");

    // Reset countdown lock when switching tabs
    setIsCountdownLocked(false);
  }, [activeTab]);

  // Check if we're currently waiting for debounce (user is still typing)
  const isDebouncing = amountToSend !== debouncedAmountToSend && amountToSend > 0;

  // Get the calculated amount to receive from the API or fallback to local calculation
  const amountToReceive: number = useMemo(() => {
    // If we have API response, use it
    if (calculatedAmount && !loadingCalculation && !isDebouncing) {
      return Number(calculatedAmount);
    }

    // Fallback to local calculation while API is loading or debouncing
    if (exchangeRate?.fiatRate && amountToSend > 0) {
      if (activeTab === "sell") {
        // Selling: convert tokens to currency
        return Number(amountToBuy) || 0;
      } else {
        // Buying: convert currency to tokens
        return Number(numberOfToken) || 0;
      }
    }

    return 0;
  }, [calculatedAmount, loadingCalculation, isDebouncing, exchangeRate?.fiatRate, amountToSend, activeTab, amountToBuy, numberOfToken]);

  const AdditionalInfo: TradeAdditionalInfoInterface[] = [
    {
      title: "Rate",
      value: loadingExchangeRate ? 'Loading...' : `1 ${selectedToken?.symbol} = ${exchangeRate?.fiatRate?.toLocaleString() || 0} ${selectedCurrency?.code}`,
    },
    {
      title: "Valid until",
      value: loadingExchangeRate ? 'Loading...' : isCountdownLocked ? 'Rate Locked' : countdown || "Loading...",
    },
  ]

  const handleReceiptUrl = (url: string) => {
    setTransactionForm((prev) => ({
      ...prev,
      receiptUrl: url
    }))
    dispatch(setInitiateTransaction({
      ...transactionForm,
      receiptUrl: url
    }))
  };

  const handleTransactionHash = (hash: string) => {
    setTransactionForm((prev) => ({
      ...prev,
      transactionHash: hash
    }))
    dispatch(setInitiateTransaction({
      ...transactionForm,
      transactionHash: hash
    }))
  };

  const togglePaymentReceivingModal = () => setShowPaymentReceivingModal((prev) => !prev);

  const toggleConfirmBankDetails = () => setShowConfirmBankDetails((prev) => !prev);

  const initiateTransaction = async () => {
    await initiateTransactionMutation.mutateAsync()
    setTransactionSessionId(sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID) || "")
    setStep(2);
  }

  const makePaymentTransaction = async () => {
    await makePaymentTransactionMutation.mutateAsync();
    setIsCountdownLocked(true);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    togglePaymentReceivingModal();
  }

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
    WalletDetails,
    userBankAccounts,

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
  };
}