import {useEffect, useState} from "react";
import type {TradeAdditionalInfoInterface, TradeType} from "../../../types/trade.types.ts";
import {useCurrencyQuery} from "../../../queries/currency.query.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.api.types.ts";
import {useCryptoQuery} from "../../../queries/crypto.query.ts";
import {useRateQuery} from "../../../queries/rate.query.ts";
import {useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS} from "../../../queries/query.keys.ts";

export const useTradeStepDisplay = (token: string, tradeType: TradeType, activeTab: TradeType, currency: string) => {
  const [selectedToken, setSelectedToken] = useState<SupportedCryptoOrCurrencyResponse>();
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCryptoOrCurrencyResponse>();
  const [countdown, setCountdown] = useState<string>("");

  const queryClient = useQueryClient();
  const { supportedCurrencies } = useCurrencyQuery();
  const { supportedCryptoCurrencies } = useCryptoQuery();
  const { exchangeRate, loadingExchangeRate } = useRateQuery(selectedToken?.id || '', selectedCurrency?.id || '', tradeType.toUpperCase() === 'BUY' ? 'BUY' : 'SELL');

  const [numberOfToken, setNumberOfToken] = useState<string | number>("");
  const [exchangeRateId, setExchangeRateId] = useState("");
  const [validUntil, setValidUntil] = useState<Date>();
  const [amountToBuy, setAmountToBuy] = useState<string | number>("");

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

  // useEffect(() => {
  //   if (activeTab === "sell" && numberOfToken !== "" && rate !== 0) {
  //     setAmountToBuy((Number(numberOfToken) * rate).toFixed(5));
  //   }
  //
  //   if(activeTab === "buy" && amountToBuy !== "" && rate !== 0) {
  //     setNumberOfToken((Number(amountToBuy) / rate).toFixed(5));
  //   }
  // }, [numberOfToken, amountToBuy, tradeType, rate]);

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
  }, [supportedCurrencies, supportedCryptoCurrencies])

  useEffect(() => {
    setExchangeRateId(exchangeRate?.rateId || "");
    setValidUntil(exchangeRate?.validUntil ? new Date(exchangeRate.validUntil) : undefined);
  }, [exchangeRate, loadingExchangeRate]);



  const amountToReceive: number = tradeType === "sell" ? Number(amountToBuy) : Number(numberOfToken);

  const AdditionalInfo: TradeAdditionalInfoInterface[] = [
    {
      title: "Rate",
      value: loadingExchangeRate ? '' : `1 ${selectedToken?.symbol} = ${exchangeRate?.fiatRate?.toLocaleString() || 0} ${selectedCurrency?.code}`,
    },
    {
      title: "Valid until",
      value: loadingExchangeRate ? '' : countdown || "Loading...",
    },
    {
      title: "You will receive",
      value: `${amountToReceive} ${tradeType === "sell"? `${selectedCurrency?.name}`: `${selectedToken?.name}`}`,
    }
  ]

  return {
    // Values
    selectedToken,
    numberOfToken,
    AdditionalInfo,
    amountToBuy,
    amountToReceive,
    selectedCurrency,
    supportedCurrencies,
    supportedCryptoCurrencies,
    countdown,

    // Functions
    setAmountToBuy,
    setNumberOfToken,
    setSelectedCurrency,
    setSelectedToken,
  };
}