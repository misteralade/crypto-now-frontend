import {useEffect, useState, useMemo} from "react";
import type {TradeAdditionalInfoInterface, TradeType} from "../../../types/trade.types.ts";
import {useCurrencyQuery} from "../../../queries/currency.query.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import {useCryptoQuery} from "../../../queries/crypto.query.ts";
import {useRateQuery} from "../../../queries/rate.query.ts";
import {useTransactionQuery} from "../../../queries/transaction.query.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS} from "../../../queries/query.keys.ts";
import type {InitiateTransactionRequestPayload} from "../../../types/request.payload.types.ts";
import {transactionServiceApi} from "../../../api/transaction.api.ts";

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
  const [transactionSessionId, setTransactionSessionId] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<SupportedCryptoOrCurrencyResponse>();
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCryptoOrCurrencyResponse>();
  const [countdown, setCountdown] = useState<string>("");
  const [transactionForm, setTransactionForm] = useState<InitiateTransactionRequestPayload>()

  const queryClient = useQueryClient();
  const { supportedCurrencies } = useCurrencyQuery();
  const { supportedCryptoCurrencies } = useCryptoQuery();
  const { exchangeRate, loadingExchangeRate } = useRateQuery(selectedToken?.id || '', selectedCurrency?.id || '', tradeType.toUpperCase() === 'BUY' ? 'BUY' : 'SELL');

  const [numberOfToken, setNumberOfToken] = useState<string | number>("");
  const [exchangeRateId, setExchangeRateId] = useState("");
  const [validUntil, setValidUntil] = useState<Date>();
  const [amountToBuy, setAmountToBuy] = useState<string | number>("");

  // Step 2: Payment upload

  // Get the amount to send for the transaction query
  const amountToSend = activeTab === "sell" ? Number(numberOfToken) : Number(amountToBuy);

  // Debounce the amount to send to prevent excessive API calls (500ms delay)
  const debouncedAmountToSend = useDebounce(amountToSend, 500);

  // Use transaction query to calculate amount to receive with debounced value
  const { calculatedAmount, loadingCalculation } = useTransactionQuery(
    exchangeRateId,
    debouncedAmountToSend > 0 ? debouncedAmountToSend : undefined
  );

  const initiateTransactionMutation = useMutation({
    mutationKey: [QUERY_KEYS.TRANSACTION.INITIATE_TRANSACTION],
    mutationFn: async () => {
      const payload = {
        ...transactionForm,
        coinId: transactionForm?.tokenId,
        // type: transactionForm?.action,
      }

      console.log({
        payload,
      });

      const sessionId = await transactionServiceApi.initiateTransaction(payload);
      setTransactionSessionId(sessionId)
      sessionStorage.setItem("transactionSessionId", sessionId as string);
    },
    onMutate: () => {
      setStep(2);
    }
  })

  // Countdown timer effect
  useEffect(() => {
    if (!validUntil) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = validUntil.getTime();
      const timeDifference = targetTime - now;

      if (timeDifference <= 0) {
        setCountdown("Expired");
        // Refetch exchange rate when expired
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

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on unmount or when validUntil changes
    return () => clearInterval(interval);
  }, [validUntil, selectedToken?.id, selectedCurrency?.id, queryClient]);

  // Auto-calculate the opposite field based on exchange rate
  useEffect(() => {
    if (!exchangeRate?.fiatRate || loadingExchangeRate) return;

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
  }, [numberOfToken, amountToBuy, activeTab, exchangeRate?.fiatRate, loadingExchangeRate]);

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
  }, [supportedCurrencies, supportedCryptoCurrencies, token, currency])

  useEffect(() => {
    setExchangeRateId(exchangeRate?.rateId || "");
    setValidUntil(exchangeRate?.validUntil ? new Date(exchangeRate.validUntil) : undefined);
    setTransactionForm((val) => ({
      ...val,
      exchangeRateId: exchangeRate?.rateId as string,
    }));

    // Store exchange rate ID in session storage
    if (exchangeRate?.rateId) {
      sessionStorage.setItem("exchangeRateId", exchangeRate.rateId);
    }
  }, [exchangeRate]);

  // Reset form when switching between buy/sell tabs
  useEffect(() => {
    setTransactionForm((prev) => ({
      ...prev,
      type: activeTab.toUpperCase() === "BUY" ? "BUY" : "SELL",
    }));
    setNumberOfToken("");
    setAmountToBuy("");
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
      value: loadingExchangeRate ? 'Loading...' : countdown || "Loading...",
    },
    // {
    //   title: "You will receive",
    //   value: isDebouncing
    //     ? 'Typing...'
    //     : loadingCalculation
    //       ? 'Calculating...'
    //       : amountToReceive > 0
    //         ? `${amountToReceive.toLocaleString()} ${activeTab === "sell" ? selectedCurrency?.name : selectedToken?.name}`
    //         : `0 ${activeTab === "sell" ? selectedCurrency?.name : selectedToken?.name}`,
    // }
  ]

  const handleReceiptUrl = (url: string) => {
    setTransactionForm((prev) => ({
      ...prev,
        receiptUrl: url
    }))
  };

  const handleTransactionHash = (hash: string) => {
    setTransactionForm((prev) => ({
      ...prev,
        transactionHash: hash
    }))
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
    exchangeRateId,
    loadingCalculation,
    isDebouncing,
    transactionForm,
    transactionSessionId,

    // Mutations
    initiateTransactionMutation,

    // Functions
    setAmountToBuy,
    setNumberOfToken,
    setSelectedCurrency,
    setSelectedToken,
    handleReceiptUrl,
    handleTransactionHash,
  };
}